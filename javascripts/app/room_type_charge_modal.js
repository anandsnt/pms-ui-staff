var RoomTypeChargeModal = function(options) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/roomTypeChargeModal";

	this.delegateEvents = function() {
		that.myDom.find('#ok').on('click',that.okButtonClicked);
	};
	
	this.okButtonClicked = function(){
		that.hide();
		
		var roomTypeCharge = that.myDom.find("#room-type-charge").val();
		console.log("roomTypeCharge ==> "+roomTypeCharge);
		
		console.log(options);
		options.requestParameters.upsell_charge = roomTypeCharge;
		console.log(options);
		
		var url = '/staff/reservation/upgrade_room';
		var webservice = new WebServiceInterface();
		webservice.postJSON(url, options);
		
	};
};