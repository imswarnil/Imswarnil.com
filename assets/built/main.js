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

	/* ---------- Navbar border IS the progress bar: a hairline traces the shell
	   outline starting bottom-left → along the bottom → up the right → across
	   the top → back down the left. Path is rebuilt whenever the shell resizes
	   (e.g. flat bar ⇄ island). ---------- */
	var progressPath = document.getElementById('nav-progress-path');
	var progressShell = document.getElementById('nav-island');
	if (progressPath && progressShell) {
		var lastSize = '';
		function buildPath() {
			var w = progressShell.offsetWidth, h = progressShell.offsetHeight;
			var key = w + 'x' + h;
			if (key === lastSize || !w || !h) return;
			lastSize = key;
			var r = Math.min(16, h / 2 - 1);
			var i = 0.75; /* inset so the hairline hugs the border */
			progressPath.setAttribute('d',
				'M ' + (r + i) + ' ' + (h - i) +
				' H ' + (w - r - i) +
				' A ' + r + ' ' + r + ' 0 0 0 ' + (w - i) + ' ' + (h - r - i) +
				' V ' + (r + i) +
				' A ' + r + ' ' + r + ' 0 0 0 ' + (w - r - i) + ' ' + i +
				' H ' + (r + i) +
				' A ' + r + ' ' + r + ' 0 0 0 ' + i + ' ' + (r + i) +
				' V ' + (h - r - i) +
				' A ' + r + ' ' + r + ' 0 0 0 ' + (r + i) + ' ' + (h - i));
		}
		var paintProgress = function () {
			buildPath();
			var doc = document.documentElement;
			var max = doc.scrollHeight - window.innerHeight;
			var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
			progressPath.style.strokeDashoffset = 100 - p * 100;
		};
		window.addEventListener('scroll', paintProgress, { passive: true });
		window.addEventListener('resize', paintProgress, { passive: true });
		/* island transition animates width — recheck once it settles */
		progressShell.addEventListener('transitionend', paintProgress);
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

	/* ---------- Copy-to-clipboard: [data-copy="#selector"] copies that element's
	   text and briefly flips the button label to its [data-copied] value. ------ */
	document.querySelectorAll('[data-copy]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var target = document.querySelector(btn.getAttribute('data-copy'));
			if (!target) return;
			var text = target.innerText || target.textContent || '';
			var done = function () {
				var label = btn.querySelector('[data-copy-label]') || btn;
				var prev = label.textContent;
				label.textContent = btn.getAttribute('data-copied') || 'Copied!';
				btn.classList.add('is-copied');
				setTimeout(function () { label.textContent = prev; btn.classList.remove('is-copied'); }, 1400);
			};
			if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
			else { try { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); done(); } catch (e) {} }
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

	/* ---------- PWA install prompt — reveals [data-pwa-install] buttons ---------- */
	var installPrompt = null;
	window.addEventListener('beforeinstallprompt', function (e) {
		e.preventDefault();
		installPrompt = e;
		document.querySelectorAll('[data-pwa-install]').forEach(function (b) { b.classList.remove('hidden'); });
	});
	document.querySelectorAll('[data-pwa-install]').forEach(function (b) {
		b.addEventListener('click', function () {
			if (!installPrompt) return;
			installPrompt.prompt();
			installPrompt.userChoice.then(function () {
				installPrompt = null;
				document.querySelectorAll('[data-pwa-install]').forEach(function (x) { x.classList.add('hidden'); });
			});
		});
	});

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
		claude: function () { for (var i = 0; i < 5; i++) { noise(i * 0.07, 0.015, 0.03); tone(2600 + Math.sin(i) * 300, i * 0.07, 0.02, 'square', 0.015); } }, // typing
		twilio: function () { tone(1050, 0, 0.07, 'sine', 0.07); tone(1400, 0.09, 0.09, 'sine', 0.07); }, // sms ping-ping
		neubrutal: function () { tone(90, 0, 0.12, 'square', 0.12, 55); noise(0.02, 0.04, 0.05); }        // rubber-stamp thud
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

	/* ---------- Theme switch: tap toggles light/dark, long-press reveals all modes ---------- */
	var MODES = ['light', 'dark', 'salesforce', 'youtube', 'netflix', 'claude', 'twilio', 'neubrutal'];
	var MODE_META = {
		light: { label: 'Light', glyph: svgIcon(ICONS.sun, 14) },
		dark: { label: 'Dark', glyph: svgIcon(ICONS.moon, 14) },
		salesforce: { label: 'Salesforce', glyph: svgIcon(ICONS.cloud, 14) },
		youtube: { label: 'YouTube', glyph: svgIcon(ICONS.play, 14) },
		netflix: { label: 'Netflix', glyph: '<span style="font-weight:900;font-size:13px;line-height:1">N</span>' },
		claude: { label: 'Claude', glyph: svgIcon(ICONS.spark, 14) },
		twilio: { label: 'Twilio', glyph: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="9.5" cy="9.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="14.5" cy="9.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="9.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/></svg>' },
		neubrutal: { label: 'Neubrutal', glyph: '<span style="font-weight:900;font-size:13px;line-height:1">B</span>' }
	};
	/* Multiple switch instances can exist (site navbar + lesson bar) — bind all */
	var cycleBtns = [].slice.call(document.querySelectorAll('[data-mode-cycle]'));
	var modePop = null;
	function currentMode() { return document.documentElement.getAttribute('data-theme') || 'light'; }
	function paintCycle() {
		var meta = MODE_META[currentMode()] || MODE_META.light;
		cycleBtns.forEach(function (btn) {
			btn.innerHTML = '<span class="mode-glyph">' + meta.glyph + '</span>';
			btn.setAttribute('aria-label', 'Theme: ' + currentMode() + ' — tap to toggle, hold for all modes');
		});
	}
	function applyMode(mode) {
		setMode(mode);
		paintCycle();
		if (modePop) paintPop();
		if (MODE_SOUNDS[mode]) { try { MODE_SOUNDS[mode](); } catch (e) {} }
	}
	function paintPop() {
		if (!modePop) return;
		modePop.querySelectorAll('[data-set-mode]').forEach(function (b) {
			b.classList.toggle('is-active', b.getAttribute('data-set-mode') === currentMode());
		});
	}
	function openPop(anchor) {
		if (!modePop) {
			modePop = document.createElement('div');
			modePop.id = 'mode-menu-pop';
			modePop.setAttribute('role', 'menu');
			modePop.innerHTML = MODES.map(function (m) {
				return '<button type="button" class="mode-option" data-set-mode="' + m + '" role="menuitem">' +
					'<span class="inline-flex w-4 justify-center">' + MODE_META[m].glyph + '</span>' + MODE_META[m].label + '</button>';
			}).join('');
			modePop.addEventListener('click', function (e) {
				var b = e.target.closest('[data-set-mode]');
				if (b) { applyMode(b.getAttribute('data-set-mode')); closePop(); }
			});
			document.addEventListener('click', function (e) {
				if (modePop && !modePop.contains(e.target) && !e.target.closest('[data-mode-cycle]')) closePop();
			});
			document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
		}
		anchor.parentNode.classList.add('relative');
		anchor.parentNode.appendChild(modePop);
		paintPop();
		modePop.classList.add('is-open');
	}
	function closePop() { if (modePop) modePop.classList.remove('is-open'); }
	cycleBtns.forEach(function (btn) {
		var pressTimer = null, longPressed = false;
		btn.addEventListener('pointerdown', function () {
			longPressed = false;
			pressTimer = setTimeout(function () { longPressed = true; openPop(btn); }, 500);
		});
		btn.addEventListener('pointerup', function () { clearTimeout(pressTimer); });
		btn.addEventListener('pointerleave', function () { clearTimeout(pressTimer); });
		btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
		btn.addEventListener('click', function () {
			if (longPressed) { longPressed = false; return; } /* long-press opened the menu */
			applyMode(currentMode() === 'light' ? 'dark' : 'light');
		});
	});
	paintCycle();

	/* ---------- Members forms: Portal toggles .success/.error on the form —
	   mirror that to nearby message elements + the subscribe modal ---------- */
	document.querySelectorAll('form[data-members-form]').forEach(function (form) {
		/* host = the dialog, or the nearest ancestor that holds the message els */
		var host = form.closest('[role="dialog"]');
		if (!host) {
			var p = form;
			for (var k = 0; k < 4 && p.parentElement; k++) {
				p = p.parentElement;
				if (p.querySelector('[data-members-success], [data-members-error]')) { host = p; break; }
			}
		}
		if (!host) host = form.parentElement;
		new MutationObserver(function () {
			var ok = form.classList.contains('success');
			var err = form.classList.contains('error');
			host.querySelectorAll('[data-members-success]').forEach(function (el) { el.style.display = ok ? 'block' : 'none'; });
			host.querySelectorAll('[data-members-error]').forEach(function (el) { el.style.display = err ? 'block' : 'none'; });
			if (host.getAttribute('role') === 'dialog') host.classList.toggle('is-success', ok);
		}).observe(form, { attributes: true, attributeFilter: ['class'] });
	});

	/* ---------- Generic modals: [data-modal-open="#id"] / [data-modal-close] ---------- */
	document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var target = document.querySelector(btn.getAttribute('data-modal-open'));
			if (!target) return;
			target.classList.remove('hidden');
			target.classList.add('flex');
			document.body.style.overflow = 'hidden';
		});
	});
	function closeModal(modal) {
		modal.classList.add('hidden');
		modal.classList.remove('flex');
		document.body.style.overflow = '';
	}
	document.querySelectorAll('[data-modal]').forEach(function (modal) {
		modal.addEventListener('click', function (e) {
			if (e.target === modal || e.target.closest('[data-modal-close]')) closeModal(modal);
		});
	});
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') return;
		document.querySelectorAll('[data-modal]:not(.hidden)').forEach(closeModal);
	});

	/* ---------- Lazy image skeletons: reveal <img data-skeleton> on decode ---------- */
	(function () {
		function reveal(img) { img.classList.add('is-loaded'); }
		document.querySelectorAll('img[data-skeleton]').forEach(function (img) {
			if (img.complete && img.naturalWidth) { reveal(img); return; }
			img.addEventListener('load', function () { reveal(img); });
			img.addEventListener('error', function () { reveal(img); }); /* don't trap the skeleton on a broken src */
		});
	})();

	/* ---------- Lazy YouTube backdrops ([data-yt-bg]) ----------------------
	   The poster in the HTML is the LCP element; the heavy muted-reel iframe
	   is mounted only after load + idle (and never under reduced-motion), so
	   it can't block first paint on the video-heavy collection pages. -------- */
	(function () {
		var hosts = document.querySelectorAll('[data-yt-bg]');
		if (!hosts.length) return;
		if (reduceMotion) return; /* keep the poster only */
		function mount(host) {
			if (host.dataset.ytMounted) return;
			host.dataset.ytMounted = '1';
			var id = host.getAttribute('data-yt-bg');
			if (!id) return;
			var f = document.createElement('iframe');
			f.src = 'https://www.youtube-nocookie.com/embed/' + id +
				'?autoplay=1&mute=1&loop=1&playlist=' + id +
				'&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1';
			f.title = 'Ambient background video';
			f.tabIndex = -1;
			f.setAttribute('allow', 'autoplay; encrypted-media');
			f.setAttribute('frameborder', '0');
			f.className = 'video-hero-frame';
			f.addEventListener('load', function () { host.classList.add('is-playing'); });
			host.appendChild(f);
		}
		function boot() {
			if ('IntersectionObserver' in window) {
				var io = new IntersectionObserver(function (ents) {
					ents.forEach(function (e) { if (e.isIntersecting) { mount(e.target); io.unobserve(e.target); } });
				}, { rootMargin: '200px' });
				hosts.forEach(function (h) { io.observe(h); });
			} else {
				hosts.forEach(mount);
			}
		}
		function idle(fn) { ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 700); }
		if (document.readyState === 'complete') idle(boot);
		else window.addEventListener('load', function () { idle(boot); });
	})();

	/* ---------- Video cards: derive thumbnail + hover preview from the post's
	   OWN first YouTube embed. Image-less cards carry <template data-video-src>
	   with the post content; we pull the id out, paint the video thumbnail, and
	   (on hover, desktop only) mount a muted autoplay reel. ------------------ */
	(function () {
		var YT_RE = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|live\/|watch\?[^"'\s]*?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
		function firstId(host) {
			if (host.getAttribute('data-yt-preview')) return host.getAttribute('data-yt-preview');
			var tpl = host.querySelector('template[data-video-src]');
			if (!tpl) return null;
			var html = tpl.innerHTML || (tpl.content && tpl.content.textContent) || '';
			var m = html.match(YT_RE);
			return m ? m[1] : null;
		}
		function reelSrc(id) {
			return 'https://www.youtube-nocookie.com/embed/' + id +
				'?autoplay=1&mute=1&loop=1&playlist=' + id +
				'&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1';
		}
		var canHover = !window.matchMedia || window.matchMedia('(hover: hover)').matches;

		/* Scroll guard: mounting a YouTube iframe mid-scroll is what makes the
		   carousels jank. Suppress previews while the page is scrolling and tear
		   down any that are up. */
		var scrollingUntil = 0;
		var teardowns = [];
		window.addEventListener('scroll', function () {
			scrollingUntil = Date.now() + 250;
			for (var i = 0; i < teardowns.length; i++) teardowns[i]();
		}, { passive: true });

		document.querySelectorAll('[data-video-card-media], [data-yt-preview]').forEach(function (host) {
			var id = firstId(host);
			if (!id) return;

			/* Paint the thumbnail if the card has no image yet */
			if (!host.querySelector('img')) {
				var img = document.createElement('img');
				img.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
				img.alt = '';
				img.loading = 'lazy';
				img.decoding = 'async';
				img.width = 1280; img.height = 720;
				img.className = 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';
				img.addEventListener('error', function () {
					if (!img.dataset.fb) { img.dataset.fb = '1'; img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }
				});
				host.insertBefore(img, host.firstChild);
				var ph = host.querySelector('[data-ph]');
				if (ph) ph.remove();
			}

			/* Hover preview — desktop only, reduced-motion respected, opt-out via data-no-preview */
			if (reduceMotion || !canHover || host.hasAttribute('data-no-preview')) return;
			var card = host.closest('.video-card, [data-videos-card], .rank-row-card') || host;
			var frame = null, timer = null;
			function leave() { clearTimeout(timer); if (frame) { frame.remove(); frame = null; } }
			teardowns.push(leave);
			function enter() {
				clearTimeout(timer);
				timer = setTimeout(function () {
					if (frame || Date.now() < scrollingUntil) return; /* don't mount mid-scroll */
					frame = document.createElement('iframe');
					frame.src = reelSrc(id);
					frame.title = 'Preview';
					frame.tabIndex = -1;
					frame.setAttribute('allow', 'autoplay; encrypted-media');
					frame.setAttribute('frameborder', '0');
					frame.className = 'video-preview-frame';
					host.appendChild(frame);
					requestAnimationFrame(function () { if (frame) frame.style.opacity = '1'; });
				}, 260);
			}
			card.addEventListener('pointerenter', enter);
			card.addEventListener('pointerleave', leave);
			card.addEventListener('focusin', enter);
			card.addEventListener('focusout', leave);
		});
	})();

	/* ---------- Horizontal carousels: let a vertical wheel scroll the PAGE
	   instead of being hijacked into horizontal scroll (Chrome/Safari redirect
	   vertical wheel onto the only axis that overflows). Horizontal intent still
	   scrolls the track natively. Mark tracks with [data-hscroll]. ----------- */
	document.querySelectorAll('[data-hscroll]').forEach(function (track) {
		track.addEventListener('wheel', function (e) {
			if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; /* horizontal gesture → native */
			/* vertical gesture: drive the window, cancel the track's redirect */
			window.scrollBy({ top: e.deltaY });
			e.preventDefault();
		}, { passive: false });
	});

})();
