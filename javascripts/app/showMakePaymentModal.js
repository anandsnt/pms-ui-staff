var ShowMakePaymentModal = function() {

	BaseModal.call(this);
	var that = this;
	
	this.reservationId = getReservationId();
	this.url = "api/reservations/"+that.reservationId+"/deposit_and_balance";

	this.delegateEvents = function() {
		//that.myDom.find('#set-wake-up-call #save-wakeup-call').on('click', that.saveWakeUpCall);
		
	};

	
};