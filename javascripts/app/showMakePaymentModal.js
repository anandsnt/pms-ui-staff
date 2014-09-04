var ShowMakePaymentModal = function() {

	BaseModal.call(this);
	var that = this;
	
	this.reservationId = getReservationId();
	this.url = "staff/reservations/"+that.reservationId+"/deposit_and_balance";

	this.delegateEvents = function() {
		that.myDom.find('#close').on('click', that.hidePaymentModal);
		
	};
	that.hidePaymentModal = function(){
		that.hide();
	};

	
};