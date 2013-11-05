var GuestContactView = function(domRef){
    var that = this;
    this.$guestCardClickTime = false;
    this.$contactInfoChange  = false;
    console.log(domRef);
	this.pageinit = function(){
		// that.renderContactInformation();
       setTimeout(function() {
			that.renderContactInformation();
		}, 1000);
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
			$contactJsonObj['user']['birthday'] = $("#guest-birthday").val();
			$contactJsonObj['user']['passport_no'] = $("#passport-number").val();
			if($("#passport-month").val()!="" && $("#passport-year").val()!="")
				$contactJsonObj['user']['passport_expiry'] = "01-"+$("#passport-month").val()+"-"+"20"+$("#passport-year").val();
			$contactJsonObj['user']['language'] = $("#language").val();
			$contactJsonObj['user']['nationality'] = $("#nationality_status").val();
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
					birthdate = that.dateSplit(data.birthday);
					birthday = birthdate['month']+"-"+birthdate['date']+"-"+birthdate['year'];
					passport_expiry = that.dateSplit(data.passport);
					$("#guest_firstname").val(data.first_name);
					$("#guest_lastname").val(data.last_name);
					$("#title").val(data.title);
					$("#language").val(data.language);
					$("#guest-birthday").val(birthday);		
					$("#nationality_status").val(data.nationality);						
					$("#passport-number").val(data.passport_number);
					$("#passport-month").val(passport_expiry['month']);
					$("#passport-year").val(passport_expiry['year']);
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
					$(document).on('change', '#guest_firstname, #guest_lastname, #title, #language, #guest-birthday, #passport-number,#passport-month, #passport-year, #nationality,#email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile', function(event) {
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
	this.dateSplit = function(dateToSplit){
		var splitDate = dateToSplit.split('-');
		var returnData = new Array();
		returnData['year'] = splitDate[0];
		returnData['month'] = splitDate[1];
		returnData['day'] = splitDate[2];
		return returnData;
	};
	
};

