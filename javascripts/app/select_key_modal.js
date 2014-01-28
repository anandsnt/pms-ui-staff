var SelectKeyModel = function(callBackForSuccess,callBackForQrCode) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	
	this.url = "ui/show?haml_file=modals/selectKeyModal.html.haml&json_input=stay_card/key_qr_code.json&is_hash_map=true&is_partial=true";
	//this.url = "staff/reservations/"+that.reservation_id+"/get_key_on_tablet";
	
	this.delegateEvents = function(){
		that.myDom.find('#key-cut').on('click', callBackForSuccess);
		that.myDom.find('#show-qr').on('click', callBackForQrCode);
	}
};