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
function displayReservationDetails($href){
	//get the current highlighted timeline
    //Not more than 5 resevation should be kept in DOM in a timeline.
    var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');         
    if($('#' +currentTimeline+' > div').length > 6 && !($($href).length > 0)){
        $("#" + currentTimeline).find('div:nth-child(2)').remove();
    }
    //get the reservation id.
    var reservation = $href.split("-")[1];
    //if div not present in DOM, make ajax request 
    if (!($($href).length > 0)){
        $.ajax({
            type:       'GET',
            url:        "/dashboard/reservation_details?reservation=" + reservation,
            dataType:   'html',
            timeout:    5000,
            success: function(data){
                $("#" + currentTimeline).append(data);
            },
            error: function(){ }
        }).done(function(){ });
    }
}

function getParentBookingDetailes(clickedElement){
	alert(clickedElement);
	var reservationDetails = {};
	var parentReservationElement = $('#' + clickedElement).closest('div[id^="reservation-content"]').attr('id');
	alert(parentReservationElement);
}


function updateGuestDetails(update_val, type){
	
	var data = {};
	var confirmNumber = $('#guest-card #reservation_num_hidden').val();
	data.id = confirmNumber?confirmNumber:4813095;
	data.update_val = update_val;
	data.type = type;
	$.ajax({
        type:       'POST',
        url:        "/dashboard/update_guest",
        data: 		data,
        timeout:    5000,
        success: function(data){
        	//TODO: handle success state
        },
        error: function(e){
        	//TODO: hande error cases
        	console.log(e);
        }
    })

}