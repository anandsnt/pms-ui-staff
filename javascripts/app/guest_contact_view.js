var GuestContactView = function(domRef) {
	BaseView.call(this);
	var that = this;
	this.myDom = domRef;
	this.$guestCardClickTime = false;
	this.$contactInfoChange = false;
	
	this.pageinit = function() {
		setTimeout(function() {
			
				var viewParams = {
					"user_id" : $("#user_id").val()
				};
				
		
				sntapp.fetchAndRenderView('staff/preferences/likes', $("#likes"), viewParams, 'NONE', '', true);
		
				sntapp.fetchAndRenderView('staff/payments/payment', $("#cc-payment"), viewParams, 'NONE', '', true);
				//var reservation_id = getReservationId();
				//viewParams = {"reservation_id" : reservation_id};
				sntapp.fetchAndRenderView('staff/user_memberships', $("#loyalty"), viewParams, 'NONE', '', true);
				that.renderContactInformation();
		}, 700);		
		$('html').off();
		$('html').on('click', that.callSave);
		that.myDom.find("#clearbirthday").on("click", function(){
			that.myDom.find("#guest-birthday").val("");
		});
		that.myDom.find("#opt-in").on("click", function(){
			if(that.myDom.find("#opt-in").parent().hasClass('checked')) {
				//To enable EMAIL OPT IN check button in registartion card
				$("#subscribe-via-email input#subscribe").prop("checked",false);
			}
			else{
				//To disable EMAIL OPT IN check button in registartion card
				$("#subscribe-via-email input#subscribe").prop("checked",true);
			}
		});
	};
	

	this.callSave = function(e) {	
		var target = $(e.target);
		var closestId = target.closest(".view-current").attr("id");
		sntapp.notification.hideMessage($("#"+closestId));	
		if (!$(e.target).is("#contact-info *", "#guest-card-content")) {
			if (that.$contactInfoChange) {
				that.saveContactInfo();
			}
		}
	};
	
	this.fetchCompletedOfSaveContactInfo = function(data){
		that.$contactInfoChange = false;
		// Update guest card header UI.
		$("#gc-firstname").val($("#guest_firstname").val());
		$("#gc-lastname").val($("#guest_lastname").val());
		$("#gc-city").val($("#city").val());
		$("#gc-state").val($("#state").val());
		$("#gc-phone").val($("#phone").val());
		$("#gc-email").val($("#email").val());	
		
		var message_element = that.myDom.find("#notification-message-guest");
		message_element.removeClass('notice success_message error_message');
		message_element.html("");			
		that.myDom.find("#notification-message-guest").slideDown(700, function() {});
		$("#guest-contact").removeClass("error");
	};
	this.fetchFailedOfSaveContactInfo = function(errorMessage){
		that.$contactInfoChange = false;
		var message_element = that.myDom.find("#notification-message-guest");
		message_element.removeClass('success_message error_message').addClass("notice error_message");
		message_element.html("Error: "+ errorMessage);			
		that.myDom.find("#notification-message-guest").slideDown(700, function() {});
		$("#guest-contact").addClass("error");
	};
	this.saveContactInfo = function() {
		
		if (that.$contactInfoChange) {
			var userId = $("#user_id").val();
			$contactJsonObj = {};
			$contactJsonObj['guest_id'] = that.myDom.find("#guest_id").val();
			$contactJsonObj['title'] = that.myDom.find("#title").val();
			$contactJsonObj['first_name'] = that.myDom.find("#guest_firstname").val();
			$contactJsonObj['last_name'] = that.myDom.find("#guest_lastname").val();
			$contactJsonObj['works_at'] = that.myDom.find("#works-at").val();
			$contactJsonObj['job_title'] = that.myDom.find("#job-title").val();
			$contactJsonObj['birthday'] = that.myDom.find("#guest-birthday").val();
			$contactJsonObj['street'] = that.myDom.find("#streetname").val();
			$contactJsonObj['city'] = that.myDom.find("#city").val();
			$contactJsonObj['state'] = that.myDom.find("#state").val();
			$contactJsonObj['postal_code'] = that.myDom.find("#postalcode").val();
			$contactJsonObj['country'] = that.myDom.find("#countries_status").val();
			$contactJsonObj['phone'] = that.myDom.find("#phone").val();
			$contactJsonObj['email'] = that.myDom.find("#email").val();
			$contactJsonObj['mobile'] = that.myDom.find("#mobile").val();
			$contactJsonObj['is_opted_promotion_email'] = that.myDom.find("#opt-in").parent().hasClass('checked') ? "true" : "false";

		    var url = 'staff/guest_cards/' + userId;
		    var webservice = new WebServiceInterface();
		    var options = {
				   requestParameters: $contactJsonObj,
				   successCallBack: that.fetchCompletedOfSaveContactInfo,
				   failureCallBack: that.fetchFailedOfSaveContactInfo,
				   loader: 'BLOCKER',
		    };
		    webservice.putJSON(url, options);
		}
	};

	//success function of renderContactInformation's ajax call
	this.fetchCompletedOfRenderContactInformation = function(response){
		var data = response.data;
		if (data.birthday != null) {
			birthdate = data.birthday.split('-');
			//data.birthday is in YYYY-MM-DD format. Changed to MM-DD-YYYY format.
			birthday = birthdate[1] + "-" + birthdate[2] + "-" + birthdate[0];
			that.myDom.find("#guest-birthday").val(birthday);
		}
		if (data.passport_expiry != null) {
			passport_expiry = data.passport_expiry.split('-');
			that.myDom.find("#passport-month").val(passport_expiry[1]);
			that.myDom.find("#passport-year").val(passport_expiry[0].substring(2));
		}
		that.myDom.find("#title").val(data.title);
		that.myDom.find("#guest_firstname").val(data.first_name);
		that.myDom.find("#guest_lastname").val(data.last_name);
		that.myDom.find("#works-at").val(data.works_at);
		that.myDom.find("#job-title").val(data.job_title);
		that.myDom.find("#nationality_status").val(data.nationality);
		that.myDom.find("#passport-number").val(data.passport_number);
		that.myDom.find("#nationality").val(data.nationality);
		that.myDom.find("#email").val(data.email_address);
		that.myDom.find("#streetname").val(data.address);
		that.myDom.find("#city").val(data.city);
		that.myDom.find("#postalcode").val(data.postal_code);
		that.myDom.find("#state").val(data.state);
		that.myDom.find("#countries_status").val(data.country);
		that.myDom.find("#phone").val(data.phone);
		that.myDom.find("#mobile").val(data.mobile);
		if(data.is_opted_promotion_email == 'true'){
			that.myDom.find("#opt-in").attr("checked","checked");
		}
		
		$guestCardClickTime = false;
		that.myDom.find('#countries_status, #guest_nationality_div #nationality_status, #language').on('change', 
			function(){
				that.$contactInfoChange = true;
			}				
		);
		// to change flag - to save contact info only if any change happens.
		that.myDom.find('#title, #guest_firstname, #guest_lastname, #works-at, #job-title, #guest-birthday, #passport-number,#passport-month, #passport-year, #nationality,#guest_nationality_div #nationality_status, #email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile, #opt-in').on('change', function(){
			that.$contactInfoChange = true;
		});

		sntapp.activityIndicator.hideActivityIndicator();
		var guest_id = $("#guest_id").val();			    

		// var viewParams = {
			// "user_id" : $("#user_id").val()
		// };
// 		
// 
		// sntapp.fetchAndRenderView('staff/preferences/likes', $("#likes"), viewParams, 'NONE', '', true);
// 
		// sntapp.fetchAndRenderView('staff/payments/payment', $("#cc-payment"), viewParams, 'NONE', '', true);
		// //var reservation_id = getReservationId();
		// //viewParams = {"reservation_id" : reservation_id};
		// sntapp.fetchAndRenderView('staff/user_memberships', $("#loyalty"), viewParams, 'NONE', '', true);	
	};

	// failure function of renderContactInformation's ajax call
	this.fetchFailedOfRenderContactInformation = function(errormMessage){
		$guestCardClickTime = true;
	};

	// function used to fill the information in guest card
	this.renderContactInformation = function() {
		$reservation_id = $("#reservation_id").val();
		var data = {
			fakeDataToAvoidCache : new Date(), // fakeDataToAvoidCache is iOS Safari fix
			id : $reservation_id
		};
		var url = '/staff/guestcard/show.json';
	    var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfRenderContactInformation,
			   failureCallBack: that.fetchFailedOfRenderContactInformation,
			   loader: 'NONE',
			   async: true
	    };		
		var webservice = new WebServiceInterface();
		webservice.getJSON(url, options);
	};
	this.dateSplit = function(dateToSplit) {
		var splitDate = dateToSplit.split('-');
		var returnData = new Array();
		returnData['year'] = splitDate[0];
		returnData['month'] = splitDate[1];
		returnData['day'] = splitDate[2];
		return returnData;
	};

};

