/**
 * Init features from our PVS framework.
 */

const { pvs } = window;

if (pvs) {
	pvs.initClipboard();
	pvs.initDarkMode();
	pvs.initPopup();
	pvs.initScrollbarWidth();
	pvs.initPagination();
	pvs.initCollapse();
	pvs.initDropdown();
	pvs.initPricingDiscount();
	pvs.initPricingUrlSync();
	pvs.registerLightbox({
		selector:
			'.kg-gallery-container, .kg-image-card, .kg-gallery-image, .post-featured-image',
	});
	pvs.registerFeaturedVideo();
	pvs.registerFeaturedVideoPreview();
	pvs.registerTOC();
}
