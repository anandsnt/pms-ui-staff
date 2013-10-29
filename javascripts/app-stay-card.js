$(function($) {
	// Resizable guest card variables
	var $maxHeight = $(window).height(), $breakpoint = ($maxHeight / 2), $cardHeight = '90px';
	// Hide guest card content until it's resized
	$('#guest-card-header .switch-button, #guest-card-content').hide();

	// Guest card tabs
	$('#guest-card-content').tabs({
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
	$('.reservation-tabs').each(function() {
		var $activeTab = $(this).attr('id') == 'reservation-card' ? 1 : 0;

		$(this).tabs({
			//active: $activeTab,
			beforeActivate : function(event, ui) {
				var $prevTab = ui.oldPanel.attr('id'), $nextTab = ui.newPanel.attr('id'), $changeTab = new chainedAnimation(), $delay = 600;

				// Bring in new tab
				$changeTab.add(function() {
					$('#' + $nextTab).removeAttr('style').addClass('loading');
					$('#' + $prevTab).removeAttr('style').addClass('set-back');
				});

				// Show/hide
				$changeTab.add(function() {
					$('#' + $nextTab).show();
					$('#' + $prevTab).hide();
				}, $delay);

				// Clear transition classes
				$changeTab.add(function() {
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
	$('#reservation-timeline li').click(function() {
		var currentTimeline = $(this).attr('aria-controls');
		//No reservation details are added to the DOM
		if (!($("#" + currentTimeline).find('.reservation').length > 0)) {
			$("#" + currentTimeline + ' #reservation-listing ul li').first().find('a').trigger("click");
		}
	});
	
	$(document).on('change', "#newspaper", function() {			
		setNewspaperPreferance();
	});
	
	

});
function setNewspaperPreferance(){
	var confirmNum = $('#confirm_no').val();
	var newspaperValue = $('#newspaper').val();
	$.ajax({
			type : 'POST',
			url : "/staff/reservation/set-newspaper",
			data : {"confirmno": confirmNum, "selected_newspaper" :newspaperValue } ,
			success : function(data) {
				if(data.status == "success"){
			   console.log("Succesfully set newspaper preferance");
			   }
               else{
               	console.log("Something is wrong!");
               }
			},
			error : function() {
				console.log("There is an error!!");
			}
	});
}
//Add the reservation details to the DOM.
function displayReservationDetails($href) {
	//get the current highlighted timeline
	//Not more than 5 resevation should be kept in DOM in a timeline.
	var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');
	if ($('#' + currentTimeline + ' > div').length > 6 && !($($href).length > 0)) {
		$("#" + currentTimeline).find('div:nth-child(2)').remove();
	}
	//get the reservation id.
	var reservation = $href.split("-")[1];
	//if div not present in DOM, make ajax request
	if (!($($href).length > 0)) {
		$.ajax({
			type : 'GET',
			url : "/dashboard/reservation_details?reservation=" + reservation,
			dataType : 'html',
			success : function(data) {
				$("#" + currentTimeline).append(data);
			},
			error : function() {
			}
		}).done(function() {
		});
	}
}

function getParentBookingDetailes(clickedElement) {
	alert(clickedElement);
	var reservationDetails = {};
	var parentReservationElement = $('#' + clickedElement).closest('div[id^="reservation-content"]').attr('id');
	alert(parentReservationElement);
}

function updateGuestDetails(update_val, type) {
	var userId = $("#user_id").val();
	$guestCardJsonObj = {};
	$guestCardJsonObj['guest_id'] = $("#guest_id").val();
	$guestCardJsonObj['user'] = {};
	$guestFirstName = $guestCardJsonObj['user']['first_name'] = $("#gc-firstname").val();
	$guestLastName = $guestCardJsonObj['user']['last_name'] = $("#gc-lastname").val();
	$guestCardJsonObj['user']['addresses_attributes'] = [];
	$addresses_attributes = {};
	$guestCity = $addresses_attributes['city'] = $("#gc-location").val();
	$addresses_attributes['is_primary'] = true;
	$addresses_attributes['label'] = "HOME";
	$guestCardJsonObj['user']['addresses_attributes'].push($addresses_attributes);
	$guestCardJsonObj['user']['contacts_attributes'] = [];
	$contact_attributes = {};
	$contact_attributes['contact_type'] = "PHONE";
	$contact_attributes['label'] = "HOME";
	$guestPhone = $contact_attributes['value'] = $("#gc-phone").val();
	$contact_attributes['is_primary'] = true;
	$guestCardJsonObj['user']['contacts_attributes'].push($contact_attributes);
	$contact_attributes = {};
	$contact_attributes['contact_type'] = "EMAIL";
	$contact_attributes['label'] = "BUSINESS";
	$guestEmail = $contact_attributes['value'] = $("#gc-email").val();
	$contact_attributes['is_primary'] = true;
	$contact_attributes['id'] = "";
	$guestCardJsonObj['user']['contacts_attributes'].push($contact_attributes);

	console.log(JSON.stringify($guestCardJsonObj))

	$.ajax({
		type : 'PUT',
		url : 'staff/guest_cards/' + userId,
		data : JSON.stringify($guestCardJsonObj),

		dataType : 'json',
		contentType : 'application/json',
		success : function(data) {
			//TODO: handle success state
			if (!$guestCardClickTime) {
				$("#guest_firstname").val($guestFirstName);
				$("#guest_lastname").val($guestLastName);
				$("#city").val($guestCity);
				$("#phone").val($guestPhone);
				$("#email").val($guestEmail);
			}
		},
		error : function(e) {
			//TODO: hande error cases
			console.log(e);
		}
	})

}