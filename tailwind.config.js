/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./*.hbs', './partials/**/*.hbs'],
	darkMode: 'media',
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
};
