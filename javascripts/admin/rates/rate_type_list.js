var RateTypeListView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	var that = this;

	this.updateApi = function(event){
		var url = '#';
		if(typeof url === 'undefined' || $.trim(url) === '#'){
			return false;
		}
	    var webservice = new WebServiceInterface();
	    var data = {};
	    data.name = $.trim(that.myDom.find("#rate-type-name").val());
	    data.id = that.myDom.find("#edit-rate-type-details").attr("rate-type-id");
		var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfUpdateApi,
			   successCallBackParameters: {'event': event},		   
			   loader: 'BLOCKER'
	    };
	    webservice.postJSON(url, options);
	};
	
	// success function of on off api ajax call
	this.fetchCompletedOfUpdateApi = function(data, requestParams){
		var event = requestParams['event'];
		that.cancelFromAppendedDataInline(event);
	};
	
	this.delegateSubviewEvents = function(){
		that.myDom.on("click", that.onOffClick);
	};
	
	// function for on off click off 
	this.onOffClick = function(event){
		var element = $(event.target);
		if(element.is(':checkbox') && element.parent().hasClass('switch-button')) {
			// following attributes of element will decide to allow turn on/off operation
			var can_off = element.attr("can-off");
			var is_system_defined = element.attr("is_system_defined");
			
			if(typeof can_off !== 'undefined' || typeof is_system_defined !== 'undefined'){
				if(can_off === "false" || is_system_defined === "true"){
					sntapp.notification.showErrorMessage('Rate Type cannot be deleted as it is already in use or it is system defined');
					event.preventDefault();
					return false;
				}
				else{

					var url = '#';
					// if(typeof url === 'undefined' || $.trim(url) === '#'){
						// return false;
					// }
				    var webservice = new WebServiceInterface();
				    var data = {};
				    data.id = element.parents('tr:eq(0)').attr('data-rate-type-id');
				   
				    if(element.is(":checked")){
				    	data.status = "activate";
				    } else {
				    	data.status = "inactivate";
				    }
					var options = {
						   requestParameters: data,
						   successCallBack: that.fetchCompletedOfOnOffApi,
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
	
	// success function of on off api ajax call
	this.fetchCompletedOfOnOffApi = function(data){
		
	};

	
	this.saveNewApi = function(){
		var url = '#';
		if(typeof url === 'undefined' || $.trim(url) === '#'){
			return false;
		}
	    var webservice = new WebServiceInterface();
	    var data = {};
	    data.name = $.trim(that.myDom.find("#rate-type-name").val());
		var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfSaveNewApi,
			   loader: 'BLOCKER'
	    };
	    webservice.postJSON(url, options);
	};
	// success function of on off api ajax call
	this.fetchCompletedOfSaveNewApi = function(data){
		
	};

};