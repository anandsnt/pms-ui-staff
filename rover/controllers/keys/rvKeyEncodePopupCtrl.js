sntRover.controller('RVKeyEncodePopupCtrl',[ '$rootScope','$scope','$state','ngDialog', 'RVKeyPopupSrv', '$filter',
		function($rootScope, $scope,$state, ngDialog, RVKeyPopupSrv, $filter){
	BaseCtrl.call(this, $scope);
	var that = this;

	this.setStatusAndMessage = function(message, status){
		$scope.statusMessage = message;
		$scope.status = status;
	};
	
	$scope.pressedCancelStatus = false;
	
	$scope.init = function(){
		var reservationStatus = "";
		$scope.data = {};
		if($scope.fromView == "checkin"){
			reservationStatus = $scope.reservationBillData.reservation_status;
			// Setup data for late checkout
			$scope.data.is_late_checkout = false;
			$scope.confirmNumber = $scope.reservationBillData.confirm_no;
		} else {
			reservationStatus = $scope.reservationData.reservation_card.reservation_status;
			// Setup data for late checkout
			$scope.data.is_late_checkout = $scope.reservationData.reservation_card.is_opted_late_checkout;
			$scope.confirmNumber = $scope.reservationData.reservation_card.confirmation_num;
		}
		
    	if($scope.data.is_late_checkout) $scope.data.late_checkout_time = $scope.reservationData.reservation_card.late_checkout_time;
    	
    	that.retrieveUID = true;
    	that.UID = '';
		var statusMessage = $filter('translate')('KEY_CONNECTED_STATUS');
    	that.setStatusAndMessage(statusMessage, 'success');	
    	// To check reservation status and select corresponding texts and classes.
    	if(reservationStatus == 'CHECKING_IN' ){
			$scope.data.reservationStatusText = $filter('translate')('KEY_CHECKIN_STATUS');
			$scope.data.colorCodeClass = 'check-in';
			$scope.data.colorCodeClassForClose = 'hidden';
		}
		else if(reservationStatus == 'CHECKEDIN' ){
			$scope.data.reservationStatusText = $filter('translate')('KEY_INHOUSE_STATUS');
			$scope.data.colorCodeClass = 'inhouse';
			$scope.data.colorCodeClassForClose = 'blue';
		}
		else if(reservationStatus == 'CHECKING_OUT'){
			$scope.data.reservationStatusText = $filter('translate')('KEY_CHECKOUT_STATUS');
			$scope.data.colorCodeClass = 'check-out';
			$scope.data.colorCodeClassForClose = 'red';
		}
		//TODO: include late checkout scenario
		
		$scope.deviceConnecting = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;

		that.noOfErrorMethodCalled = 0;
		that.maxSecForErrorCalling = 1000;
		$scope.showDeviceConnectingMessge();

		$scope.numberOfKeysSelected = 0;
		$scope.printedKeysCount = 0;
		$scope.writingInProgress = false;
		that.numOfKeys = 0;
		that.printKeyStatus = [];
		that.isAdditional = false;
		
		$scope.buttonText = $filter('translate')('KEY_PRINT_BUTTON_TEXT');
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
		$scope.$emit('hideLoader');
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
			$scope.keysPrinted = false;
			$scope.showPrintKeyOptions = false;
			$scope.deviceNotConnected = true;
			$scope.$apply();

		}

	};

	$scope.tryAgainButtonPressed = function(){
		that.noOfErrorMethodCalled = 0;
		$scope.showDeviceConnectingMessge();
	};
	/**
	* Check if the card reader device connection is available.
	* Display a screen having device connecting message.
	*/
	$scope.showDeviceConnectingMessge = function(){
		$scope.deviceConnecting = true;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;
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
				showDeviceNotConnected();
			}
		}
	};
	$scope.keySelected = function(index){
		that.numOfKeys = 0;
		$scope.numberOfKeysSelected = ($scope.numberOfKeysSelected == index) ? --$scope.numberOfKeysSelected : index;
		that.numOfKeys = $scope.numberOfKeysSelected;
		$scope.printedKeysCount = 0;
		if(that.numOfKeys > 0){
			$scope.buttonText = $filter('translate')('KEY_PRINT_BUTTON_TEXT_KEY1');
		}
		// 'printKeyStatus' is the dictionary used to monitor the printing & writing key status
		var elementToPut = {};
		that.printKeyStatus = [];
		for(var i = 1; i <= $scope.numberOfKeysSelected; i++){
			elementToPut = {};
			elementToPut['key'] = 'key' + i;
			elementToPut['printed'] = false;
			elementToPut['fetched'] = false;
			that.printKeyStatus.push(elementToPut);
		}
	};

	$scope.clickedPrintKey = function(){		
		if($scope.numberOfKeysSelected == 0)
			return;
		that.UID = '';

		$scope.writingInProgress = true;
		if(that.retrieveUID){
			that.getUID();
		}
		else{
			that.callKeyFetchAPI();
		}

	};

	/*
	* Call cordova service to get the UID
	*/
	that.getUID = function(){
		that.setStatusAndMessage($filter('translate')('KEY_READING_STATUS'), 'pending');	
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
		//Asynchrounous action. so we need to notify angular that a change has occured. 
		//It lets you to start the digestion cycle explicitly
		$scope.$apply();
		var message = $filter('translate')('KEY_UNABLE_TO_READ_STATUS');
		that.showKeyPrintFailure(message);
	};
	/*
	* Server call to fetch the key data.
	*/
	this.callKeyFetchAPI = function(uID){
		$scope.$emit('hideLoader'); 
		that.setStatusAndMessage($filter('translate')('KEY_GETTING_KEY_IMAGE_STATUS'), 'pending');
	    var reservationId = $scope.reservationData.reservation_card.reservation_id;

	    var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": true};
	    // for initial case the key we are requesting is not additional
	    if(!that.isAdditional){
	    	that.isAdditional = true;
	    	var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": false};
	    }
	    if(typeof uID !== 'undefined'){
	    	postParams.uid = uID;
	    }else{
	    	postParams.uid = "";

	    }
	    that.UID = postParams.uid;
	    $scope.invokeApi(RVKeyPopupSrv.fetchKeyFromServer, postParams, that.keyFetchSuccess, that.keyFetchFailed);

	};	

	/*
	* Success callback for key fetching
	*/
	this.keyFetchSuccess = function(response){
		$scope.$emit('hideLoader');
		that.keyData = response;	
		that.printKeys();
	};

	/*
	* Key fetch failed callback. Show a print key failure status
	*/
	this.keyFetchFailed = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
		var message = $filter('translate')('KEY_CREATION_FAILED_STATUS');
		that.showKeyPrintFailure(message);

	};

	/*
	* Calculate the keyWrite data from the API response and call the write key method for key writing.
	*/	
	that.printKeys = function(){
		var index = -1;
		for(var i = 0; i < that.printKeyStatus.length; i++){
			if(that.printKeyStatus[i].printed == false){
				index = i + 1;
				break;
			}
		}
	    
	    var keyData = [];
	    //Safelock key
	    if(Object.keys(that.keyData.key_info[0])[0] == "base64"){
	    	keyData.push(that.keyData.key_info[0].base64);
	    }
	    else if(Object.keys(that.keyData.key_info[0])[0] == "image"){
	    	keyData.push(that.keyData.key_info[0].image);
	    }	    
	    else{
	    	keyData.push(that.keyData.key_info[0].t3);
	    }

	    keyData.push(Object.keys(that.keyData.key_info[0])[0]);
	    keyData.push($scope.escapeNull(that.keyData.aid));
	    keyData.push($scope.escapeNull(that.keyData.keyb));
	    keyData.push($scope.escapeNull(that.UID));
	    that.writeKey(keyData, index);
	};

	/*
	* Calls the cordova service to write the keys
	*/
	this.writeKey = function(keyWriteData, index){
		$scope.$emit('showLoader');
		that.setStatusAndMessage($filter('translate')('KEY_WRITING_PROGRESS_STATUS'), 'pending');

		var options = {
			//Cordova write success callback. If all the keys were written sucessfully, show key success message
			//If keys left to print, call the cordova write key function to write the pending key
			'successCallBack': function(data){
				$scope.$emit('hideLoader');
				that.setStatusAndMessage($filter('translate')('KEY_CREATED_STATUS'), 'success');							

				that.numOfKeys--;
				that.printKeyStatus[index-1].printed = true;
				$scope.printedKeysCount = index;
				$scope.buttonText = 'Print key '+ (index+1);
				$scope.$apply();
				if(that.numOfKeys == 0){
					that.showKeyPrintSuccess();
					return true;
				}


				
			},
			'failureCallBack': function(){
				$scope.$emit('hideLoader');
				if(that.numOfKeys > 0){
					that.setStatusAndMessage($filter('translate')('KEY_CREATION_FAILED_STATUS_LONG'), 'error');					
				}
				else {
					var message = $filter('translate')('KEY_CREATION_FAILED_STATUS');
					that.showKeyPrintFailure(message);
				}
				$scope.$apply(); 

			},
			arguments: keyWriteData
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.writeKeyDataDebug(options);
		}
		else{
			sntapp.cardReader.writeKeyData(options);
		}

	};	

	var showPrintKeyOptions = function (){
		$scope.$emit('hideLoader');
		$scope.deviceConnecting = false;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;
		$scope.showPrintKeyOptions = true;
		$scope.$apply();

	};

	var showKeysPrinted = function(){
		$scope.$emit('hideLoader');
		$scope.deviceConnecting = false;
		$scope.keysPrinted = true;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.$apply();
	};

	$scope.init();
	/*
	 * To handle cancel option after checkin success
	 */
    $scope.pressedCancel = function(){
		$scope.$emit('hideLoader');
		$scope.deviceConnecting = false;
		$scope.keysPrinted = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.pressedCancelStatus = true;
		//TODO:verfiy if required
		$scope.$apply();
	};
	
	/*
	* Show the key print success message
	*/
	this.showKeyPrintSuccess = function(){
		showKeysPrinted();
	};

	/*
	* Show the key print failure message
	*/
	this.showKeyPrintFailure = function(message){
		$scope.$emit('hideLoader');
		if(typeof message == 'undefined'){
			var message = $filter('translate')('KEY_CREATION_FAILED_STATUS');
		}
		that.setStatusAndMessage(message, 'error');
		//Check if digest is already in progress - if not start digest
		if(!$scope.$$phase) {
			$scope.$apply();
		}

	};

	// Close popup
	$scope.closeDialog = function(){
		ngDialog.close();
	};
	// To handle close button click
	$scope.goToStaycard = function(){
		$scope.closeDialog();
		$state.go('rover.staycard.reservationcard.reservationdetails', 
				{"id": $scope.reservationBillData.reservation_id, 
				"confirmationId": $scope.reservationBillData.confirm_no, "isrefresh": true});
		
	};
	$scope.goToSearch = function(){
		$scope.closeDialog();
		$state.go('rover.search');
		
	};
}]);