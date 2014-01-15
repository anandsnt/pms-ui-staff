var HotelExternalMappingsView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef;  
  var that = this;
  this.externalMappings = [];
  
  
  this.delegateSubviewEvents = function(){ 
  	that.myDom.find($('#external_mapping_table')).tablesorter();	
  	that.myDom.find('#go_back').on('click', that.goBack); 
  	that.myDom.on('change', that.filterExternalMappings); 
  	// to get all external mappings to do internal filtering
  	that.getAllExternalMappings();
  };
  this.getAllExternalMappings =  function(){
  	var webservice = new WebServiceInterface();
	
	    var url = "/ui/show.json?haml_file=admin/hotels/add_new_external_mapping&json_input=snt_admin/add_new_external_mappings.json&is_hash_map=true&is_partial=false";
	    var options = {
				   successCallBack: that.fetchCompletedOfGetExternalMappings
		};
	    webservice.getJSON(url, options);
  	
  };
  this.goBack = function(){
  	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  
  
  
  this.getPaymentsList = function(){
		var webservice = new WebServiceInterface();
	
	    var url = 'staff/payments/addNewPayment.json'; 
	    var options = {
				   successCallBack: that.fetchCompletedOfGetPayment,
		};
	    webservice.getJSON(url, options);	   
   };
   this.fetchCompletedOfGetExternalMappings = function(data){
	   that.externalMappings = data.mapping_type;
	   console.log(that.externalMappings);
   };
   
     this.filterExternalMappings = function(e){
  		var selectedMappingType = that.myDom.find("#mapping-type").val();
		mappingTypeValues = '';
		that.myDom.find("#snt-value").find('option').remove().end();
		$.each(that.externalMappings, function(key, value) {
		    if(value.value == selectedMappingType){
		    	mappingTypeValues = '<option value="" data-image="">Select credit card</option>';
		    	$("#snt-value").append(mappingTypeValues);
		    	$.each(value.sntvalues, function(mappingkey, mappingvalue) {
		    		mappingTypeValues = '<option value="'+mappingvalue.value+'">'+mappingvalue.name+'</option>';
		    		$("#snt-value").append(mappingTypeValues);
		    	});
		    }		    
		});
  };
  
  
};