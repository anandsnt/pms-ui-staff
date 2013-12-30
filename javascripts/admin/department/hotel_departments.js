var HotelDepartmentsView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  //function to add new department
  this.saveNewApi = function(){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val(); 	
  	var url = '/admin/departments';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   loader:"BLOCKER",
			   shouldShowSuccessMessage: "true"
			   
	};
	webservice.postJSON(url, options);	
  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfSave = function(data){
  	
  	var url = "/admin/departments";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
  	if(data.status == "success"){
		  sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		  
	  }	 
	  else{
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }
  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfDelete = function(data){
  	
  	var url = "/admin/departments";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
  	if(data.status == "success"){
		  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);		  
	  }	 
	  else{
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }
  };
  //function to update department
  this.updateApi = function(){
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val();
  	postData.value = that.myDom.find("#edit-department-details").attr("department_id");
  
  	var url = '/admin/departments/'+postData.value;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   loader:"BLOCKER",
			   shouldShowSuccessMessage: "true"
			   
	};
	webservice.putJSON(url, options);	
  };
  //function to delete department
  this.deleteItem = function(event){
  	event.preventDefault();
  	var postData = {};
  	var selectedId = $(this).attr("id");
  	var url = '/admin/departments/'+selectedId;
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
  	  var url = "/admin/departments";
   	  viewParams = {};
  	  sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
	  if(data.status == "success"){
		  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
		  that.myDom.find($("#user_row_"+successParams['selectedId'])).html("");
	  }	 
	  else{
		  
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }	  
  };
};