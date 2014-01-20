var HotelChargeCodesView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  
  // to handle subview events
  this.delegateSubviewEvents = function(){ 
  	var charge_codes_table = that.myDom.find('#charge_codes_table');
	// we need to apply table sorter if the table has more than one row
	if(charge_codes_table.find("tr").length > 1){
		charge_codes_table.tablesorter({ headers: { 3:{sorter:false}, 4:{sorter:false}  } });	// to disable sorting in action table
	}
	// to handle link with div - hide when charge code type is tax
	that.myDom.on("change", that.handleLinkWith);
	that.myDom.find('#import-charge-codes').on("click", that.callImportApi);
	
  	
  };
  // to call import charge codes API
  this.callImportApi = function(event){
  	var postData = {};
  	var url = '/admin/charge_codes/import';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfImport,
			   successCallBackParameters:{ "event": event},
			   failureCallBack: that.fetchFailedOfSave,
			   loader:"BLOCKER"
	};
	webservice.getJSON(url, options);
  };
  //refreshing view with new data and showing message after import
  this.fetchCompletedOfImport = function(data,requestParams){
  	var url = "/admin/charge_codes/list";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
  	sntapp.notification.showSuccessMessage("Imported Successfully", that.myDom);		
  	that.cancelFromAppendedDataInline(requestParams['event']);  
  };
  // to handle link with div - hide when charge code type is tax
  this.handleLinkWith = function(event){
  
  	event.preventDefault();
	var element = $(event.target);
	var selectedElement = element.attr("id");
	// checking for is the selected item is tax
	if($('option:selected', that.myDom.find("#"+selectedElement)).attr('data-type') == "true")
	 {
	 	that.myDom.find("#link-with-set").hide();
	 } else {
	 	that.myDom.find("#link-with-set").show();
	 }
  	
  };
  
  //function to add new charge group
  this.saveNewApi = function(event){ 
  	 	
  	var total_link_with = that.myDom.find("#total_link_with").val(); 	
  	var postData = {};
  	postData.charge_code = that.myDom.find("#charge-code").val(); 	
  	postData.description = that.myDom.find("#description").val(); 	
  	postData.charge_group = that.myDom.find("#charge-group").val(); 	
  	postData.charge_code_type = that.myDom.find("#charge-code-type").val(); 	
  	var link_with = new Array();
  	if($('option:selected', that.myDom.find("#charge-code-type")).attr('data-type') != "true")
  	{
  		for(i=1;i<=total_link_with;i++){
	  		if(that.myDom.find("#link-with-"+i).parent().hasClass("checked")){
	  			var link_with_value = that.myDom.find("#link-with-"+i).val(); 
	  			link_with.push(link_with_value);
	  		}
	  	}
  	}
	  	
  	postData.link_with = link_with; 	
  	// console.log(JSON.stringify(postData));
  	var url = '/admin/charge_codes/save';
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
  	
  	var url = "/admin/charge_codes/list";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
    sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
    that.cancelFromAppendedDataInline(requestParams['event']);  
  };
  
  //function to update charge code
  this.updateApi = function(event){
  	var total_link_with = that.myDom.find("#total_link_with").val(); 	
  	var postData = {};
  	postData.value = that.myDom.find("#edit-charge-code").attr("data-value"); 
  	postData.charge_code = that.myDom.find("#charge-code").val(); 	
  	postData.description = that.myDom.find("#description").val(); 	
  	postData.charge_group = that.myDom.find("#charge-group").val(); 	
  	postData.charge_code_type = that.myDom.find("#charge-code-type").val(); 	
  	var link_with = new Array();
  	if($('option:selected', that.myDom.find("#charge-code-type")).attr('data-type') != "true")
  	{
  		for(i=1;i<=total_link_with;i++){
	  		if(that.myDom.find("#link-with-"+i).parent().hasClass("checked")){
	  			var link_with_value = that.myDom.find("#link-with-"+i).val(); 
	  			link_with.push(link_with_value);
	  		}
	  	}
  	}
	  	
  	postData.link_with = link_with; 	
  	// console.log(JSON.stringify(postData));
  	var url = '/admin/charge_codes/save';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"
	};
	webservice.postJSON(url, options);	
  };
  //function to delete charge codes
  this.deleteItem = function(event){
  	event.preventDefault();
  	var postData = {};
  	var selectedId = $(event.target).attr("id");
  	
  	var url = '/admin/charge_codes/'+selectedId+'/delete';
  	postData.value = selectedId;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfDelete,
			   loader:"BLOCKER",
			   shouldShowSuccessMessage: "true",
			   successCallBackParameters: {"selectedId": selectedId}
	};
	webservice.getJSON(url, options);
  };
   //to remove deleted row and show message
  this.fetchCompletedOfDelete = function(data, successParams){
  	  var url = "/admin/charge_codes/list";
   	  viewParams = {};
  	  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
	  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
  };
};