var HotelDepartmentsView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  //function to add new department
  this.saveNewApi = function(event){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val(); 	
  	var url = '/admin/departments';
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
  	sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams, false);
    sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
    that.cancelFromAppendedDataInline(requestParams['event']);  
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
			   successCallBackParameters: {"selectedId": selectedId}
	};
	webservice.deleteJSON(url, options);
  };
   //to remove deleted row and show message
  this.fetchCompletedOfDelete = function(data, successParams){
	  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
	  that.myDom.find("#department_row_"+successParams['selectedId']).html("");
	  //to clear the html for edit data.
	  that.myDom.find(".edit-data").html("");
	  
  };
};