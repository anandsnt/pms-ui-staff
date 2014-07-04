var RoomTypeChargeModal = function(options) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/roomTypeChargeModal";
	
    var initialRoomType = options.successCallBackParameters.initialRoomType;
    var selectedRoomType = options.successCallBackParameters.selectedRoomType;
    var previousDom = options.successCallBackParameters.prevDom;
    
	this.delegateEvents = function() {
		that.myDom.find('#ok').on('click',that.okButtonClicked);
		that.myDom.find('#nocharge').on('click',that.noChargeClicked);
		that.myDom.find('#room-type-charge').on('keypress',that.keypressed);
		that.myDom.find('#room-type-charge').on('keyup',that.keyUp);
		that.myDom.find("#cancel-room-type-charge-modal").on('click',that.cancelAction);
	};
	/*
	 * Cancel Action - Cancel button, will cancel upgrade and bring user to previous room type and number.
	 * CICO-7209
	 */
	this.cancelAction = function(){
		previousDom.find("#room-type-selectbox").val(initialRoomType);
		options.successCallBackParameters.call();
		that.hide();
	};
	this.okButtonClicked = function(){

		var roomTypeCharge = that.myDom.find("#room-type-charge").val();
		options.requestParameters.upsell_amount = roomTypeCharge;

		var url = '/staff/reservations/upgrade_room';
		var webservice = new WebServiceInterface();
		webservice.postJSON(url, options);

		that.hide();

	};
	this.noChargeClicked = function(e){
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
	   		that.myDom.find('#nocharge').attr("disabled", false);
	   	}
	   	else{
	   		that.myDom.find('#ok').attr("disabled", false);
	   		that.myDom.find('#nocharge').attr("disabled", true);
	   	}
	};

};