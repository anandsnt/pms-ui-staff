var SetPaymentAsPrimaryModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.credit_id = "";
  	// this.myDom = "#modal";
  	this.url = "staff/payments/showCreditModal";
  	this.$paymentTypes = [];
  	
  	this.delegateEvents = function(){
  		console.log("sub modal delegate events");
  		// that.getPaymentsList();
  		that.myDom.find('#credit-card-set-as-primary').on('click', that.setCreditAsPrimary);
		that.myDom.find('#credit-card-delete').on('click', that.deleteCreditCard);		
		var creditParam = this.params;
		this.credit_id = creditParam.credit_id;

	};
	
	this.unbindCancelEvent = function(){
		that.myDom.find('#credit-card-set-as-primary').off('click');
		that.myDom.find('#credit-card-delete').off('click');
	}
	
	this.modalInit = function(){
        console.log("modal init in sub modal");
        
   };
   
    this.setCreditAsPrimary = function(){
  	
  		var $credit_card_id = that.credit_id;
  		
		$user_id = $("#user_id").val();
		$("#primary_credit.primary").remove();
		$("#credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
		that.hide();	
		
		$.ajax({
			type: "POST",
			url: 'staff/payments/setCreditAsPrimary',
			data: {id: $credit_card_id, user_id: $user_id},
			dataType: 'json',
			success: function(data) {
				console.log("Succesfully set credit card as primary");
				$("#primary_credit.primary").remove();
				$("#payment_tab #credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
				// $("#payment_tab credit_row"+$credit_card_id)				
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
    };
    this.deleteCreditCard = function(){
  		var $credit_card_id = that.credit_id;
		$("#credit_row" + $credit_card_id).remove();		
		that.hide();
		$.ajax({
			type: "POST",
			url: 'staff/payments/deleteCreditCard',
			data: {id: $credit_card_id},
			dataType: 'json',
			success: function(data) {
				console.log("Succesfully deleted credit card");
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
    };
};
