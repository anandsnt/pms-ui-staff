var setUpStaycard = function(viewDom) {
	console.log(viewDom);
	// Resizable guest card variables
	var $maxHeight = $(window).height(), $breakpoint = ($maxHeight / 2), $cardHeight = '90px';
	// Hide guest card content until it's resized
	viewDom.find($('#guest-card-header .switch-button, #guest-card-content')).hide();

	// Guest card tabs
	viewDom.find($('#guest-card-content')).tabs({
		create : function(event, ui) {
			var $tab = ui.panel.attr('id');

			// Set scroller
			if (guestCardScroll) {
				destroyGuestCardScroll();
			}
			setTimeout(function() {
				createGuestCardScroll('#' + $tab);
				refreshGuestCardScroll();
			}, 300);

		},
		beforeActivate : function(event, ui) {
			var $nextTab = ui.newPanel.attr('id');

			// Reset scroller
			if (guestCardScroll) {
				destroyGuestCardScroll();
			}
			setTimeout(function() {
				createGuestCardScroll('#' + $nextTab);
			}, 300);

		}
	});

	// Reservation card tabs
	viewDom.find($('.reservation-tabs')).each(function() {
		var $activeTab = $(this).attr('id') == 'reservation-card' ? 1 : 0;

		$(this).tabs({
			//active: $activeTab,
			beforeActivate : function(event, ui) {
				var $prevTab = ui.oldPanel.attr('id'), $nextTab = ui.newPanel.attr('id'), $changeTab = new chainedAnimation(), $delay = 600;

				// Bring in new tab
				$changeTab.add(function() {
					viewDom.find($('#' + $nextTab)).removeAttr('style').addClass('loading');
					viewDom.find($('#' + $prevTab)).removeAttr('style').addClass('set-back');
				});

				// Show/hide
				$changeTab.add(function() {
					viewDom.find($('#' + $nextTab)).show();
					viewDom.find($('#' + $prevTab)).hide();
				}, $delay);

				// Clear transition classes
				$changeTab.add(function() {
					viewDom.find($('#' + $nextTab)).removeClass('loading');
					viewDom.find($('#' + $prevTab)).removeClass('set-back');
				});

				$changeTab.start();

				// Refresh scrollers
				refreshViewScroll();
			}
		}).addClass('ui-tabs-vertical ui-helper-clearfix');
	});
};
