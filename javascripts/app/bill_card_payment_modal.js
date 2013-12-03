var BillCardPaymentModal = function(callBack){
  	BaseModal.call(this);
  	var that = this;
  	this.reservation_id = getReservationId();
  	this.url = "staff/reservation/"+this.reservation_id+"/get_pay_bill_details";
  	this.delegateEvents = function(){
  		that.myDom.find("#submit-payment").append(this.params.bill_number);// To set bill number to submit buton text.
		that.myDom.find("#submit-payment").on("click",that.clickedSubmitPayment);
	};
	
	this.modalInit = function(){
    };
    
    this.clickedSubmitPayment = function(){
		var amount = that.myDom.find("#amount").val();
		var card_number = that.myDom.find("#card_details").val();
		var bill_number = that.params.bill_number;
    	var data = {
    		"reservation_id": that.reservation_id, 
    		"credit_card_number":card_number,
    		"bill_number":bill_number,
    		"amount":amount };
    		  
	    $.ajax({
			type : "POST",
			url : 'staff/reservation/post_payment',
			data : JSON.stringify(data),
			async : false,
			dataType : 'json',
			contentType : 'application/json',
			success : function(data) {
			    that.hide(callBack);
			},
			error : function() {
			}
		});
    };
}