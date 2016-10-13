var LoginOperation = function(){
	// class for handling operations with payment device
	var that = this;

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
			return false;
		}
		else if(failureCallBack == null){
			return false;
		}
		else if(service == null){
			return false;
		}
		else if(action == null){
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
			that.callCordovaService(options);
		}
	};

	/**
	* method To set the user id in native component
	*/
	this.setUserId = function(options){

		options['service'] = "RVCardPlugin";
		options['action'] = "setUserID";
		that.callCordovaService(options);
	};


};