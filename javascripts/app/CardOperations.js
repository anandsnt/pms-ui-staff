

var CardOperation = function(){
	// class for handling operations with payment device
	
	var that = this;
	
	// function for start reading from device 
	// Note down: Currently it is recursive
	
	this.startReaderDebug = function(options){
	//Simulating the card reader function for easy testing. May be removed in production.

		coinstance = this; // Global instance to test from console.
		that.callSuccess = function(data)
		{
			console.log("sucecss called");
			var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
			var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
			var carddata= { 'RVCardReadCardType': 'AX',
							'RVCardReadTrack2': 'CDA1E3A2EB853964E4D4550151545BE1052CB17498A61E8FE5BB5D948BD3844EA78603B263D5E509',
          					'RVCardReadTrack2KSN': '950067000000062002AF'
						  };

			if (typeof data != 'undefined'){ carddata = data;}
			successCallBack(carddata, successCallBackParameters);
		}

	}
	this.writeKeyDataDebug = function(options){
		//Simulating the write function for easy testing. May be removed in production.
		console.log("sucecss called in write key debug mode");
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var mechineResponse= { };

		setTimeout(function(){
			successCallBack(mechineResponse, successCallBackParameters)
		}, 1000)

	}	


	this.startReader = function(options){
		options['shouldCallRecursively'] = true;
		that.listenForSingleSwipe(options);		
	};
	
	// function used to call cordova services
	this.callCordovaService = function(options){
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
	}
	
	//function for get single swipe
	this.listenForSingleSwipe = function(options){		
		options['service'] = "RVCardPlugin";
		options['action'] = "observeForSwipe";
		that.callCordovaService(options);
	};
	
	// function for writing the key data
	this.writeKeyData = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "processKeyWriteOperation";		
		that.callCordovaService(options);		
	};
	
	// function for stop reading from device
	this.stopReader = function(){
		options['service'] = "RVCardPlugin";
		options['action'] = "cancelSwipeObservation";		
		that.callCordovaService(options);		
		
	};
	/**
	*
	*/
	// function to check device status
	this.checkDeviceConnected = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "checkDeviceConnectionStatus";		
		that.callCordovaService(options);
	};
};