var ZestCheckOutConfiguration = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;

  this.delegateEvents = function(){
  	// To unbind all events that happened - CICO-5474 fix
  	that.myDom.on('load').unbind("click");
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
  	that.myDom.find('#save_guest_checkout').on('click', that.saveGuestCheckOut);
  	that.myDom.find('#send_email').on('click', that.sendNotificationMail);
  	that.myDom.find('#listguests').on('click', that.gotoNextPage);
  	that.myDom.find('#send-checkout-staff-alert').on('click', that.handleStaffAlertToggle);
  };

 this.pageshow = function(){
  	that.showHideDiv();
  };
  //To handle staff alert toggle actions
  this.handleStaffAlertToggle = function(){
  	setTimeout(function() {
  		that.showHideDiv();
  	}, 400);// timeout is to complete toggle action
  };
  //To show/hide options
  this.showHideDiv = function(){
      if(that.myDom.find('#send-checkout-staff-alert').parent().hasClass("on")){
      	that.myDom.find('#options').show();
      } else {
      	that.myDom.find('#options').hide();
      }
  };
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  // To save checkin configuration
  this.saveGuestCheckOut = function() {

	 var alert_time_hour = that.myDom.find("#sent-checkout-notification-hour").val();
	 var alert_time_minute =  that.myDom.find("#sent-checkout-notification-minute").val();
	 var require_cc_for_checkout_email =  that.myDom.find("#require_cc").is(":checked");
   var include_cash_reservations =  that.myDom.find("#include_cash").is(":checked");
	 var checkout_email_alert_time = "";
	 if (alert_time_hour != "" && alert_time_minute != ""){
	  checkout_email_alert_time = alert_time_hour+":"+alert_time_minute;
	 }
	 var is_send_checkout_staff_alert = "false";
	 if(that.myDom.find('#send-checkout-staff-alert').parent().hasClass("on")){
	     is_send_checkout_staff_alert = "true";
	 }
	 var checkout_staff_alert_option = "";
	 if(that.myDom.find('#all').parent().hasClass("checked")){
	 	checkout_staff_alert_option = "all";
	 }
	  if(that.myDom.find('#notsuccess').parent().hasClass("checked")){
	 	checkout_staff_alert_option = "not_success";
	 }
	 var staffEmail = that.myDom.find('#staff-email-accounts').val();
	 var lateCheckoutStaffEmail = that.myDom.find('#staff-late-checkout-email-accounts').val();
	 var data = {
		    "checkout_email_alert_time": checkout_email_alert_time,
		    "require_cc_for_checkout_email" : require_cc_for_checkout_email,
        	"include_cash_reservations": include_cash_reservations,
		    "is_send_checkout_staff_alert": is_send_checkout_staff_alert,
		    "checkout_staff_alert_option": checkout_staff_alert_option,
		    "emails": staffEmail,
		    "staff_emails_for_late_checkouts": lateCheckoutStaffEmail
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
  	 sntapp.notification.showSuccessMessage(data.data.message, that.myDom, '', true);
  };
  /**
  * Method for showing next page (based on href)
  */
  this.gotoNextPage =  function(event){
  		event.preventDefault();
  		var target = $(event.target);
        var href = target.attr("href");
  	    var viewParams = {};
	    var currentDiv = sntadminapp.getCurrentDiv();
	    var nextDiv = sntadminapp.getReplacingDiv(currentDiv);
	    var backDom = currentDiv;
	  	var nextViewParams = {'backDom': backDom, 'checkinParams': that.viewParams};

	    if(typeof href !== 'undefined'){
	  		sntapp.fetchAndRenderView(href, nextDiv, viewParams, 'BLOCKER', nextViewParams);
	  		nextDiv.show();
	  		backDom.hide();
	    }
  };

};