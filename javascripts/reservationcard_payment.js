var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];
  	
  this.pageinit = function(){
  	console.log("Page Init inside reservation payment");
    this.myDom.find($('#add-new-payment')).on('click', that.addNewPaymentModal);
  }
  this.delegateEvents = function(){
  	console.log("delegateEvents inside reservation payment");
  	
  }
  this.addNewPaymentModal = function(){
  	console.log("Initialise addNewPaymentModal");
  	var addNewPaymentModal = new AddNewPaymentModal();
    addNewPaymentModal.initialize();
  }
}
