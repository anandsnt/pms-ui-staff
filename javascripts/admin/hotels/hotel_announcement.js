var HotelAnnouncementView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  this.currentView = $("body").attr("id") ;
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_hotel_announcement').on('click', that.saveHotelAnnouncements); 
  };
  
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  
  this.saveHotelAnnouncements = function() {
	 console.log("saveHotelAnnouncements");
	 var guest_zest_welcome_message = that.myDom.find("#guest-zest-welcome-message").val();
	 var guest_zest_checkout_message = that.myDom.find("#guest-zest-checkout-message").val();
	 var guest_zest_key_delivery_email_message = that.myDom.find("#guest-zest-key-delivery-email-message").val();
	 var data = {
				"guest_zest_welcome_message":  guest_zest_welcome_message,
				"guest_zest_checkout_complete_message":  guest_zest_checkout_message,
				"key_delivery_email_message": guest_zest_key_delivery_email_message
	 };
	 console.log(data);
	 
	 var url = '';
	 var webservice = new WebServiceInterface();
	 var options = { 
				requestParameters: data,
				successCallBack: that.fetchCompletedOfsaveHotelAnnouncements,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);	
	    
  };
  
  this.fetchCompletedOfsaveHotelAnnouncements = function() {
  	console.log("fetchCompletedOfsaveHotelAnnouncements");
  };
};