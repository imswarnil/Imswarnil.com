/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./*.hbs', './partials/**/*.hbs', './assets/built/main.js'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			colors: {
				// Monochrome scale — "ink" flips with dark mode via CSS vars
				ink: 'rgb(var(--ink) / <alpha-value>)',
				paper: 'rgb(var(--paper) / <alpha-value>)',
				mist: 'rgb(var(--mist) / <alpha-value>)',
				line: 'rgb(var(--line) / <alpha-value>)',
				silver: 'rgb(var(--silver) / <alpha-value>)',
				accent: 'var(--ghost-accent-color)',
			},
			maxWidth: {
				site: '80rem',
				prose: '42rem',
			},
			borderRadius: {
				island: '1.25rem',
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
			},
			keyframes: {
				fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'none' } },
				fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
				marquee: { to: { transform: 'translateX(-50%)' } },
				blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
			},
			typography: null,
		},
	},
	plugins: [],
};
