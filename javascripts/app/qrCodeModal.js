var QrCodeModel = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	//this.url = "ui/show?haml_file=modals/qrCodeModal.html.haml&json_input=stay_card/key_qr_code.json&is_hash_map=true&is_partial=true";
	this.url = "reservations/"+that.reservation_id+"/get_key_on_tablet";

};