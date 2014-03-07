var HotelChargeGroupsView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  //function to add new charge group
  this.saveNewApi = function(event){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#charge-group-name").val(); 	
  	var url = '/admin/charge_groups';
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
  	
  	var url = "/admin/charge_groups/";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
    sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
    that.cancelFromAppendedDataInline(requestParams['event']);  
  };
  
  //function to update charge group
  this.updateApi = function(event){
  	var postData = {};
  	postData.name = that.myDom.find("#charge-group-name").val();
  	postData.value = that.myDom.find("#edit-charge-group").attr("charge_group_id");
  
  	var url = '/admin/charge_groups/'+postData.value;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"
	};
	webservice.putJSON(url, options);	
  };
  //function to delete charge group
  this.deleteItem = function(event){
  	event.preventDefault();
  	var postData = {};
  	var selectedId = $(event.target).attr("id");
  	if(selectedId == "delete")
  	{
  		selectedId = that.myDom.find("#edit-charge-group").attr("charge_group_id");
  	}
  	var url = '/admin/charge_groups/'+selectedId;
  	postData.id = selectedId;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfDelete,
			   failureCallBack: that.fetchFailedOfDelete,
			   loader:"BLOCKER",
			   successCallBackParameters: {"selectedId": selectedId}
	};
	webservice.deleteJSON(url, options);
  };
  // Success response of deletion
  this.fetchCompletedOfDelete = function(data, successParams){
	  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
	  
	  var url = "/admin/charge_groups/";
	  viewParams = {};
	  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
  };
  // Failure response of deletion
  this.fetchFailedOfSave = function(errorMessage){
  	  sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };
};