/**
 * Lazy-load Google AdSense units.
 *
 * The ad <ins> elements are rendered WITHOUT the usual inline
 * `adsbygoogle.push({})` (see partials/monetization/ad-unit.hbs). Here we
 * request each ad only as it approaches the viewport, so ads below the fold
 * don't compete with the initial page load. Falls back to eager loading when
 * IntersectionObserver is unavailable.
 */

const SELECTOR = 'ins.adsbygoogle';
const ROOT_MARGIN = '300px 0px'; // start loading ~300px before the ad is visible

function fill(ad) {
	// Guard against requesting the same slot twice.
	if (ad.dataset.adLoaded) return;
	ad.dataset.adLoaded = 'true';

	try {
		(window.adsbygoogle = window.adsbygoogle || []).push({});
	} catch (error) {
		// AdSense library missing/blocked, or ads disabled — fail silently.
	}
}

function initAdsense() {
	const ads = document.querySelectorAll(SELECTOR);
	if (!ads.length) return;

	if (!('IntersectionObserver' in window)) {
		ads.forEach(fill);
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				fill(entry.target);
				obs.unobserve(entry.target);
			});
		},
		{ rootMargin: ROOT_MARGIN },
	);

	ads.forEach((ad) => observer.observe(ad));
}

initAdsense();
