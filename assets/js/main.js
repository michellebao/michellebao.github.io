/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		wide: '(min-width: 961px) and (max-width: 1880px)',
		normal: '(min-width: 961px) and (max-width: 1620px)',
		narrow: '(min-width: 961px) and (max-width: 1320px)',
		narrower: '(max-width: 960px)',
		mobile: '(max-width: 736px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Scrolly links.
			$('.scrolly').scrolly();

		// Nav.
			var $nav_a = $('#nav a.scrolly');

			// Scrolly-fy links.
				if($nav_a.scrolly()){
					$nav_a
						.scrolly()
						.on('click', function(e) {

							var t = $(this),
								href = t.attr('href');

							if (href[0] != '#')
								return;

							e.preventDefault();

							// Clear active and lock scrollzer until scrolling has stopped
								$nav_a
									.removeClass('active')
									.addClass('scrollzer-locked');

							// Set this link to active
								t.addClass('active');

						});
				}

			// Initialize scrollzer.
				var ids = [];

				$nav_a.each(function() {

					var href = $(this).attr('href');

					if (href[0] != '#')
						return;

					ids.push(href.substring(1));

				});

				$.scrollzer(ids, { pad: 200, lastHack: true });

			// Dynamic document.title based on section in view
			(function() {
				try {
					var siteTitle = $('meta[property="og:site_name"]').attr('content') || (document.title.split(' | ')[0] || document.title);
					var sectionTitles = {};
					$nav_a.each(function() {
						var href = $(this).attr('href');
						if (!href || href.charAt(0) !== '#') return;
						var id = href.substring(1);
						var label = $(this).text().trim();
						if (id) sectionTitles[id] = label || id;
					});

					var observeIds = Object.keys(sectionTitles);
					if (!('IntersectionObserver' in window) || observeIds.length === 0) return;

					var currentId = null;
					var io = new IntersectionObserver(function(entries) {
						// Pick the most visible entry
						var best = entries.slice().sort(function(a, b) { return (b.intersectionRatio || 0) - (a.intersectionRatio || 0); })[0];
						if (!best || !best.isIntersecting) return;
						var id = best.target.id;
						if (!id || id === currentId) return;
						currentId = id;
						var label = sectionTitles[id];
						// If top/landing section, just site title
						if (!label || id === 'top' || id === 'home') {
							document.title = siteTitle;
						} else {
							document.title = siteTitle + ' | ' + label;
						}
					}, { rootMargin: '0px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

					observeIds.forEach(function(id) {
						var el = document.getElementById(id);
						if (el) io.observe(el);
					});

					// Also update immediately on hash navigation
					$(window).on('hashchange', function() {
						var h = (location.hash || '').replace('#', '');
						if (!h) { document.title = siteTitle; return; }
						var label = sectionTitles[h];
						document.title = label ? (siteTitle + ' | ' + label) : siteTitle;
					});
				} catch (e) {
					// Fail silently to avoid disrupting theme scripts
				}
			})();

			// Header (narrower + mobile).

			// Toggle.
				$(
					'<div id="headerToggle">' +
						'<a href="#header" class="toggle"></a>' +
					'</div>'
				)
					.appendTo($body);

			// Header.
				$('#header')
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'header-visible'
					});

			// Fix: Remove transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#headerToggle, #header, #main')
						.css('transition', 'none');

	});

})(jQuery);