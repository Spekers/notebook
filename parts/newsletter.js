(function () {
	const root = document.getElementById("subscribe");
	if (!root) return;
	const api = root.dataset.subscribeApi;
	const form = document.getElementById("subscribe-form");
	const status = document.getElementById("subscribe-status");

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		status.textContent = "";
		const fd = new FormData(form);
		const turnstile = (form.querySelector('[name="cf-turnstile-response"]') || {}).value || "";
		const payload = {
			email: fd.get("email"),
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
					bad_email: "That doesn't look like a valid email address.",
				};
				status.textContent = map[data.error] || "Something went wrong.";
			} else if (data.already) {
				status.textContent = "You're already subscribed — thanks!";
				form.reset();
				if (window.turnstile) window.turnstile.reset();
			} else {
				status.textContent = "Check your inbox for a confirmation link.";
				form.reset();
				if (window.turnstile) window.turnstile.reset();
			}
		} catch {
			status.textContent = "Network error. Try again.";
		} finally {
			btn.disabled = false;
		}
	});
})();
