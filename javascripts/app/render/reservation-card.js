var setUpStaycard = function(viewDom) {

	// Reservation card tabs
	viewDom.find($('.reservation-tabs-timeline')).each(function() {
		$(this).tabs({
			beforeActivate: function (event, ui) {
				applyTabSettings(event, ui);
			}
		}).addClass('ui-tabs-vertical ui-helper-clearfix');
	});

	viewDom.find($('.reservation-tabs')).each(function() {

		var activeTabIndex = 0;
		var currentReservation = viewDom.find($('#confirm_no')).val();
		var activeTimeline = $('#reservation-card').attr('data-current-timeliine');
		viewDom.find($("#"+activeTimeline+" .reservations-tabs ul li")).each(function(index){
			if($(this).attr("data-confirmation-num") == currentReservation ){
				activeTabIndex = index;
			}
		});
		if($(this).attr('id') !== activeTimeline){
			activeTabIndex = 0;
		}
		$(this).tabs({
			active: activeTabIndex,
			beforeActivate: function (event, ui) {
				applyTabSettings(event, ui);
			}
		}).addClass('ui-tabs-vertical ui-helper-clearfix');
	});

	// Change tabs
	function applyTabSettings(event, ui) {
		var $prevTab = ui.oldPanel.attr('id'), 
			$nextTab = ui.newPanel.attr('id'),
			$targetScroller = $('#' + $nextTab + ' > .scrollable').attr('id'),
			$changeTab = new chainedAnimation(),
			$delay = 600;

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

		// Refresh all scrollers
		refreshVerticalScroll();
	}
};
