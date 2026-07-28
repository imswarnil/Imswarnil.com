/** @type {import('tailwindcss').Config} */
module.exports = {
	// lab/ is scanned too, so a utility works while you're prototyping a
	// component and not only after it has landed in a template. The cost is a
	// few lab-only utilities in the shipped file; the alternative is previews
	// that silently lie.
	content: ['./*.hbs', './partials/**/*.hbs', './lab/**/*.html'],
	darkMode: 'media',
	theme: {
		extend: {},
	},
	corePlugins: {
		// Tailwind ships its own `.container`, and `@tailwind components` loads
		// after the design system — so Tailwind's 1280px breakpoint container
		// was silently overriding ours and the nav sat 40px inside the content.
		// The system owns container widths; Tailwind is utilities only.
		container: false,
	},
	plugins: [],
};
