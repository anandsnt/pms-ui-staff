var WebServiceInterface = function(){
	
	this.timeout = 80000; //80 seconds
	this.defaultLoader = "NORMAL";
	var that = this;	
	
	this.getJSON = function(requestUrl, options ){
		var options = options ? options : {};
		var async = true;
		var requestType = "GET";
		var contentType='application/json';
		var dataType='json'
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;
	
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, failureCallBack, 
			async, requestType, contentType, dataType)
	};
	
	this.postJSON = function(requestUrl, options ){
		var options = options ? options : {};
		var async = true;
		var requestType = "POST";
		var contentType = 'application/json';
		var dataType = 'json'
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, failureCallBack, 
				async, requestType, contentType, dataType)		
	};
	
	this.putJSON = function(requestUrl, options ){
		var options = options ? options : {};
		var async = true;
		var requestType = "PUT";
		var contentType = 'application/json';
		var dataType = 'json'
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, failureCallBack, 
				async, requestType, contentType, dataType)			
	};
	
	this.getHTML = function(requestUrl, options){
		var options = options ? options : {};
		var async = true;
		var requestType = "GET";
		var contentType = 'text/html';
		var dataType = 'json'
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;	
		
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, failureCallBack, 
				async, requestType, contentType, dataType)			
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
	
	this.performRequest = function(requestUrl, requestParameters={}, loader='BLOCKER', 
			successCallBack=null, failCallBack=null, async=true, requestType='GET', 
			contentType='application/json', dataType='json'){		
		
		if(requestType == 'GET' && requestParameters!={}) {
			requestUrl = requestUrl + "?" + requestParameters; //Expand
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
						successCallBack(data);
					}
				}
				else{
					sntapp.notification.showErrorMessage(data.errors);
					if(failCallBack) {	
						failCallBack(data.errors);
					}					
				}
			},
			error: function(jqXHR, exception){
				sntapp.activityIndicator.hideActivityIndicator();				
				//Show error notification
				sntapp.notification.showErrorMessage(that.createErrorMessage(jqXHR, exception));
				if(failCallBack) {	
					failCallBack(that.createErrorMessage(jqXHR, exception));
				}
			}
			
		});
	};


};