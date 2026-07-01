/**
 * Custom JavaScript
 *
 * This file is for your custom scripts.
 * You can add any JavaScript code here to enhance your Ghost theme.
 *
 * Note: Changes made directly to this file may be overwritten during theme updates.
 * It's recommended to use the Code Injection feature in Ghost for persistent customizations.
 */

// Your custom JavaScript goes below this line

// Home hero: CRT power-on/off takeover, ported from the hero.html prototype.
// The video plays in place over the hero card (never a popup/modal) — the
// content fades out via the `data-phase` attribute, then the YouTube embed
// is lazy-loaded so nothing is fetched until the visitor presses play.
(function heroVideoTakeover() {
	const hero = document.querySelector('[data-hero-tv]');
	if (!hero) return;

	const frame = hero.querySelector('[data-hero-video-frame]');
	const videoId = frame && frame.getAttribute('data-video-id');
	let timer;

	function loadVideo() {
		if (!frame || frame.querySelector('iframe')) return;
		const iframe = document.createElement('iframe');
		iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
		iframe.title = 'YouTube video player';
		iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
		iframe.allowFullscreen = true;
		frame.appendChild(iframe);
	}

	function unloadVideo() {
		const iframe = frame && frame.querySelector('iframe');
		if (iframe) iframe.remove();
	}

	function setPhase(phase) {
		hero.setAttribute('data-phase', phase);
	}

	function play() {
		clearTimeout(timer);
		setPhase('powering');
		timer = setTimeout(() => {
			setPhase('playing');
			loadVideo();
		}, 760);
	}

	function close() {
		clearTimeout(timer);
		unloadVideo();
		setPhase('off');
		timer = setTimeout(() => setPhase('idle'), 470);
	}

	hero
		.querySelectorAll('[data-play]')
		.forEach((el) => el.addEventListener('click', play));

	hero
		.querySelectorAll('[data-close]')
		.forEach((el) => el.addEventListener('click', close));

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && hero.getAttribute('data-phase') === 'playing')
			close();
	});
})();
