var CardOperation = function() {
	console.info('card operation started');
	// class for handling operations with payment device

	var that = this;
	// function for start reading from device
	// Note down: Currently it is recursive


	this.startReader = function(options) {
		options['shouldCallRecursively'] = true;
		that.listenForSingleSwipe(options);
	};

	// function used to call cordova services
	this.callCordovaService = function(options) {
		// cordova.exec function require success and error call back
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;

		var service = options["service"] ? options["service"] : null;
		var action = options["action"] ? options["action"] : null;
		var arguments = options["arguments"] ? options["arguments"] : [];

		if (successCallBack === null) {
			return false;
		} else if (failureCallBack === null) {
			return false;
		} else if (service === null) {
			return false;
		} else if (action === null) {
			return false;
		} else {
				if (cordova) {
				//calling cordova service
					cordova.exec(
						// if success call back require any parameters
						function(data) {
							successCallBack(data);
							that.callRecursively(options);
						},
						// if failure/error call back require any parameters
						function(error) {
							failureCallBack(error);
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
		}
	};

	this.callRecursively = function(options) {
		// TODO: Have to find better way of implementing this if not.
		var shouldCallRecursively = options["shouldCallRecursively"] ? options["shouldCallRecursively"] : false;
		if (shouldCallRecursively) {
			that.callCordovaService(options);
		}
	};

	//function for get single swipe
	this.listenForSingleSwipe = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "observeForSwipe";
		that.callCordovaService(options);
	};

	// function for writing the key data
	this.writeKeyData = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "processKeyWriteOperation";
		that.callCordovaService(options);
	};

	// function for stop reading from device
	this.stopReader = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "cancelSwipeObservation";
		that.callCordovaService(options);

	};

	/**
	 * method for stop/cancel writing operation
	 */
	this.cancelWriteOperation = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "cancelWriteOperation";
		that.callCordovaService(options);
	};
	/**
	 * method To set the wrist band type- fixed amount/open room charge
	 */
	this.setBandType = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "setBandType";
		that.callCordovaService(options);
	};

	this.setBandTypeDebug = function(options) {
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;
		// we are simulating the process by calling the success call back after some time
		setTimeout(function() {
			successCallBack();
		}, 1000);

	};
	/**
	 * method for checking the device connected status
	 * will call success call back if it is fail or connected (bit confusing?)
	 * success call back with data as false if disconnected
	 * success call back with data as true if connected
	 */
	// function to check device status
	this.checkDeviceConnected = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "checkDeviceConnectionStatus";
		that.callCordovaService(options);
	};

	// debug mode of check device connection checking
	// please check above method (checkDeviceConnected) for further description
	this.checkDeviceConnectedDebug = function(options) {
		//Simulating the write function for easy testing. May be removed in production.
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;
		var deviceStatus = true;
		// we are simulating the process by calling the success call back after some time
		setTimeout(function() {
			successCallBack(deviceStatus, successCallBackParameters);
		}, 1000);
	};

	/**
	 * method for retrieving the UID (Unique ID) from Card for Safe lock
	 * will call the success call back with user id
	 * if any error occured, will call the error call back
	 */
	this.retrieveUserID = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "getCLCardUID";
		that.callCordovaService(options);
	};

	/**
	 * method for retrieving the UID (User ID) from Card for Safe lock
	 * will call the success call back with user id
	 * if any error occured, will call the error call back
	 */
	this.retrieveCardInfo = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "getCLCardInfo";
		that.callCordovaService(options);
	};


	//function for linking iBeacon
	this.linkiBeacon = function(options) {
		options['service'] = "RVCardPlugin";
		options['action'] = "writeBeaconID";
		that.callCordovaService(options);
	};

};