var SelectKeyModel = function(callBackForSuccess,callBackForQrCode) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = "staff/reservations/"+that.reservation_id+"/show_key_delivery";
	this.delegateEvents = function(){
		that.myDom.find('#key-cut').on('click', callBackForSuccess);
		that.myDom.find('#show-qr').on('click', callBackForQrCode);
	}
};