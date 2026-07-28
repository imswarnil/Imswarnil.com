/* =============================================================================
   LAB SHELL
   Gives every preview page the same chrome, so a preview file only ever
   contains the markup you are actually designing.

   A preview page needs three things:
     <body data-lab="navbar.html">
     <div class="lab-canvas" id="lab-canvas"> …your markup… </div>
     <script src="./_lab.js" defer></script>

   Everything else — toolbar, theme toggle, width presets, the Ghost icon
   sprite, the theme's own nav.js/main.js — is injected here.
   ========================================================================== */

(function () {
	'use strict';

	const WIDTHS = [
		{ label: 'phone', value: '390px' },
		{ label: 'tablet', value: '768px' },
		{ label: 'laptop', value: '1120px' },
		{ label: 'full', value: '' },
	];

	const THEMES = ['light', 'dark'];

	const root = document.documentElement;
	const canvas = document.getElementById('lab-canvas');
	const file = document.body.dataset.lab || '';

	// ── The icon sprite ────────────────────────────────────────────────────
	// Templates get it from {{> icons}}; the lab reads the same partial so a
	// preview can never drift from the real glyph set.
	fetch('../partials/icons.hbs')
		.then((r) => (r.ok ? r.text() : ''))
		.then((hbs) => {
			const svg = hbs.replace(/\{\{![\s\S]*?\}\}/g, '').trim();
			if (!svg.startsWith('<svg')) return;
			const holder = document.createElement('div');
			holder.style.display = 'none';
			holder.innerHTML = svg;
			document.body.prepend(holder);
		})
		.catch(() => {});

	// ── The theme's own scripts, same order as default.hbs ─────────────────
	['../assets/js/nav.js', '../assets/js/main.js'].forEach((src) => {
		const s = document.createElement('script');
		s.src = src;
		s.defer = true;
		document.body.appendChild(s);
	});

	// ── Toolbar ────────────────────────────────────────────────────────────
	const bar = document.createElement('div');
	bar.className = 'lab-bar';
	bar.innerHTML = `
		<a href="./index.html" title="All previews">&larr; lab</a>
		<span class="lab-bar__title" data-lab-title>${file.replace(/\.html$/, '')}</span>
		<span class="lab-bar__note" data-lab-note></span>
		<span class="lab-bar__group" data-lab-widths></span>
		<button class="lab-btn" type="button" data-lab-outline aria-pressed="false">outline</button>
		<button class="lab-btn" type="button" data-lab-theme>theme</button>
		<button class="lab-btn" type="button" data-lab-copy>copy markup</button>
	`;
	document.body.append(bar);

	// Width presets
	const widths = bar.querySelector('[data-lab-widths]');
	WIDTHS.forEach((w) => {
		const b = document.createElement('button');
		b.className = 'lab-btn';
		b.type = 'button';
		b.textContent = w.label;
		b.setAttribute('aria-pressed', String(w.value === ''));
		b.addEventListener('click', () => {
			if (canvas) canvas.style.setProperty('--lab-w', w.value || 'none');
			widths.querySelectorAll('.lab-btn').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
		});
		widths.appendChild(b);
	});

	// Theme — writes the same key default.hbs reads, so the toggle behaves
	// exactly as it does on the site.
	bar.querySelector('[data-lab-theme]').addEventListener('click', () => {
		const next = THEMES[(THEMES.indexOf(root.getAttribute('data-theme')) + 1) % THEMES.length];
		root.setAttribute('data-theme', next);
		try {
			localStorage.setItem('swarnil-theme', next);
		} catch (e) {}
	});

	// Layout outlines
	bar.querySelector('[data-lab-outline]').addEventListener('click', (e) => {
		const on = e.currentTarget.getAttribute('aria-pressed') === 'true';
		e.currentTarget.setAttribute('aria-pressed', String(!on));
		if (canvas) canvas.dataset.outline = on ? 'off' : 'on';
	});

	// Copy markup — the point of the lab: design here, paste into a .hbs.
	bar.querySelector('[data-lab-copy]').addEventListener('click', (e) => {
		if (!canvas) return;
		const html = canvas.innerHTML
			.split('\n')
			.map((l) => l.replace(/^\t\t/, ''))
			.join('\n')
			.trim();
		navigator.clipboard.writeText(html).then(() => {
			const b = e.currentTarget;
			b.textContent = 'copied';
			setTimeout(() => (b.textContent = 'copy markup'), 1200);
		});
	});

	// ── Note from the registry ─────────────────────────────────────────────
	fetch('./_pages.json')
		.then((r) => (r.ok ? r.json() : []))
		.then((pages) => {
			const page = pages.find((p) => p.file === file);
			if (!page) return;
			bar.querySelector('[data-lab-title]').textContent = page.title;
			bar.querySelector('[data-lab-note]').textContent = page.note || '';
			document.title = `${page.title} — lab`;
		})
		.catch(() => {});
})();
