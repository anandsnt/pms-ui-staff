var iBeaconOperation = function(){
	// class for handling operations with payment device
	
	var that = this;
	
	
	// function used to call cordova services
	this.callCordovaService = function(options){
		
		alert("xxxxx");
		// cordova.exec function require success and error call back
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;
		
		// if success call back require additional parameters
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		
		// if error call back require additional parameters
		var failureCallBackParameters =  options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;
		
		var service = options["service"] ? options["service"] : null;
		var action = options["action"] ? options["action"] : null;
		var arguments = options["arguments"] ? options["arguments"] : [];
		
		if(successCallBack == null){
			console.log('Card operation requires "successCallBack" parameter as function');
			return false;
		}
		else if(failureCallBack == null){
			console.log('Card operation requires "failureCallBack" parameter as function');
			return false;			
		}
		else if(service == null){
			console.log('Card operation requires service name as "service" parameter');
			return false;
		}
		else if(action == null){
			console.log('Card operation requires action name as "action" parameter');
			return false;			
		}		
		else{
		
			//calling cordova service
			cordova.exec(
						// if success call back require any parameters
						function(data){
	
							if(successCallBackParameters !== null){
								successCallBack(data, successCallBackParameters);
								that.callRecursively(options);
							}
							else{
								successCallBack(data);
								that.callRecursively(options);
							}
							
						}, 
						// if failure/error call back require any parameters
						function(error){
							if(failureCallBackParameters !== null){
								failureCallBack(error, failureCallBackParameters);
							}
							else{
								failureCallBack(error);
							}

							that.callRecursively(options);
						},
						
						// service name
						service,
						// function name
						action,
						// arguments to native
						arguments					
					);	

			
		}		
	};
	
	this.callRecursively = function(options){
		// TODO: Have to find better way of implementing this if not.
		var shouldCallRecursively = options["shouldCallRecursively"] ? options["shouldCallRecursively"] : false;
		if(shouldCallRecursively) {
			console.log('Calling recursively');
			that.callCordovaService(options);
		}
	};

	//function for linking iBeacon
	this.linkiBeacon = function(options){
		alert("yyyy");
		options['service'] = "RVCardPlugin";
		options['action'] = "writeBeaconID";
		that.callCordovaService(options);
	};
	

};