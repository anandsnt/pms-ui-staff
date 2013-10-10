$(function($){ 
	// Resizable guest card variables
	var $maxHeight = $(window).height(),
		$breakpoint = ($maxHeight/2),
		$cardHeight = '90px';
	// Hide guest card content until it's resized
	$('#guest-card-header .switch-button, #guest-card-content').hide();

	// Guest card tabs
	$('#guest-card-content').tabs({
		create:  function( event, ui ) {
			var $tab = ui.panel.attr('id');

			// Set scroller
			if (guestCardScroll) { destroyGuestCardScroll(); }
		    setTimeout(function(){
		    	createGuestCardScroll('#' + $tab);
		    	refreshGuestCardScroll();
		    }, 300);

		},
		beforeActivate: function( event, ui ) {
			var $nextTab = ui.newPanel.attr('id');

			// Reset scroller
			if (guestCardScroll) { destroyGuestCardScroll(); }
		    setTimeout(function(){
		    	createGuestCardScroll('#' + $nextTab);
		    }, 300);

	    }
	});
    
	// Reservation card tabs
	$('.reservation-tabs').each(function(){
		var $activeTab = $(this).attr('id') == 'reservation-card' ? 1 : 0;

		$(this).tabs({ 
			//active: $activeTab,
			beforeActivate: function( event, ui ) {
				var $prevTab = ui.oldPanel.attr('id'),
					$nextTab = ui.newPanel.attr('id'),
			        $changeTab = new chainedAnimation(),
			        $delay = 600;

				// Bring in new tab
		        $changeTab.add(function(){  
		            $('#' + $nextTab).removeAttr('style').addClass('loading');
		            $('#' + $prevTab).removeAttr('style').addClass('set-back');
		        });

		        // Show/hide
		        $changeTab.add(function(){ 
		            $('#' + $nextTab).show(); 
		            $('#' + $prevTab).hide();
		        }, $delay);

		        // Clear transition classes
		        $changeTab.add(function(){ 
		            $('#' + $nextTab).removeClass('loading'); 
		            $('#' + $prevTab).removeClass('set-back');
		        });

		        $changeTab.start();

		        // Refresh scrollers
		        refreshViewScroll();
			}
		}).addClass('ui-tabs-vertical ui-helper-clearfix');
	});
	
	//workaround for populating the reservation details, 
	//when user clicks on other timeline tabs
	$('#reservation-timeline li').click(function(){
		var currentTimeline = $(this).attr('aria-controls');
		//No reservation details are added to the DOM
		if (!($("#" + currentTimeline).find('.reservation').length > 0)){
			$("#" + currentTimeline + ' #reservation-listing ul li').first().find('a').trigger("click");
		}
	});
	
});

//Add the reservation details to the DOM.
function displayReservationDetails(divId , html){
	var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');
	//console.log($('#' +currentTimeline+' > div').length);
	
	//if (!($(divId).length > 0)){
		$("#" + currentTimeline).append(html);
	//}
}


