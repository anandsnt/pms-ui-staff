var setUpStaycard = function(viewDom) {
	// Reservation card tabs
	viewDom.find($('.reservation-tabs')).each(function() {
		$(this).tabs({
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
