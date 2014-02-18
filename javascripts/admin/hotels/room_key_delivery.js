var RoomKeyDeliveryView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_room_key_delivery').on('click', that.saveRoomKeyDeliveryView);
  	that.myDom.find("#room-key-for-rover input[name='rover']").on('click', that.roverRadioButtonClick);
  };
  //clicked on rover radio button
  this.roverRadioButtonClick = function(event){
	  var element = $(event.target);
	  var value = element.attr('value');
	  if(value == "encode"){
	  	that.myDom.find("#key-system-attributes").removeClass("hidden");
	  } else {
	  	that.myDom.find("#key-system-attributes").addClass("hidden");
	  }
  };
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  // To save Room Key Delivery View
  this.saveRoomKeyDeliveryView = function() {
  	
	var room_key_for_guest_zest = that.myDom.find("#room-key-for-guest-zest input[type='radio']:checked").val();
	var room_key_for_rover = that.myDom.find("#room-key-for-rover input[type='radio']:checked").val();
	var key_system_id = "";
	var key_access_url = "";
	var key_access_port = "";
  	var key_username = "";
  	var key_password = "";
	if(room_key_for_rover == "encode"){
		key_system_id = that.myDom.find("#key-system-vendor").val();
		key_access_url = that.myDom.find("#key-system-access-url").val();
		key_access_port = that.myDom.find("#key-system-access-port").val();
		key_username = that.myDom.find("#key-system-username").val();
		key_password = that.myDom.find("#key-system-password").val();
	} 
	var data = {
		    "room_key_delivery_for_guestzest_check_in": room_key_for_guest_zest,
			"room_key_delivery_for_rover_check_in": room_key_for_rover,
			"key_system_id": key_system_id,
			"key_access_url": key_access_url,
			"key_access_port": key_access_port,
      "key_username": key_username,
      "key_password": key_password
	};
	
	var url = '/admin/update_room_key_delivery_settings';
	var webservice = new WebServiceInterface();
	var options = { 
			requestParameters: data,
			successCallBack: that.fetchCompletedOfSaveRoomKeyDeliveryView,
			failureCallBack: that.fetchFailedOfSaveRoomKeyDeliveryView,
			loader: 'blocker'
	};
	webservice.postJSON(url, options);	
	    
  };
  // To handle success on save API
  this.fetchCompletedOfSaveRoomKeyDeliveryView = function(data) {
  	sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  };
  // To handle failure on save API
  this.fetchFailedOfSaveRoomKeyDeliveryView = function(errorMessage){
  	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };
};