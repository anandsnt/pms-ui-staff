var SetPaymentAsPrimaryModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.credit_id = "";
  	this.url = "staff/payments/showCreditModal";
  	this.$paymentTypes = [];
  	
  	this.delegateEvents = function(){
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
        
   };
   
   this.fetchCompletedOfSetCreditAsPrimary = function(data, requestParameters){
	   var html = "<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>";
		$("#primary_credit.primary").remove();
		$("#payment_tab #credit_row" + requestParameters['credit_card_id']).append(html);	   
   };
    this.setCreditAsPrimary = function(){
  	
  		var $credit_card_id = that.credit_id;
  		
		$user_id = $("#user_id").val();
		$("#primary_credit.primary").remove();
		$("#credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
		that.hide();	
		
	    var url = 'staff/payments/setCreditAsPrimary';
	  	var webservice = new WebServiceInterface();
	  	var successCallBackParams = {
	  			'credit_card_id': $credit_card_id,
	  	};
	  	var data = {id: $credit_card_id, user_id: $user_id};
	    var options = { 
	    				requestParameters: data,
	    				successCallBack: that.fetchCompletedOfSetCreditAsPrimary,
	    				successCallBackParameters: successCallBackParams,
	    				loader: 'blocker'
	    		};
	    webservice.postJSON(url, options);	
    };
    this.fetchCompletedOfDeleteCreditCard = function(data){
    	var $credit_card_id = that.credit_id;
		$("#credit_row" + $credit_card_id).remove();
    };
    this.deleteCreditCard = function(){
  		var $credit_card_id = that.credit_id;		
		that.hide();
	    var url = 'staff/payments/deleteCreditCard';
	  	var webservice = new WebServiceInterface();
	  	var data = {id: $credit_card_id};
	    var options = { 
	    				requestParameters: data,
	    				successCallBack: that.fetchCompletedOfDeleteCreditCard,
	    				loader: 'blocker'
	    		};
	    webservice.postJSON(url, options);	
    };
};