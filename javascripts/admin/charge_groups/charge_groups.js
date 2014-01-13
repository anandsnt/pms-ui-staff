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
  	
  	var url = "/admin/charge_groups";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
    sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
    that.cancelFromAppendedDataInline(requestParams['event']);  
  };
  
  //function to update charge group
  this.updateApi = function(event){
  	var postData = {};
  	postData.name = that.myDom.find("#charge-group-name").val();
  	postData.value = that.myDom.find("#edit-charge-group").attr("charge_group_id");
  
  	var url = 'urltomodify'+postData.value;
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
  	var url = 'deleteurl/'+selectedId;
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
  	  var url = "listgrpsurl";
   	  viewParams = {};
  	  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
	  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
	  that.myDom.find($("#charge-group-row-"+successParams['selectedId'])).html("");
	  
  };
};