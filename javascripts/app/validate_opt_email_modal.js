var ValidateOptEmailModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "ui/validateOptEmail";
  	
  	this.delegateEvents = function(){
		that.myDom.find('#validate-opt-email #save').on('click', that.saveEmail);
	};
   	
    // To update email adress in guest card   	
   	this.saveEmail = function(){
   		var userId = $("#user_id").val();
   		var $contactJsonObj = {};
   		$contactJsonObj['email'] = that.myDom.find("#guest-email").val();
   		var url = 'staff/guest_cards/' + userId;
	    var webservice = new WebServiceInterface();
	    var options = {
			   requestParameters: $contactJsonObj,
			   successCallBack: that.fetchCompletedOfSaveEmail,
			   successCallBackParameters:{ "email": $contactJsonObj['email']},
			   failureCallBack: that.fetchFailedOfSaveEmail,
			   loader: 'BLOCKER',
	    };
	    webservice.putJSON(url, options);
   		
   		
   	};
   	this.fetchCompletedOfSaveEmail = function(data,successParams){
   		$("#gc-email").val(successParams['email']);
   		$("#contact-info #email").val(successParams['email']);
   		sntapp.notification.showSuccessMessage("Successfully Saved", that.myDom); 
   		that.hide();
   	};
   	this.fetchFailedOfSaveEmail = function(errorMessage){
   		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
   	};
};
