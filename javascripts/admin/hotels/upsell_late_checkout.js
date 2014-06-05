var UpsellLateCheckoutView = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;
  this.deleted_room_types = [];
  
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
	   
	   that.myDom.find('#add-room-type').on('click', that.changeRoomType);
	   //that.myDom.find('#room-types').on('change', that.changeRoomType);
	   that.myDom.find('#room-type-details').on('click', that.clickedRoomTypeDetails);
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
	  // Searching for max_late_checkouts in room-type-details
	  postParams.room_types = [];
	  postParams.deleted_room_types = [];
	  that.myDom.find("#room-type-details div div" ).each(function() {
			var value = $(this).find('input').val();
			var id = $(this).find('input').attr('id');
			var obj = { "id": id , "max_late_checkouts": value};
			postParams.room_types.push(obj);
	  });
	  postParams.deleted_room_types = that.deleted_room_types;
	  
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
  // To handle Room type change
  this.changeRoomType = function(event){
  	event.preventDefault();
  	var element = $("#room-types");
	
	var selectedRoomTypeId = $(element).find('option:selected').val();
	var selectedRoomTypeText = $(element).find('option:selected').text();
	
  	if(selectedRoomTypeId != "")	{
  		// To show room type header
  		that.myDom.find('#room-type-header .entry').removeClass('hidden');
  		
	  	var html = "<div class='entry full-width room-type-details' id='room-type-box-"+selectedRoomTypeId+"'><div class='entry'><span class='align-text-center'>"+selectedRoomTypeText+"</span></div>"+
	  	"<div class='entry'><span class='entry'><input type='text' value='0' required=''  id='"+selectedRoomTypeId+"'></span>"+
	  	"<span class='entry'><a class='icons icon-delete large-icon align-text-center' id='"+selectedRoomTypeId+"' name='"+selectedRoomTypeText+"'>"+
		"</a></span></div></div>";
		
	  	that.myDom.find('#room-type-details').prepend(html);
	  	// Removing RoomType from select box
	  	that.myDom.find("#room-types option[value='"+selectedRoomTypeId+"']").remove();
  	}
  };
  // To handle delete the selected room type
  this.clickedRoomTypeDetails = function(e){
  		var element = $(e.target);
	  	// Delete button click
	  	if(element.hasClass('icon-delete')){
			var selectedRoomTypeId = element.attr('id');
			var selectedRoomTypeText = element.attr('name');
			that.myDom.find("#room-type-box-"+selectedRoomTypeId).remove();
			// Adding back Room type to select box.
			var html = "<option value='"+selectedRoomTypeId+"'>"+selectedRoomTypeText+"</option>";
			that.myDom.find("#room-types").append(html);
			
			that.deleted_room_types.push(selectedRoomTypeId);
			
			var length = $("#room-type-details").find(".room-type-details").length;
			// To hide room type header
			if(length == 0){
				that.myDom.find('#room-type-header .entry').addClass('hidden');
			}
		}
		
  };
  
  
};