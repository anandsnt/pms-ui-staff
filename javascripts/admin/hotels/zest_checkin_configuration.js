var ZestCheckinConfiguration = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_guest_checkin').on('click', that.saveGuestCheckin);
  };
  
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  // To save checkin configuration
  this.saveGuestCheckin = function() {
  	
  	 var is_send_alert = "false";
  	 
  	 if(that.myDom.find("#send-checkin-alert").parent().hasClass("on")){
  	 	 is_send_alert = "true";
  	 }
  	 var is_notify = "false";
  	 if($("#notify-guest").parent("label:eq(0)").hasClass("checked")) {
	  	  var is_notify = "true";
	 }
	 var guest_checkin_alert = that.myDom.find("#guest-checkin-alert").val();
	 
	 var data = {
		    "checkin_alert_message": guest_checkin_alert,
		    "is_send_alert": is_send_alert,
		    "is_notify_on_room_ready": is_notify
	 };
	 
	 var url = '/admin/checkin_setups/save_setup';
	 var webservice = new WebServiceInterface();
	 var options = { 
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSaveGuestCheckinConfig,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);	
	    
  };
  // To handle success on save API
  this.fetchCompletedOfSaveGuestCheckinConfig = function(data) {
  	sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  };
  
};