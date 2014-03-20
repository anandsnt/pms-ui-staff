var UpsellLateCheckoutView = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;

  this.pageinit = function(){
  };
  this.pageshow = function(){
  	 if(that.myDom.find('#checkout-time-extended-to-1').val()=="" || that.myDom.find('#charge-for-checkout-1').val()==""){
  	 	that.myDom.find('#checkout-time-extended-to-2').attr("disabled", true);
  	 	that.myDom.find('#charge-for-checkout-2').attr("readonly", "readonly");
  	 } 
  	 if(that.myDom.find('#checkout-time-extended-to-2').val()=="" || that.myDom.find('#charge-for-checkout-2').val()==""){
  	 	that.myDom.find('#checkout-time-extended-to-3').attr("disabled", true);
  	 	that.myDom.find('#charge-for-checkout-3').attr("readonly", "readonly");
  	 }
  	 
  };
   this.delegateEvents = function(){
   		// To unbind all events that happened - CICO-5474 fix
  		that.myDom.on('load').unbind("click");
	   that.myDom.find('#save').on('click', that.saveHotelDetails);
	   that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
	   that.myDom.find('#checkout-time-extended-to-1').on('change', that.changeSecondLevel);
	   that.myDom.find('#charge-for-checkout-1').on('change keydown', that.changeSecondLevel);
	   that.myDom.find('#checkout-time-extended-to-2').on('change', that.changeThirdLevel);
	   that.myDom.find('#charge-for-checkout-2').on('change keydown', that.changeThirdLevel);
  };
  this.changeSecondLevel = function(){
  	 setTimeout(function(){
	  	if(that.myDom.find('#checkout-time-extended-to-1').val()!="" && that.myDom.find('#charge-for-checkout-1').val()!=""){
		   	that.myDom.find('#checkout-time-extended-to-2').attr("disabled", false);
	  	 	that.myDom.find('#charge-for-checkout-2').removeAttr("readonly", "");	
		} else {
			that.myDom.find('#checkout-time-extended-to-2').attr("disabled", true);
	  	 	that.myDom.find('#charge-for-checkout-2').attr("readonly", "readonly");
	  	 	that.myDom.find('#checkout-time-extended-to-2').val("");
	  	 	that.myDom.find('#charge-for-checkout-2').val("");
	  	 	that.myDom.find('#checkout-time-extended-to-3').attr("disabled", true);
	  	 	that.myDom.find('#charge-for-checkout-3').attr("readonly", "readonly");
	  	 	that.myDom.find('#checkout-time-extended-to-3').val("");
	  	 	that.myDom.find('#charge-for-checkout-3').val("");
		}},400);
  };
  this.changeThirdLevel = function(){
  	 setTimeout(function(){
	  	if(that.myDom.find('#checkout-time-extended-to-2').val()!="" && that.myDom.find('#charge-for-checkout-2').val()!=""){
		   	that.myDom.find('#checkout-time-extended-to-3').attr("disabled", false);
	  	 	that.myDom.find('#charge-for-checkout-3').removeAttr("readonly", "");	
		} else {
			that.myDom.find('#checkout-time-extended-to-3').attr("disabled", true);
	  	 	that.myDom.find('#charge-for-checkout-3').attr("readonly", "readonly");
	  	 	that.myDom.find('#checkout-time-extended-to-3').val("");
	  	 	that.myDom.find('#charge-for-checkout-3').val("");
		}},400);
  };
  this.goBackToPreviousView = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };

  this.saveHotelDetails =  function(){
	  var extended_checkout = new Array();
	  var i = 1;
	  var time = "", charge = "";
	  var dict = "";
	  var is_late_checkout_set = "false", is_exclude_guests = "false";
	  var allowed_late_checkout = "", sent_alert = "", currency_code = "";
	  var charge_code = that.myDom.find('#charge-code').val();
	  // $("select[name='checkout-time-extended-to']").each(function(){
		  // hour = $("#checkout-time-extended-to-" + i).val();
		  // primetime = "PM";
		  // time = hour+" "+primetime;
		  // charge = $("#charge-for-checkout-" + i).val();
		  // if(time!="" && charge!=""){
		  	// dict = {'time': time, 'charge': charge};
		  // }
// 		  	
		  // extended_checkout.push(dict);
		  // i = i + 1;
	  // });
	  	  hour = $("#checkout-time-extended-to-1").val();
		  primetime = "PM";
		  time = hour+" "+primetime;
		  charge = $("#charge-for-checkout-1").val();
		  if(hour!="" || charge!=""){
		  	dict = {'time': time, 'charge': charge};
		  	extended_checkout.push(dict);
		  }
		   hour = $("#checkout-time-extended-to-2").val();
		  primetime = "PM";
		  time = hour+" "+primetime;
		  charge = $("#charge-for-checkout-2").val();
		  if(hour!="" || charge!=""){
		  	dict = {'time': time, 'charge': charge};
		  	extended_checkout.push(dict);
		  }
		   hour = $("#checkout-time-extended-to-3").val();
		  primetime = "PM";
		  time = hour+" "+primetime;
		  charge = $("#charge-for-checkout-3").val();
		  if(hour!="" || charge!=""){
		  	dict = {'time': time, 'charge': charge};
		  	extended_checkout.push(dict);
		  }
		  	
		  
	  if($("#div-late-checkout-upsell").hasClass("on")) {
		  is_late_checkout_set = "true";
	  }
	  allowed_late_checkout = $("#number-of-late-checkout").val();
	  if($("#exclude-guest-pre-allocated-room").parent("label:eq(0)").hasClass("checked")) {
	  	  is_exclude_guests = "true";
	  }
	  var sent_alert_hour = that.myDom.find("#sent-alert-to-all-guests-hour").val();
	  var sent_alert_minute = that.myDom.find("#sent-alert-to-all-guests-minute").val() || "00";	  
	  var currency_code = $("#currency-code").val();
	  var sent_alert = sent_alert_hour ? sent_alert_hour+":"+sent_alert_minute : "";
	  var postParams = {};
	  postParams.is_late_checkout_set = is_late_checkout_set;
	  postParams.allowed_late_checkout = allowed_late_checkout;
	  postParams.is_exclude_guests = is_exclude_guests;
	  postParams.currency_code = currency_code;
	  postParams.extended_checkout = extended_checkout;
	  postParams.sent_alert = sent_alert;
	  postParams.charge_code = charge_code;

	  var url = '/admin/hotel/update_late_checkout_setup';
	  var webservice = new WebServiceInterface();
	  var options = {
			   requestParameters: postParams,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave,
			   loader: "BLOCKER"
	  };
	  webservice.postJSON(url, options);

  };
  // To handle success on save API
  this.fetchCompletedOfSave = function() {
  	sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  };
  // To handle failure on save API
  this.fetchFailedOfSave = function(errorMessage){
  	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };
};