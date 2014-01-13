var HotelChargeGroupsView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  //function to add new department
  this.saveNewApi = function(event){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#charge-group-name").val(); 	
  	var url = 'urltosave';
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
  	
  	var url = "/admin/departments";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
    sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
    that.cancelFromAppendedDataInline(requestParams['event']);  
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
  this.updateApi = function(event){
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val();
  	postData.value = that.myDom.find("#edit-department-details").attr("department_id");
  
  	var url = '/admin/departments/'+postData.value;
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
  	if(selectedId == "delete")
  	{
  		selectedId = that.myDom.find("#edit-department-details").attr("department_id");
  	}
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