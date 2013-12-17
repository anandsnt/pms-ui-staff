var WebServiceInterface = function(){
	
	this.timeout = 80000; //80 seconds
	this.defaultLoader = "NORMAL";
	var that = this;	
	
	this.getJSON = function(requestUrl, options ){
		var options = options ? options : {};
		
		var requestType = "GET";
		var contentType='application/json';
		var dataType = 'json'; 
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : null;
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var async = options["async"] ? options["async"] : true;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBackParameters = options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, 
				failureCallBack, successCallBackParameters, failureCallBackParameters, 
				async, requestType, contentType, dataType);
	};
	
	this.postJSON = function(requestUrl, options ){
		var options = options ? options : {};		
		var requestType = "POST";
		var contentType = 'application/json';
		var dataType = 'json';
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var async = options["async"] ? options["async"] : true;
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBackParameters = options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, 
				failureCallBack, successCallBackParameters, failureCallBackParameters, 
				async, requestType, contentType, dataType);
	};
	
	this.putJSON = function(requestUrl, options ){
		var options = options ? options : {};		
		var requestType = "PUT";
		var contentType = 'application/json';
		var dataType = 'json';
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var async = options["async"] ? options["async"] : true;
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBackParameters = options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, 
				failureCallBack, successCallBackParameters, failureCallBackParameters, 
				async, requestType, contentType, dataType);			
	};

	this.deleteJSON = function(requestUrl, options ){
		var options = options ? options : {};
		var requestType = "DELETE";
		var contentType = 'application/json';
		var dataType = 'json';
		//Ask Sajith: will request parameters is there?
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var async = options["async"] ? options["async"] : true;
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBackParameters = options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, 
				failureCallBack, successCallBackParameters, failureCallBackParameters, 
				async, requestType, contentType, dataType);			
	};
	this.getHTML = function(requestUrl, options){
		var options = options ? options : {};
		var requestType = "GET";
		var contentType = 'text/html';
		var dataType = 'json';
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var async = options["async"] ? options["async"] : true;
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBackParameters = options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;
		 
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, 
				failureCallBack, successCallBackParameters, failureCallBackParameters, 
				async, requestType, contentType, dataType);	
	};
	
	this.createErrorMessage = function(jqXHR, exception){
		var errorMessage = '';
		if (exception === 'parsererror') {
			errorMessage = 'Requested JSON parse failed.';
              } 
		else if (exception === 'timeout') {
			errorMessage = 'Time out error.';
			} 
		else if (exception === 'abort') {
			errorMessage = 'Ajax request aborted.';
			}
		else if (jqXHR.status === '0') {
			errorMessage = 'Not connect.\n Verify Network.';
		}else if (jqXHR.status == 404) {
			errorMessage = 'Requested page not found. [404]';
		}else if (jqXHR.status == 500) {
			errorMessage = 'Internal Server Error [500].';
		}else {
			errorMessage = 'Uncaught Error.\n' + jqXHR.responseText;
		}	
		return errorMessage;
	};
	
	this.performRequest = function(requestUrl, requestParameters, loader, 
			successCallBack, failureCallBack, successCallBackParameters, failureCallBackParameters, 
			async, requestType, contentType, dataType){	
					
       if(typeof requestParameters === 'undefined'){
               requestParameters = {};
       } 
       if(typeof loader === 'undefined'){
               loader = 'BLOCKER';
       }  
       if(typeof successCallBack === 'undefined'){
               successCallBack = null;
       }       
       if(typeof failCallBack === 'undefined'){
               failCallBack = null;
       } 
       if(typeof async === 'undefined'){
               async = true;
       }       
       if(typeof requestType === 'undefined'){
               requestType = 'GET';
       }  
       if(typeof contentType === 'undefined'){
               contentType = 'application/json';
       }       
       if(typeof dataType === 'undefined'){
               dataType = 'json';
       }  
       
		if(requestType == 'GET') {
			if(requestParameters && typeof(requestParameters) !== 'object') {	
				if(requestUrl.indexOf("?") == -1)
					requestUrl = requestUrl + "?" + requestParameters; //Expand
				else
					requestUrl = requestUrl + requestParameters;
			}
			else{

				var parameters = "";
				if(requestParameters && typeof(requestParameters) === 'object'){					
					for (var key in requestParameters) {
						  if (requestParameters.hasOwnProperty(key)) {
							  parameters += key + "=" + requestParameters[key] + "&";							    
						  }
					}
					//removing  the last character '&'
					if(parameters.indexOf("&") != -1){
						parameters = parameters.substring(0, parameters.length - 1);
					}

				}
				if(parameters.trim() != ""){
					if(requestUrl.indexOf("?") == -1){					
							requestUrl = requestUrl + "?" + parameters;
					}
					else{
							requestUrl = requestUrl + parameters;
					}
				}
			}
			requestParameters = "";
		}
		$.ajax({
			beforeSend: function(){
				sntapp.notification.hideMessage();
				sntapp.activityIndicator.showActivityIndicator(loader);
			},
			
			url: requestUrl,
			data: requestParameters,
			type: requestType,
			dataType: dataType,
			async: async,
			timeout: that.timeout,
			
			success: function(data){
				sntapp.activityIndicator.hideActivityIndicator();
				if(data.status == 'success'){
					//TODO: show success notification
					if(successCallBack) {
						if(successCallBackParameters){
							successCallBack(data, successCallBackParameters);
						}
						else{
							successCallBack(data);
						}					}
				}
				else{
					sntapp.notification.showErrorMessage(data.errors);
					if(failureCallBack) {	
						if(failureCallBackParameters){
							failureCallBack(data.errors, failureCallBackParameters);
						}
						else{
							failureCallBack(data.errors);
						}
					}					
				}
			},
			error: function(jqXHR, exception){
				sntapp.activityIndicator.hideActivityIndicator();				
				//Show error notification
				sntapp.notification.showErrorMessage(that.createErrorMessage(jqXHR, exception));
				if(failureCallBack) {	
					failureCallBack(that.createErrorMessage(jqXHR, exception));
				}
			}
			
		});
	};


};