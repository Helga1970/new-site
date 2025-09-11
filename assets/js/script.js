(function ($) {
	'use strict';

	// Preloader js
	$(window).on('load', function () {
		$('.preloader').fadeOut(100);

		// Initialize Masonry after all images (and content) are loaded
		var $grid = $('.masonry-container').masonry({
			itemSelector: '.masonry-item',
			columnWidth: '.masonry-item',
			gutter: 15,
			isAnimated: true
		});

		// Ensure layout is re-calculated after images load
		$grid.imagesLoaded().progress( function() {
			$grid.masonry('layout');
		});
	});

	// nav fixed
	$(window).scroll(function () {
		var nav = $('.navigation');
		if ($(window).scrollTop() > 50) {
			nav.addClass('nav-bg');
		} else {
			nav.removeClass('nav-bg');
		}
	});

	// slick slider
	$('.slick-slider').slick({
		dots: false,
		autoplay: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		arrows: true,
		prevArrow: '<button type=\'button\' class=\'slick-prev pull-left\'><i class=\'ti-angle-left\' aria-hidden=\'true\'></i></button>',
		nextArrow: '<button type=\'button\' class=\'slick-next pull-right\'><i class=\'ti-angle-right\' aria-hidden=\'true\'></i></button>',
		responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: false
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	// Accordions
	$('.collapse').on('shown.bs.collapse', function () {
		$(this).parent().find('.ti-plus').removeClass('ti-plus').addClass('ti-minus');
	}).on('hidden.bs.collapse', function () {
		$(this).parent().find('.ti-minus').removeClass('ti-minus').addClass('ti-plus');
	});


})(jQuery);
