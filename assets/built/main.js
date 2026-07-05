/* Swarnil theme JS — zero dependencies */
(function () {
	'use strict';

	/* ---------- Theme mode switcher (6 modes) ---------- */
	var DARK_MODES = { dark: 1, youtube: 1, netflix: 1 };
	function setMode(mode) {
		var root = document.documentElement;
		root.setAttribute('data-theme', mode);
		root.classList.toggle('dark', !!DARK_MODES[mode]);
		localStorage.setItem('swarnil-mode', mode);
		markActiveMode();
	}
	function markActiveMode() {
		var current = document.documentElement.getAttribute('data-theme');
		document.querySelectorAll('[data-set-mode]').forEach(function (b) {
			b.classList.toggle('is-active', b.getAttribute('data-set-mode') === current);
		});
	}
	document.querySelectorAll('[data-set-mode]').forEach(function (b) {
		b.addEventListener('click', function () {
			setMode(b.getAttribute('data-set-mode'));
		});
	});
	markActiveMode();

	/* ---------- Mega menu panel ---------- */
	var panelBtn = document.getElementById('panel-toggle');
	var panel = document.getElementById('mega-panel');
	if (panelBtn && panel) {
		panelBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			var open = panel.classList.toggle('hidden') === false;
			panelBtn.setAttribute('aria-expanded', String(open));
		});
		document.addEventListener('click', function (e) {
			if (!panel.contains(e.target)) panel.classList.add('hidden');
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') panel.classList.add('hidden');
		});
	}

	/* ---------- Mobile menu ---------- */
	var menuBtn = document.getElementById('mobile-menu-toggle');
	var menu = document.getElementById('mobile-menu');
	if (menuBtn && menu) {
		menuBtn.addEventListener('click', function () {
			var open = menu.classList.toggle('hidden') === false;
			menuBtn.setAttribute('aria-expanded', String(open));
			menuBtn.querySelector('.menu-open').classList.toggle('hidden', open);
			menuBtn.querySelector('.menu-close').classList.toggle('hidden', !open);
		});
	}

	/* ---------- Dropdowns ---------- */
	document.querySelectorAll('[data-dropdown]').forEach(function (dd) {
		var btn = dd.querySelector('[data-dropdown-toggle]');
		var panel = dd.querySelector('[data-dropdown-menu]');
		if (!btn || !panel) return;
		function close() {
			panel.removeAttribute('data-open');
			btn.setAttribute('aria-expanded', 'false');
		}
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			var open = panel.hasAttribute('data-open');
			open ? close() : (panel.setAttribute('data-open', ''), btn.setAttribute('aria-expanded', 'true'));
		});
		document.addEventListener('click', close);
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') close();
		});
	});

	/* ---------- Navbar: flat bar → floating island on scroll ---------- */
	var island = document.getElementById('nav-island');
	if (island) {
		var applyIsland = function () {
			island.classList.toggle('is-island', window.scrollY > 32);
		};
		window.addEventListener('scroll', applyIsland, { passive: true });
		applyIsland();
	}

	/* ---------- Member avatar initial ---------- */
	document.querySelectorAll('[data-avatar-initial]').forEach(function (el) {
		var name = (el.getAttribute('data-avatar-initial') || '').trim();
		if (name) el.textContent = name.charAt(0).toUpperCase();
	});

	/* ---------- Reveal on scroll ---------- */
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (en) {
					if (en.isIntersecting) {
						en.target.classList.add('is-visible');
						io.unobserve(en.target);
					}
				});
			},
			{ rootMargin: '0px 0px -8% 0px' }
		);
		document.querySelectorAll('.reveal').forEach(function (el) {
			io.observe(el);
		});
	} else {
		document.querySelectorAll('.reveal').forEach(function (el) {
			el.classList.add('is-visible');
		});
	}

	/* ---------- Table of contents + scrollspy ---------- */
	var toc = document.getElementById('toc');
	var tocList = document.getElementById('toc-list');
	var content = document.querySelector('.gh-content');
	if (toc && tocList && content) {
		var headings = content.querySelectorAll('h2, h3');
		if (headings.length > 1) {
			toc.hidden = false;
			headings.forEach(function (h, i) {
				if (!h.id) h.id = 'section-' + (i + 1) + '-' + h.textContent.trim().toLowerCase().replace(/[^\w]+/g, '-');
				var a = document.createElement('a');
				a.href = '#' + h.id;
				a.textContent = h.textContent;
				a.className = 'toc-link' + (h.tagName === 'H3' ? ' pl-8' : '');
				tocList.appendChild(a);
			});
			if ('IntersectionObserver' in window) {
				var spy = new IntersectionObserver(
					function (entries) {
						entries.forEach(function (en) {
							if (en.isIntersecting) {
								tocList.querySelectorAll('.toc-link').forEach(function (l) {
									l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
								});
							}
						});
					},
					{ rootMargin: '-20% 0px -70% 0px' }
				);
				headings.forEach(function (h) {
					spy.observe(h);
				});
			}
		}
	}

	/* ---------- Copy link ---------- */
	document.querySelectorAll('[data-copy-link]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var wrap = btn.closest('[data-share]');
			var url = (wrap && wrap.getAttribute('data-url')) || location.href;
			navigator.clipboard.writeText(url).then(function () {
				btn.classList.add('!text-ink');
				setTimeout(function () {
					btn.classList.remove('!text-ink');
				}, 1200);
			});
		});
	});

	/* ---------- Native share (mobile) ---------- */
	document.querySelectorAll('[data-share]').forEach(function (wrap) {
		if (!navigator.share) return;
		wrap.addEventListener('click', function (e) {
			var el = e.target.closest('[data-native-share]');
			if (!el) return;
			e.preventDefault();
			navigator.share({ title: wrap.getAttribute('data-title'), url: wrap.getAttribute('data-url') });
		});
	});

	/* ---------- Duration tags: <el data-duration-tags="hash-duration-1h-30m ..."> ---------- */
	document.querySelectorAll('[data-duration-tags]').forEach(function (el) {
		var m = (el.getAttribute('data-duration-tags') || '').match(/hash-duration-([\w-]+)/);
		if (!m) return;
		var text = m[1]
			.split('-')
			.map(function (p) {
				return p.replace(/(\d+)h/, '$1 hr').replace(/(\d+)m/, '$1 min');
			})
			.join(' ');
		el.textContent = text;
		el.hidden = false;
	});

	/* ---------- External links open in new tab ---------- */
	document.querySelectorAll('.gh-content a[href^="http"]').forEach(function (a) {
		if (a.host !== location.host) {
			a.target = '_blank';
			a.rel = 'noopener';
		}
	});
})();
