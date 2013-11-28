var HotelDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
    console.log("Reached in pageinit HotelDetailsView");
  };
  this.delegateEvents = function(){  	
  	that.myDom.find('#save').on('click', that.saveHotelDetails);  	
  };
  this.saveHotelDetails =  function(){
  	
  	var currentHotel = $(".currenthotel").attr("id");
  	var hotelName = $.trim(that.myDom.find($("#hotel-name")).val()),
  	    hotelCode = $.trim(that.myDom.find($("#hotel-code")).val()),
  	    hotelStreet = $.trim(that.myDom.find($("#hotel-street")).val()),
  	    hotelPhone = $.trim(that.myDom.find($("#hotel-phone")).val()),
  	    hotelCity = $.trim(that.myDom.find($("#hotel-city")).val()),
  	    hotelState = $.trim(that.myDom.find($("#hotel-state")).val()),
  	    hotelCountry = $.trim(that.myDom.find($("#hotel-country")).val()),
  	    hotelCheckinHour = $.trim(that.myDom.find($("#hotel-checkin-hour")).val()),
  	    hotelCheckinMin = $.trim(that.myDom.find($("#hotel-checkin-minutes")).val()),
  	    hotelCheckoutHour = $.trim(that.myDom.find($("#hotel-checkout-hour")).val()),
  	    hotelCheckoutMinutes = $.trim(that.myDom.find($("#hotel-checkout-minutes")).val()),
  	    hotelContactFirstName = $.trim(that.myDom.find($("#contact-first-name")).val()),
  	    hotelContactLastName = $.trim(that.myDom.find($("#contact-last-name")).val()),
  	    hotelContactEmail = $.trim(that.myDom.find($("#contact-email")).val()),
  	    hotelContactPhone = $.trim(that.myDom.find($("#contact-phone")).val()),
  	    hotelCurrency = $.trim(that.myDom.find($("#hotel-currency")).val()),
  	    password = $.trim(that.myDom.find($("#admin-pwd")).val()),
  	    confirmPassword = $.trim(that.myDom.find($("#admin-confirm-pwd")).val()),
  	    zipcode = $.trim(that.myDom.find($("#hotel-zipcode")).val());
  	    numberOfRooms = $.trim(that.myDom.find($("#hotel-rooms")).val());
  	 
  	 
	  	 if(hotelName == null || hotelName == ''){
	  	 	alert("Hotel name is required");
	  	 	return  false;
	  	 }
	  	 if(hotelCode == null || hotelCode == ''){
	  	 	alert("Hotel code is required");
	  	 	return  false;
	  	 } 
	  	 if(hotelStreet == null || hotelStreet == ''){
	  	 	alert("Hotel street is required");
	  	 	return  false;
	  	 } 
	  	 if(hotelCity == null || hotelCity == ''){
	  	 	alert("Hotel city is required");
	  	 	return  false;
	  	 } 
	  	 if(hotelCountry == null || hotelCountry == ''){
	  	 	alert("Hotel country is required");
	  	 	return  false;
	  	 } 
	  	 if(hotelPhone == null || hotelPhone == ''){
	  	 	alert("Hotel phone is required");
	  	 	return  false;
	  	 } 
	  	 if(hotelCurrency == null || hotelCurrency == ''){
	  	 	alert("Hotel currency is required");
	  	 	return  false;
	  	 } 	  	

        if(escapeNull(password) != "" && escapeNull(confirmPassword) != ""){
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
					check_out_hour: hotelCheckoutHour,
					check_out_min: hotelCheckoutMinutes,
					default_currency: hotelCurrency,
					admin_password:password,
					admin_password_confirmation:confirmPassword
					} ;
	        }
	        else 
	        {
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
					check_out_hour: hotelCheckoutHour,
					check_out_min: hotelCheckoutMinutes,
					default_currency: hotelCurrency
					} ;
	        }  				
			

	  	$.ajax({
			type: "PUT",
			url : '/admin/hotels/'+currentHotel,
			dataType: 'json',
			data :data,
			success : function(data) {
				if(data.status == "success"){
					console.log("Saved Successfully");
				}
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});
  };
};