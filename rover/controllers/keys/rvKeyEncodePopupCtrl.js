sntRover.controller('RVKeyEncodePopupCtrl',[ '$rootScope','$scope','ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	var that = this;
	$scope.init = function(){
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
    	$scope.data = {};
    	console.log(reservationStatus);
    	that.retrieveUID = true;
    	$scope.status = "Connected to Key Card Reader!";
    	// To check reservation status and select corresponding texts and classes.
    	if(reservationStatus == 'CHECKING_IN' ){
			$scope.data.reservationStatusText = 'Check in Complete';
			$scope.data.colorCodeClass = 'check-in';
			$scope.data.colorCodeClassForClose = 'hidden';
		}
		else if(reservationStatus == 'CHECKEDIN' ){
			$scope.data.reservationStatusText = 'In House';
			$scope.data.colorCodeClass = 'inhouse';
			$scope.data.colorCodeClassForClose = 'blue';
		}
		else if(reservationStatus == 'CHECKING_OUT'){
			$scope.data.reservationStatusText = 'Checking Out';
			$scope.data.colorCodeClass = 'check-out';
			$scope.data.colorCodeClassForClose = 'red';
		}

		//TODO: include late checkout scenario

		console.log(JSON.stringify($scope.reservationData));
		$scope.deviceConnecting = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.keyesPrinted = false;

		that.noOfErrorMethodCalled = 0;
		that.maxSecForErrorCalling = 1000;
		$scope.showDeviceConnectingMessge();
		$scope.numberOfKeysSelected = 0;
		$scope.writingInProgress = false;
		that.printKeyStatus = [];
	};

	$scope.keySelected = function(index){
		$scope.numberOfKeysSelected = ($scope.numberOfKeysSelected == index) ? --$scope.numberOfKeysSelected : index;
		// 'printKeyStatus' 
		var elementToPut = {};
		that.printKeyStatus = [];
		for(var i = 1; i <= $scope.numberOfKeysSelected; i++){
			elementToPut = {};
			elementToPut['key'] = 'key' + i;
			elementToPut['printed'] = false;
			elementToPut['fetched'] = false;
			that.printKeyStatus.push(elementToPut);
		}
	}

	$scope.clickedPrintKey = function(){		
		if($scope.numberOfKeysSelected == 0)
			return;
		$scope.writingInProgress = true;
		if(that.retrieveUID){
			that.getUID();
		}
		else{
			that.callKeyFetchAPI();
		}

	}

	/*
	* Call cordova service to get the UID
	*/
	that.getUID = function(){
		$scope.status = "Reading key!";		
		$scope.$emit('showLoader');
		var options = {
			'successCallBack': that.callKeyFetchAPI,
			'failureCallBack': that.showUIDFetchFailedMsg			
		};

		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.retrieveUserIDDebug(options);
		}
		else{
			sntapp.cardReader.retrieveUserID(options);
		}		
	};
	
	that.showUIDFetchFailedMsg = function(){
		$scope.$emit('hideLoader');
		var message = 'Unable to read the key!';
		that.showKeyPrintFailure(message);
	};
	/*
	* Server call to fetch the key data.
	*/
	this.callKeyFetchAPI = function(uID){
		sntapp.activityIndicator.hideActivityIndicator();
		$scope.status = 'Getting key image!';
	    var reservationId = getReservationId();

	    var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": true};
	    if(!that.key1Fetched){
	    	that.key1Fetched = true;
	    	var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": false};
	    }
	    if(typeof uID !== 'undefined'){
	    	postParams.uid = uID;
	    }else{
	    	postParams.uid = "";

	    }
	    
	    $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, successCallBackofInitialFetch);

	    var url = '/staff/reservation/print_key'
	    //var url = '/ui/show?format=json&json_input=keys/fetch_encode_key.json';
		var webservice = new WebServiceInterface();	
	  	var options = {
	  			   requestParameters: postParams,
	  			   successCallBack: that.keyFetchSuccess,
	  			   failureCallBack: that.keyFetchFailed,
	  			   loader: "BLOCKER"
	  	};
		webservice.postJSON(url, options);

	};	

	/**
	* Check if the card reader device connection is available.
	* Display a screen having device connecting message.
	*/
	$scope.showDeviceConnectingMessge = function(){
		$scope.deviceConnecting = true;
		$scope.deviceNotConnected = false;
		$scope.keyesPrinted = false;
		$scope.showPrintKeyOptions = false;

		var callBack = {
			'successCallBack': showPrintKeyOptions,
			'failureCallBack': showDeviceNotConnected			
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.checkDeviceConnectedDebug(callBack);
		}
		else {
			try {
				sntapp.cardReader.checkDeviceConnected(callBack);
			} catch(e) {
				that.showDeviceNotConnected();
			}
		}
	};

	/*
	* If the device is not connected, try the connection again after 1 sec.
	* repeat the connection check for 10 seconds. 
	* If the connection still fails, show a device not connected status in the popup.
	*/
	var showDeviceNotConnected = function(){
		//For 10 seconds, we will check the connectivity 
		//and if still no connection found, 
		//will display the device not connected screen
		var secondsAfterCalled = 0;
		that.noOfErrorMethodCalled++;
		secondsAfterCalled = that.noOfErrorMethodCalled * 1000;		
		setTimeout(function(){
			if(secondsAfterCalled <= that.maxSecForErrorCalling){ //10seconds
				$scope.showDeviceConnectingMessge();
			}
		}, 1000);

		if(secondsAfterCalled > that.maxSecForErrorCalling){
			$scope.deviceConnecting = false;
			$scope.keyesPrinted = false;
			$scope.showPrintKeyOptions = false;
			$scope.deviceNotConnected = true;
			$scope.$apply();

		}

	};

	var showPrintKeyOptions = function (){
		$scope.deviceConnecting = false;
		$scope.deviceNotConnected = false;
		$scope.keyesPrinted = false;
		$scope.showPrintKeyOptions = true;
		$scope.$apply();

	};

	var showKeysPrinted = function(){

		$scope.keyesPrinted = true;
	};

	$scope.cancelClicked = function(){

	};


	$scope.init();
	
}]);