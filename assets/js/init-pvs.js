/**
 * Init features from our PVS framework.
 */

const { pvs } = window;

if (pvs) {
	pvs.initClipboard();
	pvs.initDarkMode();
	pvs.initLightbox({
		imageSelector: '.post-media > .post-featured-image > picture',
	});
	pvs.initPopup();
	pvs.initScrollbarWidth();
	pvs.initPagination();
	pvs.initCollapse();
	pvs.initDropdown();
	pvs.initPricingDiscount();
	pvs.initPricingUrlSync();
	pvs.registerFeaturedVideo();
	pvs.registerFeaturedVideoPreview();
	pvs.registerTOC();
}
