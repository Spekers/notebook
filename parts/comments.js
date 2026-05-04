(function () {
	const root = document.getElementById("comments");
	if (!root) return;
	const api = root.dataset.commentsApi;
	const list = document.getElementById("comments-list");
	const form = document.getElementById("comments-form");
	const status = document.getElementById("comments-status");
	const slug = location.pathname.replace(/\/+$/, "") || "/";

	const URL_RE = /\b(https?:\/\/[^\s<>()"']+[^\s<>()"'.,;:!?])/g;

	function relTime(ts) {
		const diff = (Date.now() - ts) / 1000;
		if (diff < 60) return "just now";
		if (diff < 3600) return Math.floor(diff / 60) + "m ago";
		if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
		if (diff < 86400 * 30) return Math.floor(diff / 86400) + "d ago";
		const d = new Date(ts);
		return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
	}

	function appendLinkified(parent, text) {
		let last = 0;
		text.replace(URL_RE, (m, _g, off) => {
			if (off > last) parent.appendChild(document.createTextNode(text.slice(last, off)));
			const a = document.createElement("a");
			a.href = m;
			a.textContent = m;
			a.rel = "nofollow noopener ugc";
			a.target = "_blank";
			parent.appendChild(a);
			last = off + m.length;
			return m;
		});
		if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
	}

	function renderComment(c) {
		const li = document.createElement("li");
		li.className = "comment";
		const meta = document.createElement("div");
		meta.className = "comment-meta";
		const name = document.createElement("span");
		name.className = "comment-name";
		name.textContent = c.name;
		const time = document.createElement("time");
		time.dateTime = new Date(c.created_at).toISOString();
		time.textContent = relTime(c.created_at);
		meta.appendChild(name);
		meta.appendChild(document.createTextNode(" · "));
		meta.appendChild(time);
		const body = document.createElement("div");
		body.className = "comment-body";
		c.body.split(/\n{2,}/).forEach((para) => {
			const p = document.createElement("p");
			para.split(/\n/).forEach((line, i, arr) => {
				appendLinkified(p, line);
				if (i < arr.length - 1) p.appendChild(document.createElement("br"));
			});
			body.appendChild(p);
		});
		li.appendChild(meta);
		li.appendChild(body);
		return li;
	}

	function renderList(comments) {
		list.replaceChildren();
		if (!comments.length) {
			const empty = document.createElement("li");
			empty.className = "comments-empty";
			empty.textContent = "No notes yet — be the first.";
			list.appendChild(empty);
			return;
		}
		comments.forEach((c) => list.appendChild(renderComment(c)));
	}

	async function load() {
		try {
			const res = await fetch(api + "?slug=" + encodeURIComponent(slug), { headers: { Accept: "application/json" } });
			if (!res.ok) throw new Error("http " + res.status);
			const data = await res.json();
			renderList(data.comments || []);
		} catch {
			list.replaceChildren();
			const err = document.createElement("li");
			err.className = "comments-empty";
			err.textContent = "Couldn't load notes.";
			list.appendChild(err);
		}
	}

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		status.textContent = "";
		const fd = new FormData(form);
		const turnstile = (form.querySelector('[name="cf-turnstile-response"]') || {}).value || "";
		const payload = {
			slug,
			name: fd.get("name"),
			body: fd.get("body"),
			website: fd.get("website") || "",
			turnstile,
		};
		const btn = form.querySelector("button[type=submit]");
		btn.disabled = true;
		try {
			const res = await fetch(api, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				const map = {
					rate_limited: "Slow down a moment — try again in 30s.",
					turnstile_failed: "Couldn't verify you're human. Reload and try again.",
					bad_input: "Please fill in both fields.",
				};
				status.textContent = map[data.error] || "Something went wrong.";
			} else {
				status.textContent = "Thanks — your note is queued for review.";
				form.reset();
				if (window.turnstile) window.turnstile.reset();
			}
		} catch {
			status.textContent = "Network error. Try again.";
		} finally {
			btn.disabled = false;
		}
	});

	load();
})();
