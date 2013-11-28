var HotelListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
    console.log("Reached in pageinit HotelDetailsView");
  };
  this.delegateEvents = function(){   		
  	 that.myDom.find($('#hotels_list_table')).tablesorter();
  	 that.myDom.find($('.title')).on('click', this.gotoNextPage);
  };
  this.gotoNextPage =  function(e){
  	e.preventDefault();	
  	sntadminapp.clearReplacingDiv();  	
  	var href = $(this).attr("href"),
  		viewParams = {};
    if(href != undefined){
  		sntapp.fetchAndRenderView(href, $("#replacing-div"), viewParams);
    }
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
  	    hotelContactPhone = $.trim(that.myDom.find($("#contact-phone")).val());
  	    hotelCurrency = $.trim(that.myDom.find($("#hotel-currency")).val());
  	    
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

	  	data = {
	  		name: hotelName,
	  		code: hotelCode,
			street: hotelStreet,
			city: hotelCity,
			state: hotelState,
			country_id: hotelCountry,
			phone: hotelPhone,
			main_user_first_name: hotelContactFirstName,
			main_user_last_name: hotelContactLastName,
			main_user_email:hotelContactEmail,
			main_user_phone: hotelContactPhone,			
			checkin_hour: hotelCheckinHour,
			checkin_min: hotelCheckinMin,
			checkout_hour: hotelCheckoutHour,
			checkout_min: hotelCheckoutMinutes,
			hotel_currency: hotelCurrency
			} ;			
			
  	  
	  	$.ajax({
			type: "POST",
			url : 'admin/hotels/'+currentHotel,
			data :data,
			success : function(data) {
				if(data.status == "success"){

				}
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});
  };
};