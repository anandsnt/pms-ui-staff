// Modal to show QR Code
var QrCodeModel = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = "staff/reservations/"+that.reservation_id+"/get_key_on_tablet";
};