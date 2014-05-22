
var HotelDetailsView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	this.currentView = $("body").attr("id");
	var that = this;
    this.fileContent = "";

	this.delegateEvents = function() {
		that.myDom.find('#save').on('click', ["update"], that.updateOrAddHotel);
		that.myDom.find('#save_new_hotel').on('click', ["create"], that.updateOrAddHotel);
		that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
		that.myDom.find("#re-invite").on('click', that.reInvite);
		that.myDom.find("#external-mappings").on('click', that.renderExternalMappings);
		that.myDom.find("#user-setup").on('click', that.renderUserSetup);
		that.myDom.find('#mli-certificate').on('change', function(){
  			that.readCertificate(this, "certificate");
  		});
  		that.myDom.find('#hotel-logo').on('change', function(){
	  		that.readCertificate(this, "logo");
	  	});
		that.myDom.find('#test-mli-connectivity').on('click', that.testMliConnectivity);
	};

    this.testMliConnectivity = function(event) {
		var postData = {
			"mli_chain_code": that.myDom.find("#mli-chain-code").val(),
			"mli_hotel_code": that.myDom.find("#mli-hotel-code").val(),
			"mli_pem_certificate": that.fileContent
		};

		var url = '/admin/hotels/test_mli_settings';

		var webservice = new WebServiceInterface();

		var options = {
			requestParameters: postData,
			successCallBack: that.fetchCompletedOfConnectionTest,
			failureCallBack: that.fetchFailedOfConnectionTest,
			loader: 'blocker'
		};

		webservice.postJSON(url, options);
    };

    // To handle success on MLI connection test API
    this.fetchCompletedOfConnectionTest = function(data, params) {
    	sntapp.notification.showSuccessMessage("Connection Valid", that.myDom, '', true);
    };

    // To handle failure on MLI connection test API
    this.fetchFailedOfConnectionTest = function(errorMessage, params){
    	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
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

	// function to view user setup
	this.renderUserSetup = function() {
		var backDom = that.myDom;
		var replacingDiv = $("#replacing-div-third");
		backDom.hide();
		replacingDiv.show();

		var url = "/admin/users";
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
		return false;
	};

	// success function of re-invite api call
	this.fetchCompletedOfReInvite = function(data) {
		sntapp.notification.showSuccessMessage("Mail send succesfully.", that.myDom);
		return false;
	};

	// failure call of re-invite api call
	this.fetchFailedOfReInvite = function(errorMessage) {
		sntapp.notification.showErrorList("Error: "+errorMessage, that.myDom);
		return false;
	};

	this.goBackToPreviousView = function() {
		that.myDom.html("");
		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
		that.myDom.html("");
	};
	this.pageshow = function() {
		if (that.currentView == "snt-admin-view") {
			//Since we are using the same page for hotel admin and snt admin. Some fields are non editable for hotel admin
			that.myDom.find('input[readonly="readonly"]').removeAttr("readonly");
			//Since these values are calculated using gem file
			that.myDom.find('#hotel-longitude, #hotel-latitude').attr("readonly", true);
			that.myDom.find(".registration-for-rover").remove();
			that.myDom.find("#hotel-logo-div").remove();

		} else {
			that.myDom.find('#mli-hotel-code').parent('.entry').remove();
			that.myDom.find('#mli-chain-code').parent('.entry').remove();
			that.myDom.find("#mli-certificate-upload").remove();
			that.myDom.find("#external-mappings").remove();
			that.myDom.find(".hotel-pms-type").remove();
			that.myDom.find(".is-pms-tokenized").remove();
			that.myDom.find(".re-invite").remove();
		}
	};
	//to update or create new hotel
	this.updateOrAddHotel = function(event) {
		var currentHotel = $(".currenthotel").attr("id");
		var hotelName = $.trim(that.myDom.find("#hotel-name").val()), hotelCode = $.trim(that.myDom.find("#hotel-code").val()), hotelStreet = $.trim(that.myDom.find("#hotel-street").val()), hotelPhone = $.trim(that.myDom.find("#hotel-phone").val()), hotelCity = $.trim(that.myDom.find("#hotel-city").val()), hotelState = $.trim(that.myDom.find("#hotel-state").val()), hotelCountry = $.trim(that.myDom.find("#hotel-country").val()), hotelCheckinHour = $.trim(that.myDom.find("#hotel-checkin-hour").val()), hotelCheckinMin = $.trim(that.myDom.find("#hotel-checkin-minutes").val()), hotelCheckinPrimeTime = $.trim(that.myDom.find("#hotel-checkin-primetime").val()), hotelCheckoutHour = $.trim(that.myDom.find("#hotel-checkout-hour").val()), hotelCheckoutMinutes = $.trim(that.myDom.find("#hotel-checkout-minutes").val()), hotelCheckoutPrimeTime = $.trim(that.myDom.find("#hotel-checkout-primetime").val()), hotelContactFirstName = $.trim(that.myDom.find("#contact-first-name").val()), hotelContactLastName = $.trim(that.myDom.find("#contact-last-name").val()), hotelContactEmail = $.trim(that.myDom.find("#contact-email").val()), hotelContactPhone = $.trim(that.myDom.find("#contact-phone").val()), hotelChain = $.trim(that.myDom.find("#hotel-chain").val()), hotelBrand = $.trim(that.myDom.find("#hotel-brand").val()), hotelCurrency = $.trim(that.myDom.find("#hotel-currency").val()), adminEmail = $.trim(that.myDom.find("#admin-email").val()), adminPhone = $.trim(that.myDom.find("#admin-phone").val()), adminFirstName = $.trim(that.myDom.find("#admin-first-name").val()), adminLastName = $.trim(that.myDom.find("#admin-last-name").val()), password = $.trim(that.myDom.find("#admin-pwd").val()), confirmPassword = $.trim(that.myDom.find("#admin-confirm-pwd").val()), zipcode = $.trim(that.myDom.find("#hotel-zipcode").val()), numberOfRooms = $.trim(that.myDom.find("#hotel-rooms").val()), roverRegistration = $("#registration-for-rover input[type='radio']:checked").val(), hotelTimeZone = $.trim(that.myDom.find("#hotel-time-zone").val());

		isPmsTokenized = false;
		if(that.myDom.find("#div-is-pms-tokenized").hasClass("on")){
			isPmsTokenized = true;
		}

		var mliHotelCode = that.myDom.find('#mli-hotel-code').val();
		var mliChainCode = $('#mli-chain-code').val();
		var hotelFromAddress = $('#hotel_from_address').val();
		var hotelAutoLogoutTime = $.trim(that.myDom.find("#auto-logout").val());
		var hotelPmsType = that.myDom.find("#hotel-pms-type").val();
		var hotel_logo = "";
		if(that.myDom.find("#hotel-logo-preview").attr("changed") == "changed")
	  		hotel_logo = that.myDom.find("#hotel-logo-preview").attr("src");

		var data = that.getInputData(hotelName, hotelStreet, hotelCity, hotelState, zipcode, hotelCountry, hotelPhone, hotelBrand, hotelChain, hotelCode, numberOfRooms, hotelContactFirstName, hotelContactLastName, hotelContactEmail, hotelContactPhone, hotelCheckinHour, hotelCheckinMin, hotelCheckinPrimeTime, hotelCheckoutHour, hotelCheckoutMinutes, hotelCheckoutPrimeTime, hotelCurrency, adminEmail, adminPhone, adminFirstName, adminLastName, password, confirmPassword, hotelTimeZone, roverRegistration, hotelAutoLogoutTime, mliHotelCode, mliChainCode, hotelPmsType, hotelFromAddress, isPmsTokenized, hotel_logo);
		var type = event.data[0];
	    if(type == "create"){
	      var url = '/admin/hotels';
	    } else {
	      var url = '/admin/hotels/' + currentHotel;
	    }

		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : data,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		if(type == "create"){
		 	webservice.postJSON(url, options);
		 } else {
		 	webservice.putJSON(url, options);
		 }

	};

	//to handle success call back
	this.fetchCompletedOfSave = function(data) {

		if (that.currentView == "snt-admin-view") {
			var url = "/admin/hotels/";
			viewParams = {};
			sntapp.fetchAndRenderView(url, that.viewParams.backDom, {}, 'BLOCKER', viewParams, false);
			that.goBackToPreviousView();
			sntapp.notification.showSuccessMessage("Saved Successfully", that.viewParams.backDom);
		}
		else{
			$("#selected_hotel").html(data.data.current_hotel);
			that.goBackToPreviousView();
			sntapp.notification.showSuccessMessage("Saved Successfully", that.viewParams.backDom);
		}
	};
	// to handle failure call back
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
	};
	//Generating post data
	this.getInputData = function(hotelName, hotelStreet, hotelCity, hotelState, zipcode, hotelCountry, hotelPhone, hotelBrand, hotelChain, hotelCode, numberOfRooms, hotelContactFirstName, hotelContactLastName, hotelContactEmail, hotelContactPhone, hotelCheckinHour, hotelCheckinMin, hotelCheckinPrimeTime, hotelCheckoutHour, hotelCheckoutMinutes, hotelCheckoutPrimeTime, hotelCurrency, adminEmail, adminPhone, adminFirstName, adminLastName, password, confirmPassword, hotelTimeZone, roverRegistration, hotelAutoLogoutTime, mliHotelCode, mliChainCode, hotelPmsType, hotelFromAddress, isPmsTokenized, hotel_logo) {

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
				hotel_pms_type : hotelPmsType,
				mli_hotel_code: mliHotelCode,
				mli_chain_code: mliChainCode,
				mli_certificate : that.fileContent,
				hotel_from_address: hotelFromAddress,
				is_pms_tokenized: isPmsTokenized
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
			auto_logout_delay: hotelAutoLogoutTime,
			required_signature_at:roverRegistration,
			hotel_from_address: hotelFromAddress,
			hotel_logo:hotel_logo

		} ;
	}
	return data;
};
this.gotoPreviousPage = function() {

	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
};

this.readCertificate = function(input, type) {
		if(type == "logo"){
			that.myDom.find('#hotel-logo-preview').attr('changed', "changed");
		}
        if (input.files && input.files[0]) {
           var reader = new FileReader();
           reader.onload = function(e) {
           		//console.log(e.target.result);
           		if(type == "logo"){
					that.myDom.find('#hotel-logo-preview').attr('src', e.target.result);
				}
               that.fileContent = e.target.result;
           };
           reader.readAsDataURL(input.files[0]);
       }
  };

};