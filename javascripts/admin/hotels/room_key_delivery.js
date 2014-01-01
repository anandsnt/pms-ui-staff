var RoomKeyDeliveryView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_room_key_delivery').on('click', that.saveRoomKeyDeliveryView);
  };
  
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  // To save Room Key Delivery View
  this.saveRoomKeyDeliveryView = function() {
  	
	var room_key_for_guest_zest = $("#room-key-for-guest-zest input[type='radio']:checked").val();
	var room_key_for_rover = $("#room-key-for-rover input[type='radio']:checked").val();
	 
	var data = {
		    "room_key_delivery_for_guestzest_check_in": room_key_for_guest_zest,
			"room_key_delivery_for_rover_check_in": room_key_for_rover
	};
	
	var url = '';
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