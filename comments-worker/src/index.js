const MAX_NAME = 60;
const MAX_BODY = 2000;
const MAX_SLUG = 200;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_HTML = 200_000;
const RATE_WINDOW_MS = 30_000;
const CONFIRM_RESEND_MS = 60 * 60 * 1000;
const PAGE_LIMIT = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
	async fetch(req, env) {
		const url = new URL(req.url);
		const cors = corsHeaders(env, req);

		if (req.method === "OPTIONS") return new Response(null, { headers: cors });

		if (!env.IP_SALT || !env.TURNSTILE_SECRET || !env.ADMIN_TOKEN) {
			return json({ error: "misconfigured" }, 500, cors);
		}

		try {
			if (url.pathname === "/api/comments" && req.method === "GET") return await listComments(req, env, cors);
			if (url.pathname === "/api/comments" && req.method === "POST") return await postComment(req, env, cors);
			if (url.pathname === "/api/subscribe" && req.method === "POST") return await postSubscribe(req, env, cors);
			if (url.pathname === "/api/confirm" && req.method === "GET") return await getConfirm(req, env);
			if (url.pathname === "/api/unsubscribe" && req.method === "GET") return await getUnsubscribe(req, env);
			if (url.pathname === "/api/unsubscribe" && req.method === "POST") return await postUnsubscribe(req, env);
			if (url.pathname === "/admin/pending" && req.method === "GET") return await adminPending(req, env, cors);
			if (url.pathname === "/admin/approve" && req.method === "POST") return await adminApprove(req, env, cors);
			if (url.pathname === "/admin/delete" && req.method === "POST") return await adminDelete(req, env, cors);
			if (url.pathname === "/admin/subscribers" && req.method === "GET") return await adminSubscribers(req, env, cors);
			if (url.pathname === "/admin/send" && req.method === "POST") return await adminSend(req, env, cors);
		} catch {
			return json({ error: "internal" }, 500, cors);
		}

		return json({ error: "not_found" }, 404, cors);
	},
};

function corsHeaders(env, req) {
	const origin = req.headers.get("Origin") || "";
	const allowed = (env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
	const allow = allowed.includes(origin) ? origin : allowed[0] || "";
	return {
		"Access-Control-Allow-Origin": allow,
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Vary": "Origin",
	};
}

function json(body, status = 200, extra = {}) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json; charset=utf-8", ...extra },
	});
}

function normSlug(s) {
	if (typeof s !== "string") return null;
	if (!s.startsWith("/") || s.length > MAX_SLUG) return null;
	if (!/^[A-Za-z0-9/_\-.]+$/.test(s)) return null;
	return s.replace(/\/+$/, "") || "/";
}

function clean(s, max) {
	if (typeof s !== "string") return null;
	// eslint-disable-next-line no-control-regex
	const t = s.replace(/\r\n/g, "\n").replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "").trim();
	if (!t || t.length > max) return null;
	return t;
}

async function hashIp(ip, salt) {
	const data = new TextEncoder().encode(salt + "|" + (ip || ""));
	const buf = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token, secret, ip) {
	if (!token) return false;
	const form = new FormData();
	form.append("secret", secret);
	form.append("response", token);
	if (ip) form.append("remoteip", ip);
	const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		method: "POST",
		body: form,
	});
	const data = await res.json();
	return !!data.success;
}

async function listComments(req, env, cors) {
	const url = new URL(req.url);
	const slug = normSlug(url.searchParams.get("slug"));
	if (!slug) return json({ error: "bad_slug" }, 400, cors);

	const { results } = await env.sips_log_comments.prepare(
		"SELECT id, name, body, created_at FROM comments WHERE slug = ? AND approved = 1 ORDER BY created_at ASC LIMIT ?"
	).bind(slug, PAGE_LIMIT).all();

	return json({ comments: results }, 200, cors);
}

async function postComment(req, env, cors) {
	let payload;
	try { payload = await req.json(); } catch { return json({ error: "bad_json" }, 400, cors); }

	if (payload.website) return json({ ok: true, queued: true }, 200, cors); // honeypot: silently drop

	const slug = normSlug(payload.slug);
	const name = clean(payload.name, MAX_NAME);
	const body = clean(payload.body, MAX_BODY);
	if (!slug || !name || !body) return json({ error: "bad_input" }, 400, cors);

	const ip = req.headers.get("CF-Connecting-IP") || "";
	const ok = await verifyTurnstile(payload.turnstile, env.TURNSTILE_SECRET, ip);
	if (!ok) return json({ error: "turnstile_failed" }, 400, cors);

	const ip_hash = await hashIp(ip, env.IP_SALT);
	const now = Date.now();

	const recent = await env.sips_log_comments.prepare(
		"SELECT created_at FROM comments WHERE ip_hash = ? ORDER BY created_at DESC LIMIT 1"
	).bind(ip_hash).first();
	if (recent && now - recent.created_at < RATE_WINDOW_MS) {
		return json({ error: "rate_limited" }, 429, cors);
	}

	const approved = env.AUTO_APPROVE === "true" ? 1 : 0;
	await env.sips_log_comments.prepare(
		"INSERT INTO comments (slug, name, body, created_at, approved, ip_hash) VALUES (?, ?, ?, ?, ?, ?)"
	).bind(slug, name, body, now, approved, ip_hash).run();

	return json({ ok: true, queued: !approved }, 200, cors);
}

function requireAdmin(req, env) {
	if (!env.ADMIN_TOKEN) return false;
	const auth = req.headers.get("Authorization") || "";
	const expected = "Bearer " + env.ADMIN_TOKEN;
	const a = new TextEncoder().encode(auth);
	const b = new TextEncoder().encode(expected);
	if (a.byteLength !== b.byteLength) return false;
	let diff = 0;
	for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}

async function adminPending(req, env, cors) {
	if (!requireAdmin(req, env)) return json({ error: "unauthorized" }, 401, cors);
	const { results } = await env.sips_log_comments.prepare(
		"SELECT id, slug, name, body, created_at FROM comments WHERE approved = 0 ORDER BY created_at ASC LIMIT 500"
	).all();
	return json({ comments: results }, 200, cors);
}

async function adminApprove(req, env, cors) {
	if (!requireAdmin(req, env)) return json({ error: "unauthorized" }, 401, cors);
	const { id } = await req.json().catch(() => ({}));
	if (!Number.isInteger(id)) return json({ error: "bad_id" }, 400, cors);
	await env.sips_log_comments.prepare("UPDATE comments SET approved = 1 WHERE id = ?").bind(id).run();
	return json({ ok: true }, 200, cors);
}

async function adminDelete(req, env, cors) {
	if (!requireAdmin(req, env)) return json({ error: "unauthorized" }, 401, cors);
	const { id } = await req.json().catch(() => ({}));
	if (!Number.isInteger(id)) return json({ error: "bad_id" }, 400, cors);
	await env.sips_log_comments.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
	return json({ ok: true }, 200, cors);
}

function normEmail(s) {
	if (typeof s !== "string") return null;
	const t = s.trim().toLowerCase();
	if (!t || t.length > MAX_EMAIL || !EMAIL_RE.test(t)) return null;
	return t;
}

function randomToken() {
	const buf = new Uint8Array(24);
	crypto.getRandomValues(buf);
	return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function htmlPage(title, bodyHtml) {
	return new Response(
		`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>${escapeHtml(title)}</title><style>body{font-family:Georgia,serif;max-width:34rem;margin:6rem auto;padding:0 1.5rem;color:#111;line-height:1.5}a{color:inherit}button{font:inherit;padding:0.5em 1.2em;cursor:pointer}</style></head><body>${bodyHtml}</body></html>`,
		{
			status: 200,
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Referrer-Policy": "no-referrer",
				"X-Content-Type-Options": "nosniff",
				"X-Frame-Options": "DENY",
				"Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'",
			},
		},
	);
}

async function sendEmail(env, { to, subject, html, headers }) {
	const body = {
		from: env.FROM_EMAIL,
		to: [to],
		subject,
		html,
		reply_to: env.REPLY_TO || undefined,
		headers: headers || undefined,
	};
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + env.RESEND_API_KEY,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	return res.ok;
}

async function sendEmailBatch(env, emails) {
	const res = await fetch("https://api.resend.com/emails/batch", {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + env.RESEND_API_KEY,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(emails),
	});
	let body = null;
	try { body = await res.json(); } catch {}
	return { ok: res.ok, status: res.status, body };
}

function confirmUrl(env, token) {
	return env.PUBLIC_API_BASE + "/api/confirm?token=" + encodeURIComponent(token);
}

function unsubscribeUrl(env, token) {
	return env.PUBLIC_API_BASE + "/api/unsubscribe?token=" + encodeURIComponent(token);
}

async function postSubscribe(req, env, cors) {
	if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.PUBLIC_API_BASE || !env.SITE_URL) {
		return json({ error: "misconfigured" }, 500, cors);
	}

	let payload;
	try { payload = await req.json(); } catch { return json({ error: "bad_json" }, 400, cors); }

	if (payload.website) return json({ ok: true }, 200, cors); // honeypot

	const email = normEmail(payload.email);
	if (!email) return json({ error: "bad_email" }, 400, cors);

	const ip = req.headers.get("CF-Connecting-IP") || "";
	const ok = await verifyTurnstile(payload.turnstile, env.TURNSTILE_SECRET, ip);
	if (!ok) return json({ error: "turnstile_failed" }, 400, cors);

	const ip_hash = await hashIp(ip, env.IP_SALT);
	const now = Date.now();

	const recent = await env.sips_log_comments.prepare(
		"SELECT created_at FROM subscribers WHERE ip_hash = ? ORDER BY created_at DESC LIMIT 1"
	).bind(ip_hash).first();
	if (recent && now - recent.created_at < RATE_WINDOW_MS) {
		return json({ error: "rate_limited" }, 429, cors);
	}

	const existing = await env.sips_log_comments.prepare(
		"SELECT id, token, confirmed_at, last_sent_at FROM subscribers WHERE email = ?"
	).bind(email).first();

	let token;
	if (existing) {
		token = existing.token;
		// Already confirmed: don't reveal, don't resend.
		if (existing.confirmed_at) return json({ ok: true }, 200, cors);
		// Pending but within the resend cooldown: return the same generic ok without sending again.
		if (existing.last_sent_at && now - existing.last_sent_at < CONFIRM_RESEND_MS) {
			return json({ ok: true }, 200, cors);
		}
		await env.sips_log_comments.prepare(
			"UPDATE subscribers SET last_sent_at = ? WHERE id = ?"
		).bind(now, existing.id).run();
	} else {
		token = randomToken();
		await env.sips_log_comments.prepare(
			"INSERT INTO subscribers (email, token, created_at, ip_hash, last_sent_at) VALUES (?, ?, ?, ?, ?)"
		).bind(email, token, now, ip_hash, now).run();
	}

	const link = confirmUrl(env, token);
	const html = `<p>Hi,</p><p>Please confirm you want to subscribe to <strong>Sip's Newsletter</strong> by clicking the link below:</p><p><a href="${escapeHtml(link)}">Confirm my subscription</a></p><p>If you didn't ask for this, just ignore this email and you won't be subscribed.</p><p>— Sip</p>`;
	await sendEmail(env, {
		to: email,
		subject: "Confirm your subscription to Sip's Newsletter",
		html,
	});

	return json({ ok: true }, 200, cors);
}

async function getConfirm(req, env) {
	const url = new URL(req.url);
	const token = (url.searchParams.get("token") || "").trim();
	if (!token || token.length > 128) {
		return htmlPage("Invalid link", "<h1>Invalid link</h1><p>This confirmation link isn't valid.</p>");
	}
	const row = await env.sips_log_comments.prepare(
		"SELECT id, confirmed_at FROM subscribers WHERE token = ?"
	).bind(token).first();
	if (!row) {
		return htmlPage("Invalid link", "<h1>Invalid link</h1><p>This confirmation link isn't valid (it may have already been used or revoked).</p>");
	}
	if (!row.confirmed_at) {
		await env.sips_log_comments.prepare(
			"UPDATE subscribers SET confirmed_at = ? WHERE id = ?"
		).bind(Date.now(), row.id).run();
	}
	const site = env.SITE_URL || "/";
	return htmlPage(
		"Subscription confirmed",
		`<h1>You're in.</h1><p>Thanks for confirming — you'll get the next dispatch of Sip's Newsletter when it goes out.</p><p><a href="${escapeHtml(site)}/newsletters/">← Back to the newsletter</a></p>`,
	);
}

async function getUnsubscribe(req, env) {
	const url = new URL(req.url);
	const token = (url.searchParams.get("token") || "").trim();
	if (!token || token.length > 128) {
		return htmlPage("Invalid link", "<h1>Invalid link</h1><p>This unsubscribe link isn't valid.</p>");
	}
	const row = await env.sips_log_comments.prepare(
		"SELECT id FROM subscribers WHERE token = ?"
	).bind(token).first();
	if (!row) {
		return htmlPage("Invalid link", "<h1>Invalid link</h1><p>This unsubscribe link isn't valid (it may have already been used).</p>");
	}
	const action = "/api/unsubscribe?token=" + encodeURIComponent(token);
	return htmlPage(
		"Unsubscribe from Sip's Newsletter",
		`<h1>Unsubscribe?</h1><p>Click the button below to stop receiving Sip's Newsletter.</p><form method="POST" action="${escapeHtml(action)}"><button type="submit">Unsubscribe</button></form>`,
	);
}

async function postUnsubscribe(req, env) {
	const url = new URL(req.url);
	const token = (url.searchParams.get("token") || "").trim();
	const wantsHtml = (req.headers.get("Accept") || "").includes("text/html");
	if (!token || token.length > 128) {
		if (wantsHtml) return htmlPage("Invalid link", "<h1>Invalid link</h1><p>This unsubscribe link isn't valid.</p>");
		return new Response("invalid", { status: 400 });
	}
	await env.sips_log_comments.prepare(
		"DELETE FROM subscribers WHERE token = ?"
	).bind(token).run();
	if (!wantsHtml) return new Response("ok", { status: 200 });
	const site = env.SITE_URL || "/";
	return htmlPage(
		"Unsubscribed",
		`<h1>You're unsubscribed.</h1><p>You won't receive any more newsletter emails from Sip's Logbook.</p><p><a href="${escapeHtml(site)}/">← Back to the site</a></p>`,
	);
}

async function adminSubscribers(req, env, cors) {
	if (!requireAdmin(req, env)) return json({ error: "unauthorized" }, 401, cors);
	const { results } = await env.sips_log_comments.prepare(
		"SELECT id, email, created_at, confirmed_at FROM subscribers ORDER BY created_at DESC LIMIT 1000"
	).all();
	return json({ subscribers: results }, 200, cors);
}

async function adminSend(req, env, cors) {
	if (!requireAdmin(req, env)) return json({ error: "unauthorized" }, 401, cors);
	if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.PUBLIC_API_BASE) {
		return json({ error: "misconfigured" }, 500, cors);
	}

	let payload;
	try { payload = await req.json(); } catch { return json({ error: "bad_json" }, 400, cors); }

	const subject = clean(payload.subject, MAX_SUBJECT);
	const bodyHtml = typeof payload.html === "string" && payload.html.length <= MAX_HTML ? payload.html : null;
	const testTo = payload.test_to ? normEmail(payload.test_to) : null;
	if (!subject || !bodyHtml) return json({ error: "bad_input" }, 400, cors);

	let recipients;
	if (testTo) {
		const row = await env.sips_log_comments.prepare(
			"SELECT email, token FROM subscribers WHERE email = ? AND confirmed_at IS NOT NULL"
		).bind(testTo).first();
		if (!row) return json({ error: "test_recipient_not_subscribed" }, 400, cors);
		recipients = [row];
	} else {
		const { results } = await env.sips_log_comments.prepare(
			"SELECT email, token FROM subscribers WHERE confirmed_at IS NOT NULL"
		).all();
		recipients = results;
	}

	const emails = recipients.map(r => {
		const unsub = unsubscribeUrl(env, r.token);
		const footer = `<hr><p style="font-size:0.85em;color:#666">You're receiving this because you subscribed to Sip's Newsletter. <a href="${escapeHtml(unsub)}">Unsubscribe</a>.</p>`;
		return {
			from: env.FROM_EMAIL,
			to: [r.email],
			subject,
			html: bodyHtml + footer,
			reply_to: env.REPLY_TO || undefined,
			headers: {
				"List-Unsubscribe": `<${unsub}>`,
				"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
			},
		};
	});

	const BATCH_SIZE = 100;
	let sent = 0, failed = 0;
	const failures = [];
	for (let i = 0; i < emails.length; i += BATCH_SIZE) {
		const chunk = emails.slice(i, i + BATCH_SIZE);
		const result = await sendEmailBatch(env, chunk);
		const chunkRecipients = chunk.map(e => e.to[0]);
		if (result.ok) {
			sent += chunk.length;
		} else {
			failed += chunk.length;
			failures.push({ status: result.status, error: result.body, recipients: chunkRecipients });
			console.log("batch send failed", result.status, JSON.stringify(result.body), chunkRecipients);
		}
	}

	return json({ ok: true, sent, failed, total: recipients.length, failures }, 200, cors);
}
