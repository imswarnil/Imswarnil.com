/* Swarnil theme JS — zero dependencies */
(function () {
	'use strict';

	/* ---------- Theme mode switcher (6 modes) ---------- */
	var DARK_MODES = { dark: 1, netflix: 1 };
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

	/* ---------- Mega menu panel: centered modal ---------- */
	var panelBtn = document.getElementById('panel-toggle');
	var backdrop = document.getElementById('mega-panel-backdrop');
	var panel = document.getElementById('mega-panel');
	var panelClose = document.getElementById('panel-close');
	if (panelBtn && backdrop && panel) {
		function openPanel() {
			backdrop.classList.remove('hidden');
			backdrop.classList.add('flex');
			panelBtn.setAttribute('aria-expanded', 'true');
			document.body.style.overflow = 'hidden';
		}
		function closePanel() {
			backdrop.classList.add('hidden');
			backdrop.classList.remove('flex');
			panelBtn.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
		}
		panelBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			backdrop.classList.contains('hidden') ? openPanel() : closePanel();
		});
		if (panelClose) panelClose.addEventListener('click', closePanel);
		backdrop.addEventListener('click', function (e) {
			if (!panel.contains(e.target)) closePanel();
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') closePanel();
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

	/* ---------- Reveal on scroll (.reveal, [data-reveal], [data-reveal-stagger]) ---------- */
	var revealTargets = document.querySelectorAll('.reveal, [data-reveal], [data-reveal-stagger]');
	document.querySelectorAll('[data-reveal-stagger]').forEach(function (parent) {
		var step = parseInt(parent.getAttribute('data-reveal-stagger'), 10) || 80;
		[].forEach.call(parent.children, function (child, i) {
			child.style.setProperty('--reveal-delay', (i * step) / 1000 + 's');
		});
	});
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
		revealTargets.forEach(function (el) {
			io.observe(el);
		});
	} else {
		revealTargets.forEach(function (el) {
			el.classList.add('is-visible');
		});
	}

	/* ---------- Scroll progress bar ---------- */
	var progressBar = document.getElementById('scroll-progress');
	if (progressBar) {
		var paintProgress = function () {
			var doc = document.documentElement;
			var max = doc.scrollHeight - window.innerHeight;
			progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
		};
		window.addEventListener('scroll', paintProgress, { passive: true });
		window.addEventListener('resize', paintProgress, { passive: true });
		paintProgress();
	}

	/* ---------- Pointer parallax: [data-parallax-scene] moves [data-parallax-depth] children ---------- */
	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!reduceMotion) {
		document.querySelectorAll('[data-parallax-scene]').forEach(function (scene) {
			var layers = scene.querySelectorAll('[data-parallax-depth]');
			if (!layers.length) return;
			var raf = null;
			scene.addEventListener('pointermove', function (e) {
				if (raf) return;
				raf = requestAnimationFrame(function () {
					raf = null;
					var r = scene.getBoundingClientRect();
					var x = (e.clientX - r.left) / r.width - 0.5;
					var y = (e.clientY - r.top) / r.height - 0.5;
					layers.forEach(function (layer) {
						var depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 6;
						layer.style.translate = -x * depth + 'px ' + -y * depth + 'px';
					});
				});
			});
			scene.addEventListener('pointerleave', function () {
				layers.forEach(function (layer) {
					layer.style.translate = '0px 0px';
				});
			});
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

	/* ---------- AdSense: single guarded push per ins (fixes double-push TagError) ---------- */
	function pushAds() {
		if (!window.adsbygoogle) return;
		document.querySelectorAll('ins.adsbygoogle').forEach(function (ins) {
			if (ins.getAttribute('data-ad-status') || ins.dataset.adPushed) return;
			if (!ins.offsetWidth) return; // hidden slots throw availableWidth=0 errors
			ins.dataset.adPushed = '1';
			try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
		});
	}
	pushAds();
	window.addEventListener('load', pushAds);

	/* ---------- Mode sounds — tiny WebAudio sketches, no samples ---------- */
	var audioCtx = null;
	function ctx() {
		if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
		return audioCtx;
	}
	function tone(freq, t0, dur, type, gain, slideTo) {
		var ac = ctx(); if (!ac) return;
		var o = ac.createOscillator(), g = ac.createGain();
		o.type = type || 'sine';
		o.frequency.setValueAtTime(freq, ac.currentTime + t0);
		if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + t0 + dur);
		g.gain.setValueAtTime(0.0001, ac.currentTime + t0);
		g.gain.exponentialRampToValueAtTime(gain || 0.08, ac.currentTime + t0 + 0.01);
		g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t0 + dur);
		o.connect(g).connect(ac.destination);
		o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + dur + 0.05);
	}
	function noise(t0, dur, gain) {
		var ac = ctx(); if (!ac) return;
		var len = Math.max(1, Math.floor(ac.sampleRate * dur));
		var buf = ac.createBuffer(1, len, ac.sampleRate);
		var d = buf.getChannelData(0);
		for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
		var s = ac.createBufferSource(); s.buffer = buf;
		var g = ac.createGain(); g.gain.value = gain || 0.05;
		var f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500;
		s.connect(f).connect(g).connect(ac.destination);
		s.start(ac.currentTime + t0);
	}
	var MODE_SOUNDS = {
		light: function () { tone(1200, 0, 0.06, 'square', 0.05); },                                     // switch tick
		dark: function () { for (var i = 0; i < 6; i++) noise(i * 0.05, 0.025, 0.04); },                 // cockroach skitter
		salesforce: function () { tone(660, 0, 0.12, 'sine', 0.07); tone(880, 0.12, 0.18, 'sine', 0.07); }, // teams-ish ding
		youtube: function () { tone(520, 0, 0.09, 'triangle', 0.08, 780); },                             // pop
		netflix: function () { tone(98, 0, 0.28, 'sawtooth', 0.1); tone(65, 0.16, 0.5, 'sawtooth', 0.12); }, // tu-dum
		claude: function () { for (var i = 0; i < 5; i++) { noise(i * 0.07, 0.015, 0.03); tone(2600 + Math.sin(i) * 300, i * 0.07, 0.02, 'square', 0.015); } } // typing
	};

	/* ---------- Inline SVG icons (lucide-style strokes, currentColor) ---------- */
	function svgIcon(paths, size) {
		return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
	}
	var ICONS = {
		sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
		moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
		cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4 1.6A4 4 0 0 0 7 19z"/>',
		play: '<path d="M6 4l14 8-14 8z"/>',
		spark: '<path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"/>',
		tv: '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M17 2l-5 5-5-5"/>',
		plane: '<path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-1 .3L3 7.3l6.3 3.6-2.6 2.6H4l-1 1 3 1 1 3 1-1v-2.7l2.6-2.6 3.6 6.3.8-.8a1 1 0 0 0 .3-1z"/>',
		cart: '<circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6"/>',
		book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22H20v-2.5"/>',
		pen: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
		cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
		file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
		mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
		film: '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 7h5M2 17h5M17 7h5M17 17h5"/>',
		heart: '<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z"/>',
		clap: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 9l2-5 16 2-1 3M8.5 4.7L7 9M14 5.4L12.4 9"/>'
	};

	/* ---------- Mode-cycle switch: one button, click cycles all modes ---------- */
	var MODES = ['light', 'dark', 'salesforce', 'youtube', 'netflix', 'claude'];
	var MODE_META = {
		light: { label: 'light', glyph: svgIcon(ICONS.sun, 14) },
		dark: { label: 'dark', glyph: svgIcon(ICONS.moon, 14) },
		salesforce: { label: 'sfdc', glyph: svgIcon(ICONS.cloud, 14) },
		youtube: { label: 'yt', glyph: svgIcon(ICONS.play, 14) },
		netflix: { label: 'flix', glyph: '<span style="font-weight:900;font-size:13px;line-height:1">N</span>' },
		claude: { label: 'claude', glyph: svgIcon(ICONS.spark, 14) }
	};
	var cycleBtn = document.getElementById('mode-cycle');
	function paintCycle() {
		if (!cycleBtn) return;
		var mode = document.documentElement.getAttribute('data-theme') || 'light';
		var meta = MODE_META[mode] || MODE_META.light;
		cycleBtn.innerHTML = '<span class="mode-glyph">' + meta.glyph + '</span><span class="hidden sm:inline">' + meta.label + '</span>';
		cycleBtn.setAttribute('aria-label', 'Theme: ' + mode + ' — click to switch');
		cycleBtn.setAttribute('data-tip', 'Mode: ' + mode);
	}
	if (cycleBtn) {
		cycleBtn.addEventListener('click', function () {
			var current = document.documentElement.getAttribute('data-theme') || 'light';
			var next = MODES[(MODES.indexOf(current) + 1) % MODES.length];
			setMode(next);
			paintCycle();
			if (MODE_SOUNDS[next]) { try { MODE_SOUNDS[next](); } catch (e) {} }
		});
		paintCycle();
	}

	/* ---------- Page transitions — flavored per destination collection ---------- */
	var PT_QUOTES = [
		'Cropping the noise…',
		'"Ship it before it\'s ready." — me, regretting it later',
		'Compressing life to 1:1…',
		'Buffering personality…',
		'"Measure twice, publish once." — also me, never doing it',
		'Adding cinematic grain to ordinary moments…',
		'Negotiating with the algorithm…',
		'"The best camera is the one that\'s… still in the bag."',
		'Colour grading reality…',
		'Reticulating splines, but make it marketing…'
	];
	var PT_MAP = [
		{ re: /^\/videos\//, kind: 'tv', art: svgIcon(ICONS.tv, 64), label: 'tuning channel' },
		{ re: /^\/projects\//, kind: 'code', art: '', label: 'npm run project' },
		{ re: /^\/travel\/[^/]+\/.+/, kind: 'flight', art: svgIcon(ICONS.plane, 56), label: 'paper plane en route' },
		{ re: /^\/travel\//, kind: 'flight', art: svgIcon(ICONS.plane, 64), label: 'now boarding' },
		{ re: /^\/shop\//, kind: 'cart', art: svgIcon(ICONS.cart, 64), label: 'cart incoming' },
		{ re: /^\/courses\//, kind: 'study', art: svgIcon(ICONS.book, 64), label: 'sharpening pencils' },
		{ re: /^\/timeline\//, kind: 'years', art: '2019 → 2026', label: 'years passing' },
		{ re: /^\/guestbook\//, kind: 'scribble', art: '<span>' + svgIcon(ICONS.pen, 40) + '</span><span>Was here!</span><span>hi mom</span>', label: 'uncapping pens' },
		{ re: /^\/webseries\//, kind: 'tudum', art: 'S', label: '' },
		{ re: /^\/sponsor\//, kind: 'cash', art: '<span>' + svgIcon(ICONS.cash, 44) + '</span><span>' + svgIcon(ICONS.cash, 36) + '</span><span>' + svgIcon(ICONS.cash, 44) + '</span>', label: 'dispensing gratitude' },
		{ re: /^\/resume\//, kind: 'unfold', art: svgIcon(ICONS.file, 64), label: 'unfolding the paper' },
		{ re: /^\/newsletters\//, kind: 'envelope', art: svgIcon(ICONS.mail, 64), label: 'opening the envelope' }
	];
	var reduceMotionPT = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	function transitionFor(path) {
		for (var i = 0; i < PT_MAP.length; i++) if (PT_MAP[i].re.test(path)) return PT_MAP[i];
		return null;
	}
	function showOverlay(t, cb) {
		var el = document.createElement('div');
		el.className = 'pt-overlay pt-' + t.kind;
		var quote = PT_QUOTES[Math.floor(Math.random() * PT_QUOTES.length)];
		el.innerHTML =
			(t.kind === 'code'
				? '<pre><span>$ open project --with love</span><span>▸ compiling side effects…</span><span>✓ done in 0.6s</span></pre>'
				: '<div class="pt-art">' + t.art + '</div>') +
			'<p class="pt-quote">' + quote + '</p>' +
			(t.label ? '<p class="pt-label">' + t.label + '</p>' : '');
		document.body.appendChild(el);
		requestAnimationFrame(function () { el.classList.add('is-in'); });
		if (t.kind === 'tudum' && MODE_SOUNDS.netflix) { try { MODE_SOUNDS.netflix(); } catch (e) {} }
		setTimeout(cb, 700);
	}
	if (!reduceMotionPT) {
		document.addEventListener('click', function (e) {
			if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
			var a = e.target.closest && e.target.closest('a[href]');
			if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
			var url;
			try { url = new URL(a.href); } catch (err) { return; }
			if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
			var t = transitionFor(url.pathname);
			if (!t) return;
			e.preventDefault();
			showOverlay(t, function () { location.href = a.href; });
		});
		/* restore back/forward cache pages that still show an overlay */
		window.addEventListener('pageshow', function (e) {
			if (e.persisted) document.querySelectorAll('.pt-overlay').forEach(function (o) { o.remove(); });
		});
	}
})();
