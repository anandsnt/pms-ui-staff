var RateTypeListView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	var that = this;
    // function to update
	this.updateApi = function(event){
		var data = {};
	    data.name = $.trim(that.myDom.find("#rate-type-name").val());
	    data.id = that.myDom.find("#edit-rate-type-details").attr("rate-type-id");
		var url = ' /admin/hotel_rate_types/'+data.id;
		if(typeof url === 'undefined' || $.trim(url) === '#'){
			return false;
		}
	    var webservice = new WebServiceInterface();
	    
		var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters: {'event': event},		   
			   loader: 'BLOCKER'
	    };
	    webservice.putJSON(url, options);
	};
	
	// success function of on off api ajax call
	this.fetchCompletedOfSave = function(data, requestParams){
		var event = requestParams['event'];
		that.cancelFromAppendedDataInline(event);
		var url = "/admin/hotel_rate_types";
	   	viewParams = {};
	  	if(data.status == "success"){
	  		  sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
			  sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
			  that.cancelFromAppendedDataInline(requestParams['event']);  
	    }
	};
	
	// function for on off click off 
	this.toggleButtonClicked = function(element){
		if(element.is(':checkbox') && element.parent().hasClass('switch-button')) {
			// following attributes of element will decide to allow turn on/off operation
			var can_off = element.attr("can-off");
			var is_system_defined = element.attr("is_system_defined");
			if(typeof can_off !== 'undefined' || typeof is_system_defined !== 'undefined'){
				if(can_off === "false"){
					sntapp.notification.showErrorMessage('Rate Type cannot be deleted as it is already in use');
					event.preventDefault();
					return false;
				}

				else if(is_system_defined === "true"){
					sntapp.notification.showErrorMessage('Rate Type cannot be deleted as it is system defined');
					event.preventDefault();
					return false;
				}
				
				else{

					var url = '/admin/hotel_rate_types/save';
					if(typeof url === 'undefined' || $.trim(url) === '#'){
						return false;
					}
				    var webservice = new WebServiceInterface();
				    var data = {};
				    data.value = element.parents('tr:eq(0)').attr('data-rate-type-id');
				   
				    if(element.is(":checked")){
				    	data.status = "activate";
				    } else {
				    	data.status = "deactivate";
				    }
					var options = {
						   requestParameters: data,						   
						   loader: 'BLOCKER'
				    };
				    webservice.postJSON(url, options);
				}
			}
			else if(typeof can_off === 'undefined' && typeof is_system_defined === 'undefined'){

				sntapp.notification.showErrorMessage('Something went wrong, please reload the page and try again');
				event.preventDefault();				
				return false;
			}
		}
		
	};
	// to save the new rate types
	this.saveNewApi = function(event){
		var url = '/admin/hotel_rate_types';
		if(typeof url === 'undefined' || $.trim(url) === '#'){
			return false;
		}
	    var webservice = new WebServiceInterface();
	    var data = {};
	    data.name = $.trim(that.myDom.find("#rate-type-name").val());
		var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters: {'event': event},		   
			   loader: 'BLOCKER'
	    };
	    webservice.postJSON(url, options);
	};
};