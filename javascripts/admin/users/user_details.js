var UserDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;
  this.fileContent ="";
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
  this.gotoPreviousPage = function() {
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
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.user_photo = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.user_photo = "";
  	postData.user_roles = [];
  	that.myDom.find("#assigned-roles li").each(function(n) {
        postData.user_roles.push($(this).attr("id"));
    });
     
  	// console.log(JSON.stringify(postData));
  	var url = '/admin/users/'+postData.user_id;
	var webservice = new WebServiceInterface();		
	//failureCallBack: that.fetchFailedOfSave
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   
	};
	webservice.putJSON(url, options);	
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
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.user_photo = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.user_photo = "";
  	// console.log(JSON.stringify(postData));
  	postData.user_roles = [];
  	that.myDom.find("#assigned-roles li").each(function(n) {
            postData.user_roles.push($(this).attr("id"));
      });
      
  	var url = '/admin/users';
	var webservice = new WebServiceInterface();
	//failureCallBack: that.fetchFailedOfSave		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   
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
	sntapp.notification.showErrorList("Some error occured: " + errorMessage, that.myDom);  
  };
  this.readURL = function(input) {
  	   $('#file-preview').attr('changed', "changed");
       if (input.files && input.files[0]) {
           var reader = new FileReader();
           reader.onload = function(e) {
               that.fileContent = e.target.result;
           };
           reader.readAsDataURL(input.files[0]);
       }
  };
};