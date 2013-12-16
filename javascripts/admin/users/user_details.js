var UserDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.pageinit = function(){
   
  };
  this.delegateEvents = function(){  	
  	that.myDom.find($('#save')).on('click', that.saveNewUser);
  };
  this.goBackToPreviousView = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  this.saveNewUser = function(){
  	var postData = {};
  	postData.first_name = that.myDom.find("#first-name").val();
  	postData.last_name = that.myDom.find("#last-name").val();
  	postData.user_department = that.myDom.find("#department").val();
  	postData.job_title = that.myDom.find("#job-title").val();
  	postData.phone = that.myDom.find("#phone").val();
  	postData.email = that.myDom.find("#email").val();
  	postData.confirm_email = that.myDom.find("#confirm-email").val();
  	postData.password = that.myDom.find("#password").val();
  	postData.confirm_password = that.myDom.find("#confirm-password").val();
  	postData.user_photo = that.myDom.find("#file-preview").attr("value");
  	console.log(JSON.stringify(postData));
  	var url = '/admin/users/savenewuser';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave
	};
	webservice.putJSON(url, options);	
  }; 
  this.fetchCompletedOfSave = function(data){
	  if(data.status == "success"){
		  sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		  that.gotoPreviousPage();
	  }	 
	  else{
		  sntapp.activityIndicator.hideActivityIndicator();
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }	  
  };
  
  this.fetchFailedOfSave = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom);  
  };
  
};