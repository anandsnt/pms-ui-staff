var HotelExternalMappingsView = function(domRef){
  BaseInlineView.call(this);
  this.myDom = domRef;
  var that = this;
  //this.isAddNewOpen = false;
  this.externalMappings = [];


  // to handle subview events
  this.delegateSubviewEvents = function(){
  	var ext_mapping_table = that.myDom.find('#external_mapping_table');
	// we need to apply table sorter if the table has more than one row
	if(ext_mapping_table.find("tr").length > 1){
		ext_mapping_table.tablesorter();
	}
  	that.myDom.find('#go_back').on('click', that.goBack);
  	that.myDom.on('change', that.filterExternalMappings);
  	that.myDom.find('#add-new-external-mapping').on('click', that.addNewExternalMapping);
    that.myDom.find('.edit-data-inline').on('click', that.editExternalMapping);
  	// to get all external mappings to do internal filtering
  	//that.getAllExternalMappings();
  };
  // function to get the view for add new external mapping
  this.addNewExternalMapping = function(event){
  	that.getAllExternalMappings(event);
  	that.addNewForm(event);
  };
  // function to get the view for edit external mapping
  this.editExternalMapping = function(event){
  	 that.cancelFromAppendedDataInline();
  	that.getAllExternalMappings(event);
  	that.appendInlineData(event);
  };
  //to get all external mappings data
  this.getAllExternalMappings =  function(event){
  	var hotel_id = that.myDom.find("#selected_hotel").attr("data-hotel-id");
  	var webservice = new WebServiceInterface();

    var url = "/admin/external_mappings/"+hotel_id+"/new_mappings.json";
    var options = {
			   successCallBack: that.fetchCompletedOfGetExternalMappings
	};
    webservice.getJSON(url, options);


  };
  // to go to previous page
  this.goBack = function(){
  	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  //to fetch external mapping details to do internal filtering
  this.fetchCompletedOfGetExternalMappings = function(data){
	  that.externalMappings = data.data.mapping_type;
  };
  // to repopultae snt vlues drop down on selecting external mappings
  this.filterExternalMappings = function(e){
 	if(e.target.id == "mapping-type"){

 		var selectedMappingType = that.myDom.find("#mapping-type").val();
		mappingTypeValues = '';
		that.myDom.find("#snt-value").find('option').remove().end();
		$.each(that.externalMappings, function(key, value) {
			if(value.name == selectedMappingType){
				mappingTypeValues = '<option value="" data-image="">Select value</option>';
				$("#snt-value").append(mappingTypeValues);
				$.each(value.sntvalues, function(mappingkey, mappingvalue) {
					mappingTypeValues = '<option value="'+mappingvalue.name+'">'+mappingvalue.name+'</option>';
					$("#snt-value").append(mappingTypeValues);
				});
			}
		});

 	}

  };
  //function to add new external mapping
  this.saveNewApi = function(event){
  	var postData = {};
  	postData.mapping_type = that.myDom.find("#mapping-type").val();
  	postData.snt_value = that.myDom.find("#snt-value").val();
  	postData.external_value = that.myDom.find("#external-value").val();
  	postData.hotel_id = that.myDom.find("#selected_hotel").attr("data-hotel-id");

  	var url = '/admin/external_mappings/save_mapping';
	var webservice = new WebServiceInterface();
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"

	};
	webservice.postJSON(url, options);
  };
  //function to update department
  this.updateApi = function(event){

  	var postData = {};
  	postData.mapping_type = that.myDom.find("#mapping-type").val();
  	postData.snt_value = that.myDom.find("#snt-value").val();
  	postData.external_value = that.myDom.find("#external-value").val();
  	postData.hotel_id = that.myDom.find("#selected_hotel").attr("data-hotel-id");
  	postData.value = that.myDom.find("#edit-external-mapping").attr("data-id");

  	var url = '/admin/external_mappings/save_mapping';
	var webservice = new WebServiceInterface();
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"

	};
	webservice.postJSON(url, options);

  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfSave = function(data, requestParams){
  	currentHotel = that.myDom.find("#selected_hotel").attr("data-hotel-id");
  	var url = "/admin/external_mappings/"+currentHotel+"/list_mappings";
   	viewParams = that.viewParams;
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
  	sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
  };
  //Handling failure
  this.fetchFailedOfSave = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
  };

   //function to delete mapping
  this.deleteItem = function(event){
  	event.preventDefault();
  	var postData = {};
  	var selectedId = that.myDom.find(event.target).attr("id");
  	var url = '/admin/external_mappings/'+selectedId+'/delete_mapping';
  	postData.value = selectedId;
	var webservice = new WebServiceInterface();
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfDelete,
			   loader:"BLOCKER",
			   successCallBackParameters: {"selectedId": selectedId}
	};
	webservice.getJSON(url, options);
  };
   //to remove deleted row and show message
  this.fetchCompletedOfDelete = function(data, successParams){
	  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
	  that.myDom.find("#mapping_row_"+successParams['selectedId']).html("");

  };
};