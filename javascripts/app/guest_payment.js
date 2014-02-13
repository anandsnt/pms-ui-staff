var GuestPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;   
 	
  this.pageinit = function(){
    that.myDom.find('#payment_tab').on('click', that.clickedOnPaymentTab);	
  };  
  this.clickedOnPaymentTab= function(e){
  	var clickedElement = $(e.target);
  	if(clickedElement.hasClass("active-item")){	
  		that.renderSetAsPrimary(clickedElement);
   	}
  	else if(clickedElement.parent().hasClass("active-item")){
   		that.renderSetAsPrimary(clickedElement.parent());
   	}
  	else if(clickedElement.hasClass("add-new-button") || clickedElement.parent().hasClass("add-new-button")){
   		that.renderNewPaymentView();
   	}
  };
  this.renderSetAsPrimary = function(element){	
	var credit_id = element.attr("credit_id");
  	var setPaymentAsPrimaryModal = new SetPaymentAsPrimaryModal();
    setPaymentAsPrimaryModal.initialize();
    setPaymentAsPrimaryModal.params = {"credit_id": credit_id, "myDom": that.myDom};
  };
  
  this.renderNewPaymentView = function(e){
  	var addNewPaymentModal = new AddNewPaymentModal("guest", that.myDom);
    addNewPaymentModal.initialize();  
  };
};