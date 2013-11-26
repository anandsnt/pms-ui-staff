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
  	var hotelName = that.myDom.find($("#hotel-name")).val(),
  	    hotelShortName = that.myDom.find($("#hotel-short-name")).val(),
  	    hotelAlias = that.myDom.find($("#hotel-alias")).val(),
  	    hotelStreet = that.myDom.find($("#hotel-street")).val(),
  	    hotelPhone = that.myDom.find($("#hotel-phone")).val(),
  	    hotelZipCode = that.myDom.find($("#hotel-zipcode")).val(),
  	    hotelCity = that.myDom.find($("#hotel-city")).val(),
  	    hotelState = that.myDom.find($("#hotel-state")).val(),
  	    hotelCountry = that.myDom.find($("#hotel-country")).val(),
  	    hotelLongitude = that.myDom.find($("#hotel-longitude")).val(),
  	    hotelLatitude = that.myDom.find($("#hotel-longitude")).val(),
  	    hotelCheckinHour = that.myDom.find($("#hotel-checkin-hour")).val(),
  	    hotelCheckinMin = that.myDom.find($("#hotel-checkin-minutes")).val(),
  	    hotelCheckoutHour = that.myDom.find($("#hotel-checkout-hour")).val(),
  	    hotelCheckoutMinutes = that.myDom.find($("#hotel-checkout-minutes")).val(),
  	    hotelArrivalGrace = that.myDom.find($("#hotel-arrival-grace")).val();
  	console.log("Reached save HotelDetailsView");
  };
};