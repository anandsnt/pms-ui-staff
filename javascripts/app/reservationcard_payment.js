var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];

  this.parentView = '';
  	
  this.pageinit = function(){
    
  };
  this.delegateEvents = function(){
  	that.myDom.find('#add-new-payment').on('click', that.addNewPaymentModal);
    that.myDom.find('#staycard_creditcard').on('change', that.setPaymentToReservation);
  };
  this.addNewPaymentModal = function(event, options){

  	if ( !sntapp.getViewInst('addNewPaymentModal') ) {
      sntapp.setViewInst('addNewPaymentModal', function() {
        return new AddNewPaymentModal('staycard', that.myDom);
      });
      sntapp.getViewInst('addNewPaymentModal').initialize();
    } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {

      // if addNewPaymentModal instance exist, but the dom is removed
      sntapp.updateViewInst('addNewPaymentModal', function() {
        return new AddNewPaymentModal('staycard', that.myDom);
      });
      sntapp.getViewInst('addNewPaymentModal').initialize();
    }
  };
  
  this.fetchCompletedOfSetPaymentToReservation = function(data){
	// success function set payment to reservation's ajax call  
  };
  
  this.setPaymentToReservation = function(){
  	var reservation_id = getReservationId();
  	var credit_card_id = that.myDom.find("#staycard_creditcard").val();
  	if(credit_card_id == ""){
  		var html = "<figure class='card-logo'>Select Credit Card</figure>"+		
				"<span class='number'>"+					
				"<span class='value number'> </span>"+
				"</span>"+
				"<span class='date'>"+					
				"<span class='value date'></span>"+
				"</span>"+
				"";
  		
  	} else {
  		var html = "<figure class='card-logo'>"+
			"<img src='' alt=''>"+
			"</figure>"+
			"<span class='number'>"+
			"Ending with"+
			"<span class='value number'></span>"+
			"</span>"+
			"<span class='date'>"+
			"Date"+
			"<span class='value date'></span>"+
			"</span>";
  		
  	}
  	that.myDom.find("#selected-reservation-payment-div").html(html);
  	var data = {"reservation_id": reservation_id, "user_payment_type_id": credit_card_id };
  	var url = "/staff/reservation/link_payment";
    var webservice = new WebServiceInterface();
    var options = {
		   requestParameters: data,
		   successCallBack: that.fetchCompletedOfSetPaymentToReservation,
		   async: false,
    };
    webservice.postJSON(url, options);

  
  };
};


	