var GuestContactView = function(domRef){
    var that = this;
    this.$guestCardClickTime = false;
    this.$contactInfoChange  = false;
    console.log(domRef);
	this.pageinit = function(){
		// that.renderContactInformation();
       setTimeout(function() {
			that.renderContactInformation();
		}, 300);
		// that.handleEv();
		$('#guest-like, #guest-credit, #guest-loyalty').on('click', that.saveContactInfo);
		$('html').on('click', that.callSave);
	};
	// this.handleEv = function(){
// 		  
	// };
	this.callSave = function(e){
		if (!$(e.target).is("#guest-card-content *", "#guest-card-content")){
			if (that.$contactInfoChange) {
				that.saveContactInfo();
			} 			
		}
	};
	this.saveContactInfo = function(){
		if(that.$contactInfoChange){
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
					that.$contactInfoChange = false;
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
	};
	this.renderContactInformation = function(){
	$reservation_id = $("#reservation_id").val();
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

					$guestCardClickTime = false;
					// to change flag - to save contact info only if any change happens.
					$(document).on('change', '#guest_firstname, #guest_lastname, #title, #language, #birthday-month,#birthday-year, #birthday-day, #passport-number,#passport-month, #passport-year, #nationality,#email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile', function(event) {
						that.$contactInfoChange = true;
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
				sntapp.fetchAndRenderView('staff/preferences/likes', $("#likes"), viewParams);

				sntapp.fetchAndRenderView('staff/payments/payment', $("#cc-payment"), viewParams);
				var reservation_id = getReservationId();
				viewParams = {"reservation_id" : reservation_id};
				sntapp.fetchAndRenderView('staff/user_memberships', $("#loyalty"), viewParams);
				setTimeout(function() {
					refreshGuestCardScroll();
				}, 300);

 				
			});

	};
	
};

