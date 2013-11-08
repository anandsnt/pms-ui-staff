var GuestContactView = function(domRef){
    var that = this;
    this.$guestCardClickTime = false;
    this.$contactInfoChange  = false;
    console.log(domRef);
	this.pageinit = function(){
		// that.renderContactInformation();
       setTimeout(function() {
			that.renderContactInformation();
		}, 700);
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
			$contactJsonObj['first_name'] = $("#guest_firstname").val();
			$contactJsonObj['last_name'] = $("#guest_lastname").val();
			$contactJsonObj['title'] = $("#title").val();
			$contactJsonObj['birthday'] = $("#guest-birthday").val();
			$contactJsonObj['passport_no'] = $("#passport-number").val();
			if($("#passport-month").val()!="" && $("#passport-year").val()!="")
				$contactJsonObj['passport_expiry'] = "01-"+$("#passport-month").val()+"-"+"20"+$("#passport-year").val();
			$contactJsonObj['language'] = $("#language").val();
			$contactJsonObj['nationality'] = $("#nationality_status").val();
			$contactJsonObj['street'] = $("#streetname").val();
			$contactJsonObj['city'] = $("#city").val();
			$contactJsonObj['state'] = $("#state").val();
			$contactJsonObj['postal_code'] = $("#postalcode").val();
			$contactJsonObj['country'] = $("#country").val();
			$contactJsonObj['phone'] = $("#phone").val();
			$contactJsonObj['email'] = $("#email").val();
			$contactJsonObj['mobile'] = $("#mobile").val();
		
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
					$("#gc-location").val($("#city").val()+","+$("#state").val());
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
					if(data.birthday!=null){
						birthdate = data.birthday.split('-');
						birthday = birthdate[1]+"-"+birthdate[2]+"-"+birthdate[0].substring(2);
						$("#guest-birthday").val(birthday);
					}
					if(data.passport_expiry!=null){
						passport_expiry = data.passport_expiry.split('-');
						$("#passport-month").val(passport_expiry[1]);						
						$("#passport-year").val(passport_expiry[0].substring(2));
					}
					$("#guest_firstname").val(data.first_name);
					$("#guest_lastname").val(data.last_name);
					$("#title").val(data.title);
					$("#language").val(data.language);							
					$("#nationality_status").val(data.nationality);						
					$("#passport-number").val(data.passport_number);					
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
					$(document).on('click change', '#countries_status, #guest_nationality_div #nationality_status, #language', function(){
						that.$contactInfoChange = true;
					});
					// to change flag - to save contact info only if any change happens.
					$(document).on('change', '#guest_firstname, #guest_lastname, #title, #language, #guest-birthday, #passport-number,#passport-month, #passport-year, #nationality,#guest_nationality_div #nationality_status, #email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile', function(event) {
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

