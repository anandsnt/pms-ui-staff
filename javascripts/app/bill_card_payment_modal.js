var BillCardPaymentModal = function(callBack){
  	BaseModal.call(this);
  	var that = this;
  	this.reservation_id = getReservationId();
  	this.url = "staff/reservation/"+this.reservation_id+"/get_pay_bill_details";
  	this.delegateEvents = function(){
  		that.myDom.find("#submit-payment").append(this.params.bill_number);	// To set bill number on pay button.
		that.myDom.find("#submit-payment").on("click",that.clickedSubmitPayment);
	};
	
	this.modalInit = function(){
    };
    
    this.clickedSubmitPayment = function(){
		var amount = that.myDom.find("#amount").val();
		var card_number = that.myDom.find("#card_details").val();
		var bill_number = that.params.bill_number;
		var webservice = new WebServiceInterface();
    	var data = {
    		"reservation_id": that.reservation_id, 
    		"credit_card_number":card_number,
    		"bill_number":bill_number,
    		"amount":amount };
    	var url = 'staff/reservation/post_payment';
	    var options = { 
	    				requestParameters: data,
	    				successCallBack: that.fetchCompletedOfSubmitPayment,
	    				failureCallBack: that.fetchFailedOfSubmitPayment,
	    				loader: 'blocker'
	    		};
	    webservice.postJSON(url, options);
    };
    this.fetchCompletedOfSubmitPayment = function(){
    	that.hide(callBack);
    };
    this.fetchFailedOfSubmitPayment = function(){
    	that.hide();
    };
};