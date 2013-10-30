var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];
  	
  this.pageinit = function(){
  	console.log("Page Init inside reservation payment");
    
  }
  this.delegateEvents = function(){
  	console.log("delegateEvents inside reservation payment");
  	that.myDom.find($('#add-new-payment')).on('click', that.addNewPaymentModal);
  }
  this.initialize = function(){
  	console.log("initialize inside reservation payment");
  }
  this.addNewPaymentModal = function(){
  	
  	alert("addNewPaymentModal");
  }
};