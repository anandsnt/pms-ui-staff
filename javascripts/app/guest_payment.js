var GuestPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;   
 	
  this.pageinit = function(){
    that.myDom.find('#payment_tab').on('click', that.clickedOnPaymentTab);	
  };  
  this.clickedOnPaymentTab= function(e){
  	
  	if($(e.target).hasClass("active-item")){	
  		that.renderSetAsPrimary(e.target);
   	}
   	else if($(e.target).hasClass("add-new-button")){
   		that.renderNewPaymentView();
   	}
  };
  this.renderSetAsPrimary = function(that){	
	var credit_id = $(that).attr("credit_id");
  	var setPaymentAsPrimaryModal = new SetPaymentAsPrimaryModal();
    setPaymentAsPrimaryModal.initialize();
    setPaymentAsPrimaryModal.params = {"credit_id": credit_id};
  };
  
  this.renderNewPaymentView = function(e){
  	var addNewPaymentModal = new AddNewPaymentModal("guest");
    addNewPaymentModal.initialize();  
  };
};