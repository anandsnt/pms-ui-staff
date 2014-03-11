var ValidateCheckoutModal = function(callBack, callBackParam) {

	BaseModal.call(this);
	var that = this;
	this.url = "staff/staycards/validate_email";
	this.reservation_id = getReservationId();
	this.delegateEvents = function() {
		
		that.myDom.find('#modal-overlay, #modal-close').on('click', that.hide);
		//when clicks on ignore ang go to checkout - do the actions for checkout
		that.myDom.find('#cancel').on('click', that.goToCheckout);
		
		that.myDom.find('#validate #submit').on('click', that.submitAndGotoCheckout);
		
	};
	//when clicks on ignore and go to checkout - do the actions for checkout
	this.goToCheckout = function(){
		//callBack(callBackParam);
		that.hide(callBack);
	};
	this.modalInit = function(callBack, callBackParam) {
	};
	//actions to save email and checkout
	this.submitAndGotoCheckout = function() {
		var userId = $("#user_id").val();
		var guestID = $("#guest_id").val();
		var email = $("#validate #guest-email").val();
		$contactJsonObj = {};
		$contactJsonObj['guest_id'] = $("#guest_id").val();
		$contactJsonObj['email'] = email;
		
		if(email == ""){
			alert("Please enter email");
			return false;
		}
		else if(validateEmail(email)){			
			var webservice = new WebServiceInterface();
		    	
		    var url = 'staff/guest_cards/' + userId; 
		    var options = {
					   requestParameters: $contactJsonObj,
					   successCallBack: that.fetchCompletedOfSave,
					   failureCallBack: that.fetchFailedOfSave,
					   successCallBackParameters:{ "callBack": callBack, 'callBackParam':callBackParam}
					   
			};
		    webservice.putJSON(url, options);
		}
	};
	this.fetchCompletedOfSave = function(data, requestParameters){
    	// Update UI changes in Guest card header and Contact information.
			var guest_email = $("#gc-email").val();
			
			if(guest_email ==""){
				$("#gc-email").val($("#validate #guest-email").val());
				$("#email").val($("#validate #guest-email").val());
			}
		
			that.hide(requestParameters['callBack']);
    };
    this.fetchFailedOfSave = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
    };
};