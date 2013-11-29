var BillCardPaymentModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "http://localhost:3000/ui/show?haml_file=modals/billCardPayment&is_partial=true";
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