/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./*.hbs', './partials/**/*.hbs', './assets/built/main.js'],
	// Button variants/sizes are a public API of the theme — always ship them,
	// even the ones not yet referenced by a template (@layer components is purged).
	safelist: [
		'btn', 'btn-primary', 'btn-secondary', 'btn-ghost', 'btn-soft', 'btn-subtle',
		'btn-outline', 'btn-danger', 'btn-link', 'btn-invert', 'btn-glass',
		'btn-xs', 'btn-sm', 'btn-lg', 'btn-xl', 'btn-block', 'btn-icon', 'btn-square',
		// Background patterns are a public API too — ship all 10 even if a
		// given template doesn't reference them yet.
		'bg-pat-dots', 'bg-pat-dots-dense', 'bg-pat-pin-dots', 'bg-pat-polka',
		'bg-pat-grid', 'bg-pat-grid-fine', 'bg-pat-grid-paper', 'bg-pat-graph-paper',
		'bg-pat-graph-dashboard', 'bg-pat-diagonal', 'bg-pat-grid-wide',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			colors: {
				// Monochrome scale — flips with dark mode / theme modes via CSS vars
				ink: 'rgb(var(--ink) / <alpha-value>)',
				paper: 'rgb(var(--paper) / <alpha-value>)',
				mist: 'rgb(var(--mist) / <alpha-value>)',
				line: 'rgb(var(--line) / <alpha-value>)',
				silver: 'rgb(var(--silver) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
			},
			maxWidth: {
				site: '86rem',
				prose: '44rem',
			},
			borderRadius: {
				island: '1.75rem',
			},
			boxShadow: {
				island: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 32px -12px rgb(0 0 0 / 0.18)',
				card: '0 1px 2px rgb(0 0 0 / 0.05), 0 12px 40px -16px rgb(0 0 0 / 0.15)',
				lift: '0 2px 4px rgb(0 0 0 / 0.06), 0 24px 60px -20px rgb(0 0 0 / 0.25)',
			},
			animation: {
				'fade-up': 'fadeUp .7s cubic-bezier(.16,1,.3,1) both',
				'fade-in': 'fadeIn .9s ease both',
				marquee: 'marquee 40s linear infinite',
				'spin-slow': 'spin 14s linear infinite',
				blink: 'blink 1.1s steps(1) infinite',
				'ken-burns': 'kenBurns 18s ease-in-out infinite alternate',
			},
			keyframes: {
				fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'none' } },
				fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
				marquee: { to: { transform: 'translateX(-50%)' } },
				blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
				kenBurns: {
					from: { transform: 'scale(1) translate(0, 0)' },
					to: { transform: 'scale(1.12) translate(1.5%, -1.5%)' },
				},
			},
			typography: null,
		},
	},
	plugins: [],
};
