var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];
  	
  this.pageinit = function(){
  	console.log("Page Init inside reservation payment");
    this.myDom.find($('#add-new-payment')).on('click', that.addNewPaymentModal);
    this.myDom.find($('#staycard_creditcard')).on('change', that.setPaymentToReservation);
  };
  this.delegateEvents = function(){
  	console.log("delegateEvents inside reservation payment");
  	
  };
  this.addNewPaymentModal = function(){
  	console.log("Initialise addNewPaymentModal");
  	var addNewPaymentModal = new AddNewPaymentModal("reservation");
    addNewPaymentModal.initialize();
  };
  this.setPaymentToReservation = function(){
  	var reservation_id = getReservationId();
  	var credit_card_id = $("#staycard_creditcard").val();
  	$.ajax({
		type : "POST",
		url : '/staff/reservation/link_payment',
		data : {"reservation_id": reservation_id, "user_payment_type_id": credit_card_id },
		async : false,
		dataType : 'json',
		success : function() {			
			
		},
		error : function() {
			console.log("There is an error!!");
		}
	});
  
  };
};


	