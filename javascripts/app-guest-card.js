$(function($) {

	// Resizable guest card variables
	var $maxHeight = $(window).height(), $breakpoint = ($maxHeight / 2), $cardHeight = '90px';
	// Variable used to handle call API only for the first time of click or resize event of guest card window
	$guestCardClickTime = true;
	$currentTab = "guest-contact";
	$contactInfoChange = false;

	$focusInGuestCardContent = false;

	// Show/hide guest card on click
	$(document).on('click', '#guest-card .ui-resizable-handle', function() {

		// Show if hidden or open in less than 50% of screen height
		if ($('#guest-card').height() == '90' || $('#guest-card').height() < $breakpoint) {
			$('#guest-card').animate({
				height : ($maxHeight - 90)
			}, 300);
			$('#guest-card-header .switch-button, #guest-card-content').show();
		}
		// Hide if open or shown in more than 50% of screen height
		else {
			$('#guest-card').animate({
				height : '90px'
			}, 300);
			$('#guest-card-header .switch-button, #guest-card-content').hide();
		}
		renderContactInformation();
		// Refresh scrollers
		setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
	});

	// to save the modified contact info while click anywhere in the page outside guest-card-content.
	

	$("html").click(function(e) {
	
		if (!$(e.target).is("#guest-card-content *", "#guest-card-content")){
			if ($contactInfoChange) {
				saveContactInfo();
			} 			
		}
		
	});
	$(document).on('click', '#guest-contact, #guest-like, #guest-credit, #guest-loyalty', function(event) {
		if ($currentTab == "guest-contact") {
			if ($contactInfoChange) {
				saveContactInfo();
			} 

		}		

		$currentTab = $(this).attr("id");

	});

	// Resize guest card
	$('#guest-card').resizable({
		minHeight : '90',
		maxHeight : ($maxHeight - 90), // 90 is height of the guest card visible part
		handles : 's',
		resize : function(event, ui) {
			if ($(this).height() > 120) {
				$('#guest-card-header .switch-button, #guest-card-content').show();
			} else {
				$('#guest-card-header .switch-button, #guest-card-content').hide();
			}
		},
		stop : function(event, ui) {
			$cardHeight = $(this).css('height');
			// Refresh scrollers

			setTimeout(function() {
				callFunctions();
			}, 300);

		}
	});
});
//Functions to be called after resize window complete event
function callFunctions() {
	renderContactInformation();
	refreshGuestCardScroll();
}

//Function to render the contact information values in the contact form of guest card from API.
function renderContactInformation() {
	var $loader = '<div id="loading" />';
	$reservation_id = $("#reservation_id").val();
	if ($guestCardClickTime) {
		$($loader).prependTo('body').show(function() {
			$.ajax({
				type : "GET",
				url : 'staff/guestcard/show.json',
				data : {
					fakeDataToAvoidCache : new Date(),
					id : $reservation_id
				}, // fakeDataToAvoidCache is iOS Safari fix
				async : false,
				success : function(data) {
					$("#guest_firstname").val(data.first_name);
					$("#guest_lastname").val(data.last_name);
					$("#title").val(data.title);
					$("#language").val(data.language);
					$("#birthday-month").val(data.birth_month);
					$("#birthday-day").val(data.birth_date);
					$("#birthday-year").val(data.birth_year);
					$("#passport-number").val(data.passport_number);
					$("#passport-month").val(data.passport_expiry_month);
					$("#passport-year").val(data.passport_expiry_year);
					$("#nationality").val(data.nationality);
					$("#email").val(data.email_address);
					$("#streetname").val(data.address);
					$("#city").val(data.city);
					$("#postalcode").val(data.postal_code);
					$("#state").val(data.state);
					$("#country").val(data.country);
					$("#phone").val(data.phone);
					$("#mobile").val(data.mobile);


					$("#guest_id").val(data.guest_id);
					$("#user_id").val(data.user_id);

					$guestCardClickTime = false;
					// to change flag - to save contact info only if any change happens.
					$(document).on('change', '#guest_firstname, #guest_lastname, #title, #language, #birthday-month,#birthday-year, #birthday-day, #passport-number,#passport-month, #passport-year, #nationality,#email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile', function(event) {
						$contactInfoChange = true;
					});

				},
				error : function() {
					console.log("There is an error!!");
					$guestCardClickTime = true;
				}
			}).done(function() {
				$('#loading').remove();
				var guest_id = $("#guest_id").val();		
			    

				var viewParams = {"user_id" : $("#user_id").val()};
				sntapp.fetchAndRenderView('staff/dashboard/likes', $("#likes"), viewParams);
				// var viewParams = {"user_id" : $("#user_id").val()};
				sntapp.fetchAndRenderView('staff/dashboard/payment', $("#cc-payment"), viewParams);
				setTimeout(function() {
					refreshGuestCardScroll();
				}, 300);
		
				// renderPayment();
				renderGuestCardLoyalty();
				
			});
		});

	}
}

//Function to save contact information
function saveContactInfo() {
	var userId = $("#user_id").val();
	$contactJsonObj = {};
	$contactJsonObj['guest_id'] = $("#guest_id").val();
	$contactJsonObj['user'] = {};
	$contactJsonObj['user']['first_name'] = $("#guest_firstname").val();
	$contactJsonObj['user']['last_name'] = $("#guest_lastname").val();
	$contactJsonObj['user']['addresses_attributes'] = [];
	$addresses_attributes = {};
	$addresses_attributes['street1'] = $("#streetname").val();
	$addresses_attributes['street2'] = "";
	$addresses_attributes['city'] = $("#city").val();
	$addresses_attributes['state'] = $("#state").val();
	$addresses_attributes['postal_code'] = $("#postalcode").val();
	$addresses_attributes['country'] = $("#country").val();
	$addresses_attributes['is_primary'] = true;
	$addresses_attributes['label'] = "HOME";
	$contactJsonObj['user']['addresses_attributes'].push($addresses_attributes);
	$contactJsonObj['user']['contacts_attributes'] = [];
	$contact_attributes = {};
	$contact_attributes['contact_type'] = "PHONE";
	$contact_attributes['label'] = "HOME";
	$contact_attributes['value'] = $("#phone").val();
	$contact_attributes['is_primary'] = true;
	$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
	$contact_attributes = {};
	$contact_attributes['contact_type'] = "EMAIL";
	$contact_attributes['label'] = "BUSINESS";
	$contact_attributes['value'] = $("#email").val();
	$contact_attributes['is_primary'] = true;
	$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);

	console.log(JSON.stringify($contactJsonObj));
	$.ajax({
		type : "PUT",
		url : 'staff/guest_cards/' + userId,
		data : JSON.stringify($contactJsonObj),

		async : false,
		dataType : 'json',
		contentType : 'application/json',

		success : function() {
			$contactInfoChange = false;
			$("#gc-firstname").val($("#guest_firstname").val());
			$("#gc-lastname").val($("#guest_lastname").val());
			$("#gc-location").val($("#city").val());
			$("#gc-phone").val($("#phone").val());
			$("#gc-email").val($("#email").val());
			
		},
		error : function() {
			console.log("There is an error!!");
		}
	});
}

// function to render payment
function renderPayment() {
	user_id = $("#user_id").val();
	$.ajax({
		type : "GET",
		url : 'staff/dashboard/payment',
		async : false,
		data : {
			user_id : user_id
		},
		success : function(data) {
			$("#cc-payment").html(data);
			$(document).on('click', "#credit-card-set-as-primary", function() {
				//setThis
			});
		},
		error : function() {
			console.log("There is an error!!");
		}
	});
}
