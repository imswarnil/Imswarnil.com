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
				// Monochrome scale — flips with dark mode / theme modes via CSS vars
				ink: 'rgb(var(--ink) / <alpha-value>)',
				paper: 'rgb(var(--paper) / <alpha-value>)',
				mist: 'rgb(var(--mist) / <alpha-value>)',
				line: 'rgb(var(--line) / <alpha-value>)',
				silver: 'rgb(var(--silver) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
			},
			maxWidth: {
				site: '86rem',
				prose: '44rem',
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
	plugins: [require('daisyui')],
	daisyui: {
		// Six site modes. Our own --ink/--paper vars are defined per
		// [data-theme] in tailwind.css so custom utilities follow along.
		themes: [
			{ light: { primary: '#18181b', secondary: '#71717a', accent: '#18181b', neutral: '#18181b', 'base-100': '#fafafa', 'base-200': '#f4f4f5', 'base-300': '#e4e4e7', info: '#3b82f6', success: '#22c55e', warning: '#f59e0b', error: '#ef4444' } },
			{ dark: { primary: '#f4f4f5', secondary: '#a1a1aa', accent: '#f4f4f5', neutral: '#27272a', 'base-100': '#09090b', 'base-200': '#18181b', 'base-300': '#27272a', info: '#60a5fa', success: '#4ade80', warning: '#fbbf24', error: '#f87171' } },
			{ salesforce: { primary: '#0176d3', secondary: '#747474', accent: '#04844b', neutral: '#032d60', 'base-100': '#ffffff', 'base-200': '#f3f3f3', 'base-300': '#e5e5e5', info: '#0176d3', success: '#2e844a', warning: '#dd7a01', error: '#ea001e' } },
			{ youtube: { primary: '#ff0033', secondary: '#aaaaaa', accent: '#3ea6ff', neutral: '#272727', 'base-100': '#0f0f0f', 'base-200': '#212121', 'base-300': '#303030', info: '#3ea6ff', success: '#2ba640', warning: '#ffa116', error: '#ff0033' } },
			{ netflix: { primary: '#e50914', secondary: '#b3b3b3', accent: '#e50914', neutral: '#232323', 'base-100': '#141414', 'base-200': '#1f1f1f', 'base-300': '#333333', info: '#54b9c5', success: '#46d369', warning: '#e6b209', error: '#e50914' } },
			{ claude: { primary: '#c15f3c', secondary: '#87867f', accent: '#c15f3c', neutral: '#3d3929', 'base-100': '#faf9f5', 'base-200': '#f0eee6', 'base-300': '#e0ddd1', info: '#6a9bcc', success: '#788c5d', warning: '#d4a27f', error: '#bf4d43' } },
		],
		darkTheme: 'dark',
		base: false,
		styled: true,
		utils: true,
		logs: false,
	},
};
