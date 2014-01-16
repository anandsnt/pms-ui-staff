var HotelExternalMappingsView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef;  
  var that = this;
  this.externalMappings = [];
  
  // to handle subview events
  this.delegateSubviewEvents = function(){ 
  	that.myDom.find($('#external_mapping_table')).tablesorter();	
  	that.myDom.find('#go_back').on('click', that.goBack); 
  	that.myDom.on('change', that.filterExternalMappings); 
  	// to get all external mappings to do internal filtering
  	that.getAllExternalMappings();
  };
  //to get all external mappings data
  this.getAllExternalMappings =  function(){
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
 		console.log(selectedMappingType);
 		if(selectedMappingType != "VIP_EXCLUSION"){
 			that.myDom.find(".sntvalue").show();
 			that.myDom.find("#hideDiv").show();
 			mappingTypeValues = '';
			that.myDom.find("#snt-value").find('option').remove().end();
			$.each(that.externalMappings, function(key, value) {
				
			    if(value.name == selectedMappingType){
			    	mappingTypeValues = '<option value="" data-image="">Select value</option>';
			    	$("#snt-value").append(mappingTypeValues);
			    	$.each(value.sntvalues, function(mappingkey, mappingvalue) {
			    		mappingTypeValues = '<option value="'+mappingvalue.value+'">'+mappingvalue.name+'</option>';
			    		$("#snt-value").append(mappingTypeValues);
			    	});
			    }		    
			});
 		} else {
 			
 			that.myDom.find("#hideDiv").hide();
 			that.myDom.find(".sntvalue").hide();
 		}
		
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
  
  	var url = '/admin/external_mappings/save_mapping/';
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
  	
  	currentHotel = that.myDom.find("#selected_hotel").attr("data-hotel-id"); 	
  	var url = "/admin/external_mappings/"+currentHotel+"/list_mappings";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
    sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
	 
  };
};