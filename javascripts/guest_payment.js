var GuestPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDomElement = domRef;   
 	
  this.pageinit = function(){
    that.myDomElement.find($('#payment_tab #add_new_payment')).on('click', that.renderNewPaymentView); 
    that.myDomElement.find($('#payment_tab .active-item')).on('click', that.renderSetAsPrimary);    
  };  
  
  this.renderSetAsPrimary = function(e){	
	var credit_id = $(this).attr("credit_id");
  	var setPaymentAsPrimaryModal = new SetPaymentAsPrimaryModal();
    setPaymentAsPrimaryModal.initialize();
    setPaymentAsPrimaryModal.params = {"credit_id": credit_id};
  };
  
  this.renderNewPaymentView = function(e){
  	var addNewPaymentModal = new AddNewPaymentModal("guest");
    addNewPaymentModal.initialize();  
  };
};