var ZestCheckinConfiguration = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;

  this.delegateEvents = function(){
  	// To unbind all events that happened - CICO-5474 fix
  	that.myDom.on('load').unbind("click");
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
  	that.myDom.find('#save_guest_checkin').on('click', that.saveGuestCheckin);
  	that.myDom.find('#send_email').on('click', that.sendCheckinNotificationMail);
  	that.myDom.find('#listguests').on('click', that.gotoNextPage);
  	that.myDom.find('#send-checkin-staff-alert').on('click', that.handleStaffAlertToggle);
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
      if(that.myDom.find('#send-checkin-staff-alert').parent().hasClass("on")){
      	that.myDom.find('#options').show();
      } else {
      	that.myDom.find('#options').hide();
      }
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
	 var alert_time_hour = that.myDom.find("#checkin-alert-time-hour").val();
	 var alert_time_minute = that.myDom.find("#checkin-alert-time-minute").val();
	 var alert_time_prime_time = that.myDom.find("#hotel-checkin-primetime").val();
	 var require_cc_for_checkin_email =  that.myDom.find("#require_cc").is(":checked");
	 var alert_time = "";
	 if(alert_time_hour != "" && alert_time_minute != "") {
	 	alert_time = alert_time_hour+":"+alert_time_minute;
	 }
	 var is_send_checkin_staff_alert = "false";
	 if(that.myDom.find('#send-checkin-staff-alert').parent().hasClass("on")){
	     is_send_checkin_staff_alert = "true";
	 }
	 var checkin_staff_alert_option = "";
	 if(that.myDom.find('#all').parent().hasClass("checked")){
	 	checkin_staff_alert_option = "all";
	 }
	  if(that.myDom.find('#notsuccess').parent().hasClass("checked")){
	 	checkin_staff_alert_option = "not_success";
	 }
	 var staffEmail = that.myDom.find('#staff-email-accounts').val();
	 
	 var data = {
		    "checkin_alert_message": guest_checkin_alert,
		    "is_send_alert": is_send_alert,
		    "checkin_alert_time": alert_time,
		    "is_notify_on_room_ready": is_notify,
		    "prime_time":alert_time_prime_time,
		    "require_cc_for_checkin_email" : require_cc_for_checkin_email,
		    "is_send_checkin_staff_alert": is_send_checkin_staff_alert,
		    "checkin_staff_alert_option": checkin_staff_alert_option,
		    "emails": staffEmail 
		    
	 };

	 var url = '/admin/checkin_setups/save_setup';
	 var webservice = new WebServiceInterface();
	 var options = {
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSaveGuestCheckinConfig,
				failureCallBack : that.fetchFailedOfSaveGuestCheckInConfig,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);

  };

  this.sendCheckinNotificationMail = function() {

	 var url = '/admin/checkin_setups/notify_all_checkin_guests';
	 var webservice = new WebServiceInterface();
	 var options = {
				failureCallBack : that.fetchFailedOfAction,
				successCallBack: that.fetchCompletedOfSend,
				loader: 'blocker'
	 };
	 webservice.getJSON(url, options);

  };

  // To handle success on save API
  this.fetchCompletedOfSaveGuestCheckinConfig = function(data) {
  	sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  };
  // To handle success on save API
  this.fetchFailedOfSaveGuestCheckInConfig = function(errorMessage) {
  	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
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