var UpdateAccountSettings = function() {

	BaseModal.call(this);
	var that = this;
	this.url = "admin/user/get_user_name_and_email";
	this.delegateEvents = function() {

		that.myDom.find('#save-changes').on('click', that.saveAccountSettings);
	};

	//success function of saveAccountSettings ajax call
	this.fetchCompletedOfSaveAccountSettings = function(data){
		sntapp.notification.showSuccessMessage("Successfully Updated", that.myDom);
		that.hide();
	};
	
	this.saveAccountSettings = function() {
		var changepwd = that.myDom.find($("#change-password")).val();
		var confirmpwd = that.myDom.find($("#confirm-password")).val();
		
		// if(changepwd == "" || confirmpwd == "") {
			// sntapp.notification.showErrorMessage("Field cannot be empty.", that.myDom);
		// } else if (changepwd != confirmpwd)  {
			// sntapp.notification.showErrorMessage("Password does not match.", that.myDom);
		// } else {

			var data = {"new_password" : changepwd };

		    var options = {
		      loader: 'BLOCKER',
		      successCallBack : that.fetchCompletedOfSaveAccountSettings,
		      failureCallBack: that.fetchFailedOfSave,
		      requestParameters: data
		    };
		    var url = '/admin/user/change_password';
		    var webservice = new WebServiceInterface();
		    webservice.postJSON(url, options);	

		// }
		

	};
	//failure call back
   	this.fetchFailedOfSave = function(errorMessage){
   		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
   	};   
};

