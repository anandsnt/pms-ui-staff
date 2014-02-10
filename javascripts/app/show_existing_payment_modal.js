var ShowExistingPaymentModal = function(backView){
  	BaseModal.call(this);
  	var that = this;
  	var reservation_id = getReservationId();
  	this.url = "/staff/staycards/get_credit_cards?reservation_id="+reservation_id;
  	
  	this.delegateEvents = function(){
  		that.myDom.find(".existing_payments").on("click", that.saveSelectedPaymentToReservation);
	};
   /**
	*   Click handler to update the clicked card to the selected reservation
	*   @param {Object} event click event
	*/
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
				user_payment_type_id: selectedElement,
				bill_number : that.params["bill_number"]			   
	    };
	    console.log(data);
	    var url = '/staff/reservation/link_payment'; 
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
   /**
    *   Callback on successful update
    *   @param {Object} web service response
    *   @param {Object} call back params
    */
	this.fetchCompletedOfUpdate = function(data, params){
		
		var replaceHtml = "<figure class='card-logo'>"+
							"<img src='/assets/"+params['image']+"' alt=''></figure>"+									
							"<span class='number'>Ending with<span class='value number'>"+params['number']+							
							"</span></span><span class='date'> Date <span class='value date'>"+
							params['expiry']+
							"</span>";
	    backView.find("#select-card-from-list").html(replaceHtml);
	    backView.find("#add-new-payment").remove();
		//to remove add button and show delete icon on succesfull addition of new credit card
		backView.find('#delete_card').remove();
		var appendHtml = '<a id="delete_card" data-payment-id="'+data.data.id+'" class="button with-icon red">'+
							'<span class="icons icon-trash invert"></span>Remove</a>';
							
        if(that.params["origin"] == views.BILLCARD){
        	backView.find(".item-payment").append(appendHtml);
        }
        else{
			backView.find(".payment_actions").append(appendHtml);
		}
		that.hide();
	};
   /**
    *   Callback on update failed
    *   @param {Object} call back params
    */
	this.fetchFailedOfUpdate = function(errorMessage){
		
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
	};

	
};
