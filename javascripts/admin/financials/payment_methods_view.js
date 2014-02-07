var PaymentMethodsView = function(domRef){
	BaseInlineView.call(this);  
	this.myDom = domRef; 
	var that = this;

	this.pageshow =function() {

		// check if credit card is turned on or no
		// if its not, hide the credit card types
		var creditCard = that.myDom.find('tr[data-payment-id="1"]');
		var isOn = creditCard.find('.switch-button').hasClass('on');

		if (!isOn) {
			$('#credit_cards_types').hide();
		};
	};

  	//Event handler for on-off toggle button.
	this.toggleButtonClicked = function(element){

		// check if we are process payment methods or credit card types
		// choose the id, url & callback accordingly
		var isPayment = element.closest('tr').attr('data-payment-id');
		var id = isPayment ? isPayment : element.closest('tr').attr('data-credit-card-id');

	    //timeout added as a workaround - hasClass 'on' takes time to be applied
	    setTimeout(function(){
		  	var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
		    var postParams = {"id" : id, "set_active" : toggleStatus};

		    var creditCardToggleSucess = function() {
		    	if ('true' === toggleStatus) {
		    		$('#credit_cards_types').fadeIn('fast');
		    	} else {
		    		$('#credit_cards_types').fadeOut('fast');
		    	}
		    };

		    var webservice = new WebServiceInterface(); 
		    var options = {
		       requestParameters: postParams,
		       loader: "NONE",
		       successCallBack: creditCardToggleSucess
		    };

			var url = isPayment ? '/admin/hotel_payment_types' : '/admin/hotel_payment_types/activate_credit_card'; 
			webservice.postJSON(url, options);
		  	return true;
	    }, 100);
	  
	};

  
};