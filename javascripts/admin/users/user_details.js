var UserDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.pageinit = function(){
   
  };
  this.delegateEvents = function(){  	
  	that.myDom.find($('#save_new_user')).on('click', that.saveNewUser);
  	that.myDom.find('#save').on('click', that.updateUser);
  	that.myDom.find('#user-picture').on('change', function(){
  		that.readURL(this);
  	});
  };  
  this.goBackToPreviousView = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  this.updateUser = function(){
  	var postData = {};
  	postData.user_id = that.myDom.find("#edit-user").attr('user');
  	postData.first_name = that.myDom.find("#first-name").val();
  	postData.last_name = that.myDom.find("#last-name").val();
  	postData.user_department = that.myDom.find("#department").val();
  	postData.job_title = that.myDom.find("#job-title").val();
  	postData.phone = that.myDom.find("#phone").val();
  	postData.email = that.myDom.find("#email").val();
  	postData.confirm_email = that.myDom.find("#confirm-email").val();
  	postData.password = that.myDom.find("#password").val();
  	postData.confirm_password = that.myDom.find("#confirm-password").val();
  	postData.user_photo = that.myDom.find("#file-preview").attr("src");
  	postData.user_roles = [];
  	that.myDom.find("#assigned-roles li").each(function(n) {
        postData.user_roles.push($(this).attr("id"));
    });
      console.log(postData.user_roles);
  	// console.log(JSON.stringify(postData));
  	var url = '/admin/users/updateuser';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave
	};
	webservice.postJSON(url, options);	
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
  	postData.user_photo = that.myDom.find("#file-preview").attr("src");
  	// console.log(JSON.stringify(postData));
  	postData.user_roles = [];
  	that.myDom.find("#assigned-roles li").each(function(n) {
            postData.user_roles.push($(this).attr("id"));
      });
      
  	var url = '/admin/users/savenewuser';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave
	};
	webservice.postJSON(url, options);	
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
  this.readURL = function(input) {
       if (input.files && input.files[0]) {
           var reader = new FileReader();
           reader.onload = function(e) {
               $('#file-preview').attr('src', e.target.result);
           };
           reader.readAsDataURL(input.files[0]);
       }
  };
};