/**
 * Home hero — video modal.
 *
 * Any element with [data-hero-video="<embed-url>"] opens a shared <dialog>
 * and lazily injects an autoplaying iframe. The iframe is removed on close so
 * playback stops and no video loads until the visitor asks for it.
 */

const dialog = document.getElementById('hero-video-dialog');

if (dialog) {
	const frame = dialog.querySelector('.hero-video-frame');

	const open = (url) => {
		if (!url) return;
		const separator = url.includes('?') ? '&' : '?';
		frame.innerHTML = `<iframe src="${url}${separator}autoplay=1" title="Video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
		if (typeof dialog.showModal === 'function') {
			dialog.showModal();
		} else {
			dialog.setAttribute('open', '');
		}
	};

	const close = () => {
		frame.innerHTML = ''; // stop playback
		if (dialog.open && typeof dialog.close === 'function') {
			dialog.close();
		}
		dialog.removeAttribute('open');
	};

	document.querySelectorAll('[data-hero-video]').forEach((trigger) => {
		trigger.addEventListener('click', () => open(trigger.getAttribute('data-hero-video')));
	});

	dialog.querySelector('[data-hero-video-close]')?.addEventListener('click', close);

	// Click on the backdrop (outside the content) closes the modal.
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) close();
	});

	// Native ESC / programmatic close — make sure the iframe is cleared.
	dialog.addEventListener('close', () => {
		frame.innerHTML = '';
	});
}
