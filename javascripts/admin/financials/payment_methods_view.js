var PaymentMethodsView = function(domRef){
	BaseInlineView.call(this);  
	this.myDom = domRef; 
	var that = this;

  
	this.toggleButtonClicked = function(element){
	    var paymentId = element.closest('tr').attr('data-payment-id');
	    setTimeout(function(){
		  	var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
		    var postParams = {"id" : paymentId, "set_active" : toggleStatus};

		    var webservice = new WebServiceInterface(); 
		    var options = {
		       requestParameters: postParams,
		       loader: "NONE"
		    };

			var url = '/admin/hotel_payment_types';
			webservice.postJSON(url, options);
		  	return true;
	    }, 100);
	  
	};

  
};