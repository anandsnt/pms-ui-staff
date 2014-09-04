var ShowMakePaymentModal = function() {

	BaseModal.call(this);
	var that = this;
	sntapp.cardSwipeCurrView = 'StayCardDepositModal';
	
	this.reservationId = getReservationId();
	this.url = "staff/reservations/"+that.reservationId+"/deposit_and_balance";

	this.delegateEvents = function() {
		that.myDom.find('#close').on('click', that.hidePaymentModal);
		that.myDom.find("#make-payment").on('click', that.makePayment);
	};
	this.hidePaymentModal = function(){
		that.hide();
	};
	this.dataUpdated = function(){
		console.log("=====================================");
	};
	this.makePayment = function(){
		var cardNumber = that.myDom.find("#card-number").val(),
			expiryMonth = that.myDom.find("#expiry-month").val(),
			expiryYear = that.myDom.find("#expiry-year").val(),
			cardExpiry = expiryMonth && expiryYear ? "20"+expiryYear+"-"+expiryMonth+"-01" : "";
		
	};
	
	

	
};