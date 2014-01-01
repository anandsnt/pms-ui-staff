var HotelAnnouncementView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_hotel_announcement').on('click', that.saveHotelAnnouncements); 
  };
  
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  // To save Hotel Announcements
  this.saveHotelAnnouncements = function() {
	 var guest_zest_welcome_message = that.myDom.find("#guest-zest-welcome-message").val();
	 var guest_zest_checkout_message = that.myDom.find("#guest-zest-checkout-message").val();
	 var guest_zest_key_delivery_email_message = that.myDom.find("#guest-zest-key-delivery-email-message").val();
	 var data = {
				"guest_zest_welcome_message":  guest_zest_welcome_message,
				"guest_zest_checkout_complete_message":  guest_zest_checkout_message,
				"key_delivery_email_message": guest_zest_key_delivery_email_message
	 };
	 
	 var url = '';
	 var webservice = new WebServiceInterface();
	 var options = { 
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSaveHotelAnnouncements,
				failureCallBack: that.fetchFailedOfSaveHotelAnnouncements,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);	
	    
  };
  // To handle success on save API
  this.fetchCompletedOfSaveHotelAnnouncements = function() {
  	sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  };
  // To handle failure on save API
  this.fetchFailedOfSaveHotelAnnouncements = function(errorMessage){
  	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };
  
};