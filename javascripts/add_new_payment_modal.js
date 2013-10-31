var AddNewPaymentModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.myDom = "#modal";
  	this.url = "staff/dashboard/addNewPayment";
  	this.delegateEvents = function(){
  		console.log("sub modal delegate events");
	}
	this.modalInit = function(){
        console.log("modal init in sub modal");
    }
}