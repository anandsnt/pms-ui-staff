$(function($){ 

	// Resizable guest card variables
	var $maxHeight = $(window).height(),
		$breakpoint = ($maxHeight/2),
		$cardHeight = '90px';
		// Variable used to handle call API only for the first time of click or resize event of guest card window
		$guestCardClickTime = true;
		$currentTab = "guest-contact";
		$contactInfoChange = false;
		$focusInGuestCardContent = false;

	// Show/hide guest card on click
	$(document).on('click', '#guest-card .ui-resizable-handle', function(){
	     renderContactInformation();
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
    // to save the modified contact info while click anywhere in the page outside guest-card-content.
    $("#guest-card-content").click(function (e){
    	$focusInGuestCardContent = true;
    });
    $("html").click(function (e){
    	if(!$focusInGuestCardContent){
    		if($contactInfoChange){
	    		saveContactInfo();
	    	} else {
	    		console.log("no save");
	    	}
    	}
		else{
    		$focusInGuestCardContent = false;
    	}
	});
    $(document).on('click', '#guest-contact, #guest-like, #guest-credit, #guest-loyalty', function(event){
	    if($currentTab == "guest-contact"){
	    	if($contactInfoChange){
	    		saveContactInfo();
	    	} else {
	    		console.log("no save");
	    	}
	    	  	
	    }
	    $currentTab = event.target.id;
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
		    	callFunctions();
		    }, 300);
	   	}
	});		
});
//Functions to be called after resize window complete event
function callFunctions(){	
	renderContactInformation();
	refreshGuestCardScroll();	
}
//Function to render the contact information values in the contact form of guest card from API.
function renderContactInformation(){
	var $loader = '<div id="loading" />';
	if($guestCardClickTime){
		$($loader).prependTo('body').show(function(){
		$.ajax({
			type: "GET",
            url: '/guest_cards/show.json',
            data: {fakeDataToAvoidCache: new Date()}, // fakeDataToAvoidCache is iOS Safari fix
            async: false,
            success: function(data) {              
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
               $("#reservation_id").val(data.reservation_id);
               $("#guest_id").val(data.guest_id);
               $("#user_id").val(data.user_id);
               $guestCardClickTime = false;        
               
               // to change flag - to save contact info only if any change happens.
               $(document).on('change', '#guest_firstname, #guest_lastname, #title, #language, #birthday-month,#birthday-year, #birthday-day, #passport-number,#passport-month, #passport-year, #nationality,#email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile', function(event){
	    	        $contactInfoChange = true;
    		   });     
               
            },
            error: function(){
                console.log("There is an error!!");
                $guestCardClickTime = true;
            }
            }).done (function() { 
        		$('#loading').remove();
        	});
        });
       }
	}
//Function to save contact information
function saveContactInfo(){
		$.ajax({
			type: "PUT",
            url: '/guest_cards/'+$("#user_id").val(),
            data: {
            	firstname: $("#guest_firstname").val(),
            	lastname: $("#guest_lastname").val(),
            	title: $("#title").val(),
            	language: $("#language").val(),
            	birth_date: $("#birthday-year").val()+"-"+$("#birthday-month").val()+"-"+$("#birthday-day").val(),
            	passport_number: $("#passport-number").val(),
            	passport_month: $("#passport-month").val(),
            	passport_year: $("#passport-year").val(),
            	nationality: $("#nationality").val(),
            	email: $("#email").val(),
            	streetname: $("#streetname").val(),
            	city: $("#city").val(),
            	postalcode: $("#postalcode").val(),
            	state: $("#state").val(),
            	country: $("#country").val(),
            	phone: $("#phone").val(),
            	mobile: $("#mobile").val(),
            	reservation_id: $("#reservation_id").val(),
            	guest_id: $("#guest_id").val(),
            	user_id: $("#user_id").val()
            }, 
            async: false,
            dataType: 'json',
            success: function() {   
            	$contactInfoChange = false;
            },
            error: function(){
                console.log("There is an error!!");
            }
       });
}
