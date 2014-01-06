var UserRolesView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  //function to add new department
  this.saveNewApi = function(event){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#user_role").val();
  	
  	var url = '/admin/roles';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"
			   
	};
	webservice.postJSON(url, options);	
  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfSave = function(data, requestParams){
  	
  	var url = "/admin/roles";
   	viewParams = {};
  	
  	if(data.status == "success"){
  		  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		  sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
		  that.cancelFromAppendedDataInline(requestParams['event']);  
	  }	 
	  else{
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }
  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfDelete = function(data){
  	
  	var url = "/admin/user_roles";
   	viewParams = {};
  	
  	if(data.status == "success"){
  		  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);		  
	  }	 
	  else{
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }
  };
  //function to update department
  this.updateApi = function(event){
  	var postData = {};
  	postData.name = that.myDom.find("#user_role").val();
  	postData.value = that.myDom.find("#edit-user-role-details").attr("user_role_id");
    
  	var url = '/admin/roles/'+postData.value;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"
			   
	};
	webservice.putJSON(url, options);	
  };
  //function to delete department
  this.deleteItem = function(event){
  	event.preventDefault();
  	var postData = {};
  	var selectedId = $(event.target).attr("id");
  	var url = '/admin/roles/'+selectedId;
  	postData.id = selectedId;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfDelete,
			   loader:"BLOCKER",
			   shouldShowSuccessMessage: "true",
			   successCallBackParameters: {"selectedId": selectedId}
	};
	webservice.deleteJSON(url, options);
  };
   //to remove deleted row and show message
  this.fetchCompletedOfDelete = function(data, successParams){
  	  var url = "/admin/roles";
   	  viewParams = {};
	  if(data.status == "success"){
	  	  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
		  that.myDom.find($("#user_row_"+successParams['selectedId'])).html("");
	  }	 
	  else{
		  
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }	  
  };
};