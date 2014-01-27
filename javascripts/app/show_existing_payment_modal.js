var ShowExistingPaymentModal = function(backView){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "/ui/show?haml_file=modals/existingPayments&json_input=reservation_payments/existingpayments.json&is_hash_map=true&is_partial=true";
  	
  	this.delegateEvents = function(){
  		that.myDom.find(".existing_payments").on("click", that.saveSelectedPaymentToReservation);
	};
	this.saveSelectedPaymentToReservation = function(event){
		var reservation_id = getReservationId();
		var element = $(event.target);
		var selectedElement = that.myDom.find(this).attr("data-id");
		var image = that.myDom.find(this).attr("data-card-code")+".png";
		var ending_with = that.myDom.find(this).attr("data-ending-with");
		var expiry = that.myDom.find(this).attr("data-expiry");
		
		var webservice = new WebServiceInterface();
	    var data = {
	    		reservation_id : reservation_id,
				value: selectedElement			   
	    };
	    var url = 'urltoupdate'; 
	    var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfUpdate,
			   failureCallBack: that.fetchFailedOfUpdate,
			   successCallBackParameters: {
				   'image': image, 
				   'number': ending_with, 
				   'expiry': expiry
			   },
			   failureCallBackParameters: {
				   'image': image, 
				   'number': ending_with, 
				   'expiry': expiry
			   }
	    };
		webservice.postJSON(url, options);
	};
	this.fetchCompletedOfUpdate = function(data, params){
		
		var replaceHtml = "<figure class='card-logo'>"+
							"<img src='/assets/"+params['image']+"' alt=''></figure>"+									
							"<span class='number'>Ending with<span class='value number'>"+params['number']+							
							"</span></span><span class='date'> Date <span class='value date'>"+
							params['expiry']+
							"</span>";
	   
		that.hide();
	};
	this.fetchFailedOfUpdate = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
	};

	
};
