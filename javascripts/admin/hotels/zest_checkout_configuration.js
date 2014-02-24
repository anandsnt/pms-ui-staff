var ZestCheckOutConfiguration = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;

  this.delegateEvents = function(){
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
  	that.myDom.find('#save_guest_checkout').on('click', that.saveGuestCheckOut);
  	that.myDom.find('#send_email').on('click', that.sendNotificationMail);
  };

  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  // To save checkin configuration
  this.saveGuestCheckOut = function() {


	 var checkout_email_alert_time = that.myDom.find("#sent-checkout-notification-email").val();

	 var data = {
		    "checkout_email_alert_time": checkout_email_alert_time
	 };

	 var url = '/admin/save_checkout_settings';
	 var webservice = new WebServiceInterface();
	 var options = {
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSaveGuestCheckOutConfig,
				failureCallBack : that.fetchFailedOfAction,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);

  };
  // To handle success on save API
  this.fetchCompletedOfSaveGuestCheckOutConfig = function(data) {
  	sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  };
  // To handle success on save API
  this.fetchFailedOfAction = function(errorMessage) {
  	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };
  // To send notification email
  this.sendNotificationMail = function() {

	 var url = '/admin/send_checkout_alert';
	 var webservice = new WebServiceInterface();
	 var options = {
				failureCallBack : that.fetchFailedOfAction,
				successCallBack: that.fetchCompletedOfSend,
				loader: 'blocker'
	 };
	 webservice.getJSON(url, options);

  };
    // To handle success
  this.fetchCompletedOfSend = function(data) {
  	 sntapp.notification.showSuccessMessage(data.msg, that.myDom, '', true);
  };

};