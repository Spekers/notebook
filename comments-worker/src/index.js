const MAX_NAME = 60;
const MAX_BODY = 2000;
const MAX_SLUG = 200;
const RATE_WINDOW_MS = 30_000;
const PAGE_LIMIT = 200;

export default {
	async fetch(req, env) {
		const url = new URL(req.url);
		const cors = corsHeaders(env, req);

		if (req.method === "OPTIONS") return new Response(null, { headers: cors });

		try {
			if (url.pathname === "/api/comments" && req.method === "GET") return await listComments(req, env, cors);
			if (url.pathname === "/api/comments" && req.method === "POST") return await postComment(req, env, cors);
			if (url.pathname === "/admin/pending" && req.method === "GET") return await adminPending(req, env, cors);
			if (url.pathname === "/admin/approve" && req.method === "POST") return await adminApprove(req, env, cors);
			if (url.pathname === "/admin/delete" && req.method === "POST") return await adminDelete(req, env, cors);
		} catch (err) {
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
	if (!secret) return true;
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

	const ip_hash = await hashIp(ip, env.IP_SALT || "unset");
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
	const auth = req.headers.get("Authorization") || "";
	const expected = "Bearer " + (env.ADMIN_TOKEN || "");
	return env.ADMIN_TOKEN && auth === expected;
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
