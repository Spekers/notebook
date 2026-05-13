(function () {
	var canvas = document.querySelector('canvas.home-shimmer');
	if (!canvas) return;

	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) {
		canvas.classList.add('is-static');
		return;
	}

	var W = 160, H = 160;
	canvas.width = W;
	canvas.height = H;
	var ctx = canvas.getContext('2d');
	var img = ctx.createImageData(W, H);
	var data = img.data;

	var a = new Float32Array(W * H);
	var b = new Float32Array(W * H);

	var BR = 224, BG = 215, BB = 223;

	function drop(cx, cy, r, amp) {
		var r2 = r * r;
		var x0 = Math.max(1, (cx - r) | 0), x1 = Math.min(W - 1, (cx + r + 1) | 0);
		var y0 = Math.max(1, (cy - r) | 0), y1 = Math.min(H - 1, (cy + r + 1) | 0);
		for (var y = y0; y < y1; y++) {
			for (var x = x0; x < x1; x++) {
				var dx = x - cx, dy = y - cy;
				var d2 = dx * dx + dy * dy;
				if (d2 < r2) a[y * W + x] += amp * (1 - d2 / r2);
			}
		}
	}

	function step() {
		for (var y = 1; y < H - 1; y++) {
			var row = y * W;
			for (var x = 1; x < W - 1; x++) {
				var i = row + x;
				var v = (a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) * 0.5 - b[i];
				b[i] = v * 0.9;
			}
		}
		var t = a; a = b; b = t;
	}

	function render() {
		for (var y = 0; y < H; y++) {
			var row = y * W;
			for (var x = 0; x < W; x++) {
				var i = row + x;
				var gx = (x > 0 && x < W - 1) ? (a[i + 1] - a[i - 1]) : 0;
				var gy = (y > 0 && y < H - 1) ? (a[i + W] - a[i - W]) : 0;
				var s = (gx + gy * 0.5) * 9;
				var r, g, bb;
				if (s > 0) {
					var th = s < 1 ? s : 1;
					r = BR + (255 - BR) * th;
					g = BG + (255 - BG) * th;
					bb = BB + (255 - BB) * th;
				} else {
					var td = -s < 1 ? -s : 1;
					var k = 1 - td * 0.7;
					r = BR * k; g = BG * k; bb = BB * k;
				}
				var p = i * 4;
				data[p] = r; data[p + 1] = g; data[p + 2] = bb; data[p + 3] = 255;
			}
		}
		ctx.putImageData(img, 0, 0);
	}

	var lastInteract = 0;
	var lastMove = 0;

	function localCoords(clientX, clientY) {
		var rect = canvas.getBoundingClientRect();
		return [
			((clientX - rect.left) / rect.width) * W,
			((clientY - rect.top) / rect.height) * H
		];
	}

	canvas.addEventListener('pointermove', function (e) {
		var now = performance.now();
		if (now - lastMove < 30) return;
		lastMove = now;
		var c = localCoords(e.clientX, e.clientY);
		drop(c[0], c[1], 1.5, 0.6);
		lastInteract = now;
	});
	canvas.addEventListener('pointerdown', function (e) {
		var c = localCoords(e.clientX, e.clientY);
		drop(c[0], c[1], 3, 4);
		lastInteract = performance.now();
	});

	var visible = true;
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(function (entries) {
			visible = entries[0].isIntersecting;
		}).observe(canvas);
	}

	var nextAuto = 0;
	var tick = 0;
	function frame(now) {
		if (visible) {
			if (now - lastInteract > 3000 && now > nextAuto) {
				drop(Math.random() * W, Math.random() * H, 1.5 + Math.random() * 1.5, 0.5 + Math.random() * 0.5);
				nextAuto = now + 1600 + Math.random() * 2200;
			}
			if ((tick++ & 2) === 0) step();
			render();
		}
		requestAnimationFrame(frame);
	}

	drop(W * 0.32, H * 0.38, 2.5, 1.6);
	drop(W * 0.68, H * 0.62, 2.5, 1.6);
	requestAnimationFrame(frame);
})();
