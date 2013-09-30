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
    
    // Resize guest card
	$('#guest-card').resizable({
		minHeight: 		'90',
		maxHeight: 		($maxHeight-90), // 90 is height of the guest card visible part
		handles: 		's',
		resize: function( event, ui ) {
			if ($(this).height() > 120) {
				$('#guest-card-header .switch-button, #guest-card-content').show();
			}
			else {
				$('#guest-card-header .switch-button, #guest-card-content').hide();
			}
		},
	    stop: function(event, ui) {
	    	$cardHeight = $(this).css('height');

	    	// Refresh scrollers
	    	setTimeout(function(){
		    	refreshGuestCardScroll();
		    }, 300);
	   	}
	});

	// Show/hide guest card on click
	$(document).on('click', '#guest-card .ui-resizable-handle', function(){
		// Show if hidden or open in less than 50% of screen height
		if ($('#guest-card').height() == '90' || $('#guest-card').height() < $breakpoint)
		{
			$('#guest-card').animate({height: ($maxHeight-90)}, 300);
			$('#guest-card-header .switch-button, #guest-card-content').show();
		}

		// Hide if open or shown in more than 50% of screen height
		else
		{
			$('#guest-card').animate({height: '90px'}, 300);
			$('#guest-card-header .switch-button, #guest-card-content').hide();
		}

		// Refresh scrollers
	    setTimeout(function(){
	    	refreshGuestCardScroll();
	    }, 300);
    });

	// Reservation card tabs
	$('.reservation-tabs').each(function(){
		var $activeTab = $(this).attr('id') == 'reservation-card' ? 1 : 0;

		$(this).tabs({ 
			active: $activeTab,
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
});