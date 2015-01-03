sntRover.controller('RVKeyEncodePopupCtrl',[ '$rootScope','$scope','$state','ngDialog', 'RVKeyPopupSrv', '$filter',
		function($rootScope, $scope,$state, ngDialog, RVKeyPopupSrv, $filter){
	BaseCtrl.call(this, $scope);
	var that = this;
	this.setStatusAndMessage = function(message, status){
		$scope.statusMessage = message;
		$scope.status = status;
	};
			
	$scope.init = function(){
		var reservationStatus = "";
		$scope.data = {};
		//If the keypopup inviked from check-in flow - registration card)
		if($scope.fromView == "checkin"){
			reservationStatus = $scope.reservationBillData.reservation_status;
			// Setup data for late checkout
			$scope.data.is_late_checkout = false;
			$scope.data.confirmNumber = $scope.reservationBillData.confirm_no;
			$scope.data.roomNumber = $scope.reservationBillData.room_number;
		//If the keypopup inviked from inhouse - staycard card)
		} else {
			reservationStatus = $scope.reservationData.reservation_card.reservation_status;
			// Setup data for late checkout
			$scope.data.is_late_checkout = $scope.reservationData.reservation_card.is_opted_late_checkout;
			$scope.data.confirmNumber = $scope.reservationData.reservation_card.confirmation_num;
			$scope.data.roomNumber = $scope.reservationData.reservation_card.room_number;

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
			$scope.data.colorCodeClassForClose = 'green';
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
		
		//Based on different status, we switch between the views
		$scope.deviceConnecting = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;
		$scope.pressedCancelStatus = false;

		that.noOfErrorMethodCalled = 0;
		that.MAX_SEC_FOR_DEVICE_CONNECTION_CHECK = 10000;

		$scope.numberOfKeysSelected = 0;
		$scope.printedKeysCount = 0;
		$scope.writingInProgress = false;
		that.numOfKeys = 0;
		that.printKeyStatus = [];
		that.isAdditional = false;
		
		//whether we need to create smartband along with key creation
		that.isSmartbandCreateWithKeyWrite = $scope.isSmartbandCreateWithKeyWrite; //coming from popup initialization
		//variable to maintain last successful ID from card reader, will use for smartband creation
		that.lastSuccessfulCardIDReaded = '';

		$scope.buttonText = $filter('translate')('KEY_PRINT_BUTTON_TEXT');
		//Initally we check if the device is connected
		$scope.showDeviceConnectingMessge();

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
			if(secondsAfterCalled <= that.MAX_SEC_FOR_DEVICE_CONNECTION_CHECK){ //10seconds
				$scope.showDeviceConnectingMessge();
			}
		}, 1000);
		if(secondsAfterCalled > that.MAX_SEC_FOR_DEVICE_CONNECTION_CHECK){
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
	
	that.showUIDFetchFailedMsg = function(errorObject){
		$scope.$emit('hideLoader');
		//Asynchrounous action. so we need to notify angular that a change has occured. 
		//It lets you to start the digestion cycle explicitly
		$scope.$apply();
		var message = $filter('translate')('KEY_UNABLE_TO_READ_STATUS') + errorObject['RVErrorDesc'];
		that.showKeyPrintFailure(message);
	};
	/* 
	* Server call to fetch the key data.
	*/
	this.callKeyFetchAPI = function(uID){
		$scope.$emit('hideLoader'); 
		that.setStatusAndMessage($filter('translate')('KEY_GETTING_KEY_IMAGE_STATUS'), 'pending');
		var reservationId = '';
		// if('reservation_card' in $scope.reservationData){
			// alert('reservation_card');
	    	// reservationId = $scope.reservationData.reservation_card.reservation_id;
		// }
		// else if('reservationId' in $scope.reservationData){
			// alert('reservationId');
			// reservationId = $scope.reservationData.reservationId;
		// } else {
			// alert('reservationId else');
			// reservationId = $scope.reservationBillData.reservation_id;
		// }
		if($scope.viewFromBillScreen){
			reservationId = $scope.reservationBillData.reservation_id;
		} else {
			reservationId = $scope.reservationData.reservation_card.reservation_id;
		}
	    var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": true};
	    // for initial case the key we are requesting is not additional
	    if(!that.isAdditional){
	    	that.isAdditional = true;
	    	var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": false};
	    }
	    if(typeof uID !== 'undefined'){
	    	postParams.uid = uID;
	    	that.lastSuccessfulCardIDReaded = uID;
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
				//if the setting of smart band create along with key creation enabled, we will create a smartband with open room charge
    			if(that.isSmartbandCreateWithKeyWrite == "true" && that.lastSuccessfulCardIDReaded != ''){
    				var data = {};
    				//since there is not UI for adding first name & last name, we are setting as Blank, please see the comments of the story CICO-9315
    				data.first_name = '';
    				data.last_name  = '';
    				//setting as OPEN ROOM charge
    				data.is_fixed = false;
    				//setting smartband account number as last read ID from card reader
    				data.account_number = that.lastSuccessfulCardIDReaded;
    				return that.addNewSmartbandWithKey(data, index);
    			}

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
			'failureCallBack': function(errorObject){
				$scope.$emit('hideLoader');
				if(that.numOfKeys > 0){
					that.setStatusAndMessage($filter('translate')('KEY_CREATION_FAILED_STATUS_LONG') + ': '  + errorObject['RVErrorDesc'], 'error');					
				}
				else {
					var message = $filter('translate')('KEY_CREATION_FAILED_STATUS') + ': '  + errorObject['RVErrorDesc'];
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
	/**
	* Set the selected band type - fixed room/open charge to the band
	*/
	this.writeBandType = function(dataParams){
		that.setStatusAndMessage($filter('translate')('WRITING_BAND_TYPE'), 'pending');	
		var data = dataParams;
		var index = dataParams.index;
		var args = [];
		var bandType = '00000002';
		if(data.is_fixed){
			bandType = '00000001';
		}
		args.push(bandType);
		args.push(that.lastSuccessfulCardIDReaded);
		args.push('19');//Block Address - hardcoded
		var options = {
			//Cordova write success callback
			'successCallBack': function(data){
				$scope.$emit('hideLoader');	
				that.numOfKeys--;
				if(that.numOfKeys == 0){
					$scope.$emit('hideLoader');
					that.showKeyPrintSuccess();
					return true;
				}
				that.setStatusAndMessage($filter('translate')('KEY_BAND_CREATED_SUCCESSFULLY'), 'success');					
				that.printKeyStatus[index-1].printed = true;
				$scope.printedKeysCount = index;
				$scope.buttonText = 'Print key '+ (index+1);
				$scope.$apply();								
				return;				
			},
			'failureCallBack': function(errorObject){
				$scope.$emit('hideLoader');
				that.numOfKeys--;
				if(that.numOfKeys > 0){		
					that.setStatusAndMessage($filter('translate')('KEY_BAND_CREATED_FAILED_WRITING_BANDTYPE') + ': ' + errorObject['RVErrorDesc'], 'error');					
					that.printKeyStatus[index-1].printed = true;
					$scope.printedKeysCount = index;
					$scope.buttonText = 'Print key '+ (index+1);
					$scope.$apply();
				}
				else {
					var message = $filter('translate')('KEY_BAND_CREATED_FAILED_WRITING_BANDTYPE') + ': '  + errorObject['RVErrorDesc'];
					that.showKeyPrintFailure(message);					
				}				
				return;				
			},
			arguments: args
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.setBandTypeDebug(options);
		}
		else{
			sntapp.cardReader.setBandType(options);
		}

	};		
	/**
	* function used to add smartband, mainly for smartband creation while key writing
	*/
	this.addNewSmartbandWithKey = function(data, index){
		var is_fixed = data.is_fixed;
		that.setStatusAndMessage($filter('translate')('ADDING_BAND'), 'pending');
		//success call back of smartband's api call for creation
		var successCallbackOfAddNewSmartband_ = function(data){
			that.setStatusAndMessage($filter('translate')('BAND_ADDED'), 'success');
			$scope.$emit('showLoader');
			var params = {};
			params.index = index;
			params.is_fixed = is_fixed;
			params.account_number = data.account_number;
			that.writeBandType (params);
		};

		//failure call back of smartband's api call for creation
		var failureCallbackOfAddNewSmartband = function(errorMessage){
			that.setStatusAndMessage($filter('translate')('KEY_CREATED_BAND_ADDING_FAILED') + ': ' + errorMessage, 'error');			
			$scope.$emit('hideLoader');
			that.numOfKeys--;
			if(that.numOfKeys > 0){
				that.printKeyStatus[index-1].printed = true;
				$scope.printedKeysCount = index;
				$scope.buttonText = 'Print key '+ (index+1);
				$scope.$apply();			
			}
			else {
				var message = $filter('translate')('KEY_CREATED_BAND_ADDING_FAILED') + ': ' + errorMessage;
				that.showKeyPrintFailure(message);				
			}
		};			
		var reservationId = '';
		// if('reservation_card' in $scope.reservationData){
	    	// reservationId = $scope.reservationData.reservation_card.reservation_id;
		// }
		// else if('reservationId' in $scope.reservationData){
			// reservationId = $scope.reservationData.reservationId;
		// }		
		if($scope.viewFromBillScreen){
			reservationId = $scope.reservationBillData.reservation_id;
		} else {
			reservationId = $scope.reservationData.reservation_card.reservation_id;
		}		
		data.index = index;
		data.reservationId = reservationId;		
		$scope.invokeApi(RVKeyPopupSrv.addNewSmartBand, (data), successCallbackOfAddNewSmartband_, failureCallbackOfAddNewSmartband);	
	};
	var showPrintKeyOptions = function (status){
		//if status === false, they are not able to connect. I dont know why these type of designs
		// we have to call failurecallback on that
		if(status === false){
			return showDeviceNotConnected();
		}
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
    $scope.pressedCancel = function(message){
		$scope.$emit('hideLoader');
		$scope.printKeyFailMsg = $filter('translate')('KEY_NOT_PRINTED');
		if(message !== undefined){
			$scope.printKeyFailMsg = message;
		}
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
		$scope.pressedCancel(message);
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
		$state.go('rover.reservation.staycard.reservationcard.reservationdetails', 
				{"id": $scope.reservationBillData.reservation_id, 
				"confirmationId": $scope.reservationBillData.confirm_no, "isrefresh": true});
		
	};
	$scope.goToSearch = function(){
		$scope.closeDialog();
		$state.go('rover.search');
		
	};
}]);