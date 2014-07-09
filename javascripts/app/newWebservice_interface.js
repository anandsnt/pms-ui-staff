var NewWebServiceInterface = function(){
	
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
		var contentType = 'application/json;charset=utf-8';
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
		var dataType = 'html';
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
	
	this.postHTML = function(requestUrl, options ){
		var options = options ? options : {};		
		var requestType = "POST";
		var contentType = 'text/html';
		var dataType = 'html';
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

	this.createErrorMessage = function(jqXHR, textStatus, errorThrown){
		var errorMessage = '';
		if (jqXHR.status === '0') {
			errorMessage = 'Not connect.\n Verify Network.';
		}else if (jqXHR.status == 404) {
			errorMessage = 'Requested page not found. [404]';
		}else if (jqXHR.status == 500) {
			errorMessage = 'Internal Server Error [500].';			
		}		
		else if(jqXHR.responseJSON != ""){
			errorMessage = jqXHR.responseJSON;
		}
		else if(jqXHR.responseText != ""){
			errorMessage = jqXHR.responseText;
		}		
		else if (textStatus === 'parsererror') {
			errorMessage = 'Requested JSON parse failed.';
        } 
		else if (textStatus === 'timeout') {
			errorMessage = 'Time out error.';
		} 
		else if (textStatus === 'abort') {
			errorMessage = 'Ajax request aborted.';
		}
		else {
			errorMessage = 'Error happened [' + jqXHR.status + '] ' + errorThrown;
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
       if(typeof failureCallBack === 'undefined'){
               failureCallBack = null;
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
						parameters = "&" + parameters;
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
			contentType: contentType,
			
			success: function(data){
				sntapp.activityIndicator.hideActivityIndicator();
				if(dataType.toLowerCase() === 'json'){
					//TODO: show success notification
					if(successCallBack) {
						if(successCallBackParameters){
							successCallBack(data, successCallBackParameters);
						}
						else{
							successCallBack(data);
						}
					}
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
                var urlEndsWith = requestUrl.split('/')[requestUrl.split('/').length - 1];
                
                if (jqXHR.status=="520" && urlEndsWith != "test_pms_connection") {
					sntapp.activityIndicator.hideActivityIndicator();
                	sntapp.showOWSErrorPopup();
                	return;
                }

                if (jqXHR.status=="401") { sntapp.logout(); return;}
                if (jqXHR.status=="501" || jqXHR.status=="502" || jqXHR.status=="503") {

                    location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
                    return;
                }

                if(jqXHR.status=="404"){
                    location.href = XHR_STATUS.SERVER_DOWN;
                    return;
                }

				sntapp.activityIndicator.hideActivityIndicator();

				if(failureCallBack) {
					var errorMessage = that.createErrorMessage(jqXHR, textStatus, errorThrown);
					if(failureCallBackParameters){
						failureCallBack(errorMessage, failureCallBackParameters);
					}
					else{
						failureCallBack(errorMessage);
					}
				}
				else{
					//Show error notification
					sntapp.notification.showErrorMessage(that.createErrorMessage(jqXHR, textStatus, errorThrown));
				}
			}
			
		});
	};


};