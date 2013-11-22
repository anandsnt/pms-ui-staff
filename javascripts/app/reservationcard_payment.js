var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];
  	
  this.pageinit = function(){
    this.myDom.find($('#add-new-payment')).on('click', that.addNewPaymentModal);
    this.myDom.find($('#staycard_creditcard')).on('change', that.setPaymentToReservation);
  };
  this.delegateEvents = function(){
  	
  };
  this.addNewPaymentModal = function(){
  	var addNewPaymentModal = new AddNewPaymentModal("reservation");
    addNewPaymentModal.initialize();
  };
  this.setPaymentToReservation = function(){
  	var reservation_id = getReservationId();
  	var credit_card_id = $("#staycard_creditcard").val();
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
  	$("#selected-reservation-payment-div").html(html);
  	
  	$.ajax({
		type : "POST",
		url : '/staff/reservation/link_payment',
		data : {"reservation_id": reservation_id, "user_payment_type_id": credit_card_id },
		async : false,
		dataType : 'json',
		success : function() {	
			
		},
		error : function() {
		}
	});
  
  };
};


	