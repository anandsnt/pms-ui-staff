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
			//$('#credit_cards_types').hide();
		};
	};

  	//Event handler for on-off toggle button.
	this.toggleButtonClicked = function(element){

		// check if we are process payment methods or credit card types
		// choose the id, url & callback accordingly
		var isPaymentType = element.closest('tr').attr('data-payment-id');
		var isCreditCardType = element.closest('tr').attr('data-credit-card-id');
		var id = isCreditCardType ? isCreditCardType : isPaymentType;
		var type = isCreditCardType ? "creditcard" : "payment";

	    //timeout added as a workaround - hasClass 'on' takes time to be applied
	    setTimeout(function(){
		  	var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
		    var postParams = {"id" : id, "set_active" : toggleStatus};
		    if(id == "1" && type == "payment"){
				if(that.myDom.find("#available-cards").hasClass("hidden")){
					that.myDom.find("#available-cards").removeClass("hidden");
				} else {
					that.myDom.find("#available-cards").addClass("hidden");
				}
			}

		    var webservice = new WebServiceInterface(); 
		    var options = {
		       requestParameters: postParams,
		       successCallBack : that.fetchCompletedOfAction,
		       loader: "NONE"
		    };

			var url = isCreditCardType ? '/admin/hotel_payment_types/activate_credit_card' : '/admin/hotel_payment_types';
			webservice.postJSON(url, options);
		  	return true;
	    }, 100);
	  
	};
	
	// success function of re-invite api call
	this.fetchCompletedOfAction = function(data, requestParameters) {
		sntapp.notification.showSuccessMessage("Saved succesfully.", that.myDom);
		return false;
	};

  
};