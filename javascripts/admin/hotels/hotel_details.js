
var HotelDetailsView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	this.currentView = $("body").attr("id");
	var that = this;
  this.fileContent = "";

	this.pageinit = function() {

	};
	this.delegateEvents = function() {
		that.myDom.find('#save').on('click', ["update"], that.updateOrAddHotel);
		that.myDom.find('#save_new_hotel').on('click', ["create"], that.updateOrAddHotel);
		that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
		that.myDom.find("#re-invite").on('click', that.reInvite);
		that.myDom.find("#external-mappings").on('click', that.renderExternalMappings);
  	that.myDom.find('#mli-certificate').on('change', function(){
  		that.readCertificate(this);
  	});
	};
	// function to view external mappings
	this.renderExternalMappings = function() {
		var backDom = that.myDom;
		var replacingDiv = $("#replacing-div-third");
		backDom.hide();
		replacingDiv.show();
		var currentHotel = $(".currenthotel").attr("id");
		// this will be used to pass current hotel id along with url

		var url = "/admin/external_mappings/" + currentHotel + "/list_mappings";
		//var url = "/ui/show?haml_file=admin/hotels/external_mappings&json_input=snt_admin/external_mappings.json&is_hash_map=true&is_partial=true";
		viewParams = {
			'backDom' : backDom
		};
		sntapp.fetchAndRenderView(url, replacingDiv, {}, 'BLOCKER', viewParams);
	};
	//function to re invite
	this.reInvite = function() {
		var url = 'admin/user/send_invitation';
		if ( typeof url === 'undefined' || url === '#') {
			return false;
		}
		var webservice = new WebServiceInterface();
		var data = {};
		data.email = that.myDom.find('#admin-email').val();
		data.hotel_id = $(".currenthotel").attr("id");
		var options = {
			requestParameters : data,
			successCallBack : that.fetchCompletedOfReInvite,
			failureCallBack : that.fetchFailedOfReInvite,
			loader : "BLOCKER"
		};
		webservice.postJSON(url, options);
	};

	// success function of re-invite api call
	this.fetchCompletedOfReInvite = function(data) {
		sntapp.notification.showSuccessMessage("Mail send succesfully.", that.myDom);
	};

	// failure call of re-invite api call
	this.fetchFailedOfReInvite = function(errorMessage) {
		sntapp.notification.showErrorList("Some error occured.", that.myDom);
	};

	this.goBackToPreviousView = function() {
		that.myDom.html("");
		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
		that.myDom.html("");
	};
	this.pageshow = function() {
		if (that.currentView == "snt-admin-view") {
			//Since we are using the same page for hotel admin and snt admin. Some fields are non editable for hotel admin
			$('input[readonly="readonly"]').removeAttr("readonly");
			//Since these values are calculated using gem file
			$('#hotel-longitude, #hotel-latitude').attr("readonly", true);
			$(".registration-for-rover").remove();

		} else {
			$("#external-mappings").remove();
			$(".re-invite").remove();
		}
	};
	//to update or create new hotel
	this.updateOrAddHotel = function(event) {
		var currentHotel = $(".currenthotel").attr("id");
		var hotelName = $.trim(that.myDom.find("#hotel-name").val()), hotelCode = $.trim(that.myDom.find("#hotel-code").val()), hotelStreet = $.trim(that.myDom.find("#hotel-street").val()), hotelPhone = $.trim(that.myDom.find("#hotel-phone").val()), hotelCity = $.trim(that.myDom.find("#hotel-city").val()), hotelState = $.trim(that.myDom.find("#hotel-state").val()), hotelCountry = $.trim(that.myDom.find("#hotel-country").val()), hotelCheckinHour = $.trim(that.myDom.find("#hotel-checkin-hour").val()), hotelCheckinMin = $.trim(that.myDom.find("#hotel-checkin-minutes").val()), hotelCheckinPrimeTime = $.trim(that.myDom.find("#hotel-checkin-primetime").val()), hotelCheckoutHour = $.trim(that.myDom.find("#hotel-checkout-hour").val()), hotelCheckoutMinutes = $.trim(that.myDom.find("#hotel-checkout-minutes").val()), hotelCheckoutPrimeTime = $.trim(that.myDom.find("#hotel-checkout-primetime").val()), hotelContactFirstName = $.trim(that.myDom.find("#contact-first-name").val()), hotelContactLastName = $.trim(that.myDom.find("#contact-last-name").val()), hotelContactEmail = $.trim(that.myDom.find("#contact-email").val()), hotelContactPhone = $.trim(that.myDom.find("#contact-phone").val()), hotelChain = $.trim(that.myDom.find("#hotel-chain").val()), hotelBrand = $.trim(that.myDom.find("#hotel-brand").val()), hotelCurrency = $.trim(that.myDom.find("#hotel-currency").val()), adminEmail = $.trim(that.myDom.find("#admin-email").val()), adminPhone = $.trim(that.myDom.find("#admin-phone").val()), adminFirstName = $.trim(that.myDom.find("#admin-first-name").val()), adminLastName = $.trim(that.myDom.find("#admin-last-name").val()), password = $.trim(that.myDom.find("#admin-pwd").val()), confirmPassword = $.trim(that.myDom.find("#admin-confirm-pwd").val()), zipcode = $.trim(that.myDom.find("#hotel-zipcode").val()), numberOfRooms = $.trim(that.myDom.find("#hotel-rooms").val()), roverRegistration = $("#registration-for-rover input[type='radio']:checked").val(), hotelTimeZone = $.trim(that.myDom.find("#hotel-time-zone").val());
		hotelAutoLogoutTime = $.trim(that.myDom.find("#auto-logout").val());

		var data = that.getInputData(hotelName, hotelStreet, hotelCity, hotelState, zipcode, hotelCountry, hotelPhone, hotelBrand, hotelChain, hotelCode, numberOfRooms, hotelContactFirstName, hotelContactLastName, hotelContactEmail, hotelContactPhone, hotelCheckinHour, hotelCheckinMin, hotelCheckinPrimeTime, hotelCheckoutHour, hotelCheckoutMinutes, hotelCheckoutPrimeTime, hotelCurrency, adminEmail, adminPhone, adminFirstName, adminLastName, password, confirmPassword, hotelTimeZone, roverRegistration);
		var url = '/admin/hotels/' + currentHotel;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : data,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.putJSON(url, options);
		//webservice.performRequest(url, data, that.fetchCompletedOfAddNewHotel, that.fetchFailedOfSave, false, 'PUT');

	};

	//to handle success call back
	this.fetchCompletedOfSave = function(data) {
		if (data.status == "success") {
			if (that.currentView == "snt-admin-view") {
				sntapp.fetchAndRenderView("/admin/hotels", that.viewParams.backDom, {}, 'None', {}, false);
			}
			that.goBackToPreviousView();
			sntapp.notification.showSuccessMessage("Saved Successfully", that.viewParams.backDom);
		}
	};
	// to handle failure call back
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom);
	};
	//Generating post data
	this.getInputData = function(hotelName, hotelStreet, hotelCity, hotelState, zipcode, hotelCountry, hotelPhone, hotelBrand, hotelChain, hotelCode, numberOfRooms, hotelContactFirstName, hotelContactLastName, hotelContactEmail, hotelContactPhone, hotelCheckinHour, hotelCheckinMin, hotelCheckinPrimeTime, hotelCheckoutHour, hotelCheckoutMinutes, hotelCheckoutPrimeTime, hotelCurrency, adminEmail, adminPhone, adminFirstName, adminLastName, password, confirmPassword, hotelTimeZone, roverRegistration) {

		if (that.currentView == "snt-admin-view") {
			data = {
				hotel_name : hotelName,
				street : hotelStreet,
				city : hotelCity,
				state : hotelState,
				zipcode : zipcode,
				country : hotelCountry,
				phone : hotelPhone,
				hotel_brand : hotelBrand,
				hotel_chain : hotelChain,
				hotel_code : hotelCode,
				number_of_rooms : numberOfRooms,
				contact_first_name : hotelContactFirstName,
				contact_last_name : hotelContactLastName,
				contact_email : hotelContactEmail,
				contact_phone : hotelContactPhone,
				check_in_hour : hotelCheckinHour,
				check_in_min : hotelCheckinMin,
				check_in_primetime : hotelCheckinPrimeTime,
				check_out_hour : hotelCheckoutHour,
				check_out_min : hotelCheckoutMinutes,
				check_out_primetime : hotelCheckoutPrimeTime,
				default_currency : hotelCurrency,
				admin_email : adminEmail,
				admin_phone : adminPhone,
				admin_first_name : adminFirstName,
				admin_last_name : adminLastName,
				admin_password : password,
				admin_password_confirmation : confirmPassword,
				hotel_time_zone : hotelTimeZone,
				auto_logout_delay: hotelAutoLogoutTime,
				mli_certificate : that.fileContent
			};
		} else {
			data = {
			hotel_name: hotelName,
			code: hotelCode,
			street: hotelStreet,
			city: hotelCity,
			state: hotelState,
			zipcode: zipcode,
			country: hotelCountry,
			phone: hotelPhone,
			number_of_rooms: numberOfRooms,
			contact_first_name: hotelContactFirstName,
			contact_last_name: hotelContactLastName,
			contact_email:hotelContactEmail,
			contact_phone: hotelContactPhone,
			check_in_hour: hotelCheckinHour,
			check_in_min: hotelCheckinMin,
			check_in_primetime : hotelCheckinPrimeTime,
			check_out_hour: hotelCheckoutHour,
			check_out_min: hotelCheckoutMinutes,
			check_out_primetime : hotelCheckoutPrimeTime,
			default_currency: hotelCurrency,
			hotel_brand:hotelBrand,
			hotel_chain:hotelChain,
			hotel_time_zone: hotelTimeZone,
			required_signature_at:roverRegistration

		} ;
	}
	return data;
};
this.gotoPreviousPage = function() {

	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
};

this.readCertificate = function(input) {
	   //$('#file-preview').attr('changed', "changed");
     if (input.files && input.files[0]) {
         var reader = new FileReader();
         reader.onload = function(e) {
         		console.log(e.target.result);
         	   //$('#file-preview').attr('src', e.target.result);
             that.fileContent = e.target.result;
         };
         reader.readAsDataURL(input.files[0]);
     }
};
};