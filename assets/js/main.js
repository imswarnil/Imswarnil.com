/* =============================================================================
   Swarnil — theme behaviour.
   Small on purpose: the design system is CSS, and anything that can be done
   with markup or a native element is not done here.
   ========================================================================== */
(function () {
	'use strict';

	/* ── Copy the page URL ─────────────────────────────────────────────────
	   [data-copy-url] on any button. Says so when it worked. */
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-copy-url]');
		if (!btn) return;
		navigator.clipboard.writeText(window.location.href).then(function () {
			var label = btn.textContent;
			btn.textContent = 'Copied';
			setTimeout(function () { btn.textContent = label; }, 1600);
		});
	});

	/* ── Video facade ───────────────────────────────────────────────────────
	   The player partial paints a poster; nothing is requested from YouTube
	   until the reader presses play. On click we move the post's own first
	   embed into the stage — so the markup stays honest and there is no
	   hardcoded video id anywhere in the theme. */
	document.addEventListener('click', function (e) {
		var play = e.target.closest('[data-player] .play');
		if (!play) return;

		var stage = play.closest('[data-player]');
		var embed = document.querySelector('.content iframe, .content video');

		if (!embed) return;                       // nothing to play — leave the poster

		var host = embed.closest('figure') || embed;
		stage.querySelectorAll('img, .pattern, .play').forEach(function (el) { el.remove(); });
		stage.appendChild(embed);
		embed.style.width = '100%';
		embed.style.height = '100%';
		if (host !== embed && !host.querySelector('iframe, video')) host.remove();

		// Autoplay if the provider understands the parameter.
		if (embed.tagName === 'IFRAME' && embed.src.indexOf('autoplay') === -1) {
			embed.src += (embed.src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
		} else if (embed.tagName === 'VIDEO') {
			embed.play();
		}
	});

	/* ── Lazy images ────────────────────────────────────────────────────────
	   Everything below the fold defers, without per-template attributes. */
	document.querySelectorAll('.content img, .c__media img').forEach(function (img) {
		if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
		if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
	});

	/* ── You are here, in the playlist ──────────────────────────────────────
	   The lesson list is built inside three nested {{#get}} blocks, and the
	   post being viewed is out of reach in there: `../` counts a different
	   number of levels per branch, and gscan rejects `@root` as a helper
	   argument. So the comparison HTML could not make happens here — and
	   collection.js reads the same aria-current afterwards, which is why this
	   runs first. */
	var here = location.pathname.replace(/\/+$/, '');
	document.querySelectorAll('.curriculum .lesson-row').forEach(function (row) {
		var href = row.getAttribute('href') || '';
		var path = href.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '');
		if (path && path === here) row.setAttribute('aria-current', 'true');
	});

	/* ── Internal tag labels ────────────────────────────────────────────────
	   An internal tag is named for the machine — "#country-hungary" — because
	   its slug is the id the filters match on. Handlebars cannot slice a
	   string, so the prefix comes off here: data-trim="#country-" turns that
	   label into "Hungary". Worst case the script never runs and the reader
	   sees the raw tag, which is ugly but still true. */
	document.querySelectorAll('[data-trim]').forEach(function (el) {
		var pre = el.getAttribute('data-trim');
		var txt = el.textContent.trim();
		if (txt.indexOf(pre) !== 0) return;
		txt = txt.slice(pre.length).replace(/-/g, ' ');
		el.textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
	});
})();

/* =============================================================================
   NAVIGATION — the parts that are this THEME's, not the system's.
   Scroll state, hover intent, the in-place panel and the submenu row are all
   handled by nav.js from the design system; everything below is Ghost-shaped
   and belongs here.
   ========================================================================== */
(function () {
	'use strict';

	/* ── The active link ────────────────────────────────────────────────────
	   Ghost marks the current item, but only on an exact URL match — so
	   /courses/java/lesson-1/ leaves "Courses" unlit. Longest matching path
	   prefix wins; we stand down entirely if Ghost already marked something. */
	var here = window.location.pathname;

	var mark = function (links) {
		if (links.some(function (a) { return a.hasAttribute('aria-current'); })) return;
		var best = null, bestLen = 0;
		links.forEach(function (a) {
			var path;
			try { path = new URL(a.href, window.location.origin).pathname; } catch (e) { return; }
			if (path === '/' || here.indexOf(path) !== 0) return;
			if (path.length > bestLen) { best = a; bestLen = path.length; }
		});
		if (best) best.setAttribute('aria-current', 'page');
	};

	mark(Array.prototype.slice.call(document.querySelectorAll('.nav-link')));
	mark(Array.prototype.slice.call(document.querySelectorAll('.nav-panel__link')));

	/* ── Six in the bar, the rest behind "More" ─────────────────────────────
	   A Ghost menu has no length limit, and a bar that wraps is worse than a
	   bar with an overflow. Cap at six, then keep stowing from the end until
	   the row actually fits. */
	var MAX = 6;
	var links = document.querySelector('[data-nav-links]');
	var more = document.querySelector('[data-nav-more]');
	var panel = document.querySelector('[data-nav-more-panel]');

	if (links && more && panel) {
		var bar = links.closest('.nav-bar');
		var all = Array.prototype.slice.call(links.querySelectorAll(':scope > .nav-item'));

		var stow = function (item) {
			var a = item.querySelector('.nav-link');
			if (!a) return;
			var copy = document.createElement('a');
			copy.className = 'dropdown__item';
			copy.href = a.href;
			copy.textContent = a.textContent.trim();
			if (a.hasAttribute('aria-current')) copy.setAttribute('aria-current', 'page');
			panel.insertBefore(copy, panel.firstChild);
			item.remove();
		};

		var shown = all.slice(0, MAX);
		all.slice(MAX).reverse().forEach(stow);

		// Measure the BAR: the link row sits in a grid column that sizes to its
		// own content, so it never reports an overflow of its own.
		var trim = function () {
			var guard = 0;
			while (bar.scrollWidth > bar.clientWidth + 1 && shown.length > 1 && guard++ < 12) {
				stow(shown.pop());
				more.hidden = false;
			}
		};

		trim();
		if (panel.children.length) more.hidden = false;
		window.addEventListener('resize', trim);
	}

	/* ── Reading progress IS the border ─────────────────────────────────────
	   .nav-progress paints the island's hairline from --progress, so there is
	   no second piece of chrome under the bar. Only set on pages with an
	   article to measure; elsewhere the border stays a plain line. */
	var shell = document.querySelector('.nav-progress');
	var article = document.querySelector('.content');

	if (shell && article) {
		var tick = function () {
			var box = article.getBoundingClientRect();
			var total = box.height - window.innerHeight;
			var done = total > 0 ? Math.min(1, Math.max(0, -box.top / total)) : 0;
			shell.style.setProperty('--progress', (done * 100).toFixed(1) + '%');
		};
		tick();
		window.addEventListener('scroll', tick, { passive: true });
		window.addEventListener('resize', tick);
	}
})();

/* =============================================================================
   THEME
   Light and dark from one attribute on <html>. default.hbs resolves the stored
   choice before first paint; this only handles the toggle afterwards.
   ========================================================================== */
(function () {
	'use strict';

	var root = document.documentElement;
	var btn = document.querySelector('[data-theme-toggle]');
	if (!btn) return;

	var sync = function () {
		var dark = root.getAttribute('data-theme') === 'dark';
		var light = btn.querySelector('[data-theme-icon="light"]');
		var moon = btn.querySelector('[data-theme-icon="dark"]');
		if (light) light.classList.toggle('hidden', dark);
		if (moon) moon.classList.toggle('hidden', !dark);
		btn.setAttribute('aria-pressed', String(dark));
	};

	sync();

	btn.addEventListener('click', function () {
		var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		root.setAttribute('data-theme', next);
		try { localStorage.setItem('swarnil-theme', next); } catch (e) {}
		sync();
	});
})();
