var UserDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;
  this.fileContent ="";
  var that = this;
  
  this.pageinit = function(){
   
  };
  this.delegateEvents = function(){  	
  	that.myDom.find($('#save_new_user')).on('click', that.saveNewUser);
  	that.myDom.find($('#go_back, #cancel')).on('click', that.gotoPreviousPage);
  	that.myDom.find('#save').on('click', that.updateUser);
  	that.myDom.find('#user-picture').on('change', function(){
  		that.readURL(this);
  	});
  };  
  //go to previous page withount any update in view
  this.gotoPreviousPage = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
   //go to previous page with update in view - after adding new user or update user
   this.gotoPreviousPageWithUpdate = function() {
   	var url = "/admin/users";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams, false);
    sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  //update user
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
  	// to handle image uploaded or not
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.user_photo = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.user_photo = "";
  	//To get assigned roles
  	postData.user_roles = [];
  	that.myDom.find("#assigned-roles li").each(function(n) {
        postData.user_roles.push($(this).attr("id"));
    });
  	var url = '/admin/users/'+postData.user_id;
	var webservice = new WebServiceInterface();		
	//failureCallBack: that.fetchFailedOfSave
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave,
			   loader:"BLOCKER"
			   
	};
	webservice.putJSON(url, options);	
  };
  //to save new user
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
  	// to handle image uploaded or not
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.user_photo = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.user_photo = "";
    //To get assigned roles
  	postData.user_roles = [];
  	that.myDom.find("#assigned-roles li").each(function(n) {
            postData.user_roles.push($(this).attr("id"));
      });
      
  	var url = '/admin/users';
	var webservice = new WebServiceInterface();
	
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave,
			   loader:"BLOCKER"
	};
	webservice.postJSON(url, options);	
  }; 
  //to do the actions after completeing server call
  this.fetchCompletedOfSave = function(data){
  	that.gotoPreviousPageWithUpdate();
    sntapp.notification.showSuccessMessage("Saved Successfully", that.viewParams.backDom);
		  
  };
  //to do the actions on fail
  this.fetchFailedOfSave = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom); 
  };
  //to show preview of the image using file reader
  this.readURL = function(input) {
  	   $('#file-preview').attr('changed', "changed");
       if (input.files && input.files[0]) {
           var reader = new FileReader();
           reader.onload = function(e) {
           	   $('#file-preview').attr('src', e.target.result);
               that.fileContent = e.target.result;
           };
           reader.readAsDataURL(input.files[0]);
       }
  };
};