var WebServiceInterface = function(){
	
	this.timeout = 80000; //80 seconds
	this.defaultLoader = "BLOCKER";
	var that = this;	
	
	this.getJSON = function(requestUrl, options ){
		var options = options ? options : {};
		var async = true;
		var requestType = "GET";
		var contentType='application/json';
		var dataType='json'
		var requestParameters = options["requestParameters"] ? options["requestParameters"] : {};
		var loader = options["loader"] ? options["loader"] : that.defaultLoader;
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : {};
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : {};
	
		
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
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : {};
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : {};	
		
		
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
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : {};
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : {};	
		
		
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
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : {};
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : {};	
		
		
		that.performRequest(requestUrl, requestParameters, loader, successCallBack, failureCallBack, 
				async, requestType, contentType, dataType)			
	};
	
	var createErrorMessage = function(jqXHR, exception){
		console.log('testing');
		if (exception === 'parsererror') {
			sntapp.notification.showErrorMessage('Requested JSON parse failed.');
        } 
		else if (exception === 'timeout') {
            sntapp.notification.showErrorMessage('Time out error.');
        } 
		else if (exception === 'abort') {
            sntapp.notification.showErrorMessage('Ajax request aborted.');
        } 
        else if (jqXHR.status === 0) {
            sntapp.notification.showErrorMessage('Not connect.\n Verify Network.');
        } 
		else if (jqXHR.status == 404) {
            sntapp.notification.showErrorMessage('Requested page not found. [404]');
        } 
		else if (jqXHR.status == 500) {
            sntapp.notification.showErrorMessage('Internal Server Error [500].');
        } 		
		else {
            sntapp.notification.showErrorMessage('Uncaught Error.\n' + jqXHR.responseText);
        }		
	};
	
	this.performRequest = function(requestUrl, requestParameters={}, loader='BLOCKER', successCallBack=null, failCallBack=null, 
			async=true, requestType='GET', contentType='application/json', dataType='json'){		
		
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
				if (successCallBack != null){
					//show success notification
					successCallBack(data);
				}
			},
			error: function(jqXHR, exception){
				sntapp.activityIndicator.hideActivityIndicator();
				sntapp.notification.showErrorMessage(createErrorMessage(jqXHR, exception) );

				//Show error notification
				if (!failCallBack) {
					
					failCallBack(jqXHR, exception);
				}
			}
			
		});
	};


}