var BillCardPaymentModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.reservation_id = getReservationId();
  	this.url = "staff/reservation/"+this.reservation_id+"/get_pay_bill_details";
  	this.delegateEvents = function(){
		that.myDom.find("#submit-payment").on("click",that.clickedSubmitPayment);
	};
	
	this.modalInit = function(){
		console.log("BillCardPaymentModal");
    };
    
    this.clickedSubmitPayment = function(){
		console.log("clickedSubmitPayment");
    };
}