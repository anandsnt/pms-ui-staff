var RoomTypeChargeModal = function(options) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/roomTypeChargeModal";

	this.delegateEvents = function() {
		that.myDom.find('#ok').on('click',that.okButtonClicked);
		that.myDom.find('#room-type-charge').on('keypress',that.keypressed);
		that.myDom.find('#room-type-charge').on('keyup',that.keyUp);
	};
	
	this.okButtonClicked = function(){
		
		var roomTypeCharge = that.myDom.find("#room-type-charge").val();
		options.requestParameters.upsell_amount = roomTypeCharge;
		
		var url = '/staff/reservations/upgrade_room';
		var webservice = new WebServiceInterface();
		webservice.postJSON(url, options);
		
		that.hide();
		
	};
	this.keypressed = function(e){
		if ( e.keyCode == 13 ) {
			e.preventDefault();
	   	}
	 };  	
	   	
	this.keyUp = function(e){
	   	var roomTypeCharge = that.myDom.find("#room-type-charge").val();
	   	
	   	if(roomTypeCharge == ""){
	   		that.myDom.find('#ok').attr("disabled", true);
	   	}
	   	else{
	   		that.myDom.find('#ok').attr("disabled", false);
	   	}
	};
	
};