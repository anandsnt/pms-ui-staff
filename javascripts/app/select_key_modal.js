// Modal to show Select keys
var SelectKeyModel = function(callBackForSuccess,callBackForQrCode) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = "staff/reservations/"+that.reservation_id+"/show_key_delivery";
	
	// show QR code Modal while click Show QR code.
	// Show complete checkin message when click Key cut.
	this.delegateEvents = function(){
		that.myDom.find('#key-cut').on('click', callBackForSuccess);
		that.myDom.find('#show-qr').on('click', callBackForQrCode);
		that.myDom.find('#cancel').on('click', callBackForSuccess);
		$('#modal-overlay').on('click', callBackForSuccess);
	}
};