var RoomTypeChargeModal = function(options) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/roomTypeChargeModal";

	this.delegateEvents = function() {
		that.myDom.find('#ok').on('click',that.okButtonClicked);
	};
	
	this.okButtonClicked = function(){
		
		var roomTypeCharge = that.myDom.find("#room-type-charge").val();
		options.requestParameters.upsell_amount = roomTypeCharge;
		
		var url = '/staff/reservations/upgrade_room';
		var webservice = new WebServiceInterface();
		webservice.postJSON(url, options);
		
		that.hide();
		
	};
};