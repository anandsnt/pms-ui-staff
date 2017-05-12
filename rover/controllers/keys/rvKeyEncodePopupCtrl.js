sntRover.controller('RVKeyEncodePopupCtrl', [ '$rootScope', '$scope', '$state', 'ngDialog', 'RVKeyPopupSrv', '$filter', '$timeout', '$log',
		function($rootScope, $scope, $state, ngDialog, RVKeyPopupSrv, $filter, $timeout, $log) {
	BaseCtrl.call(this, $scope);
	var that = this;

	var scopeState = {
		isCheckingDeviceConnection: false
	};

	this.setStatusAndMessage = function(message, status) {
		$scope.statusMessage = message;
		$scope.status = status;
	};
        $rootScope.$on('MAKE_KEY_TYPE', function(evt, data) {
            $scope.keyType = data.type;
        });
	$scope.init = function() {

		$scope.$emit('HOLD_OBSERVE_FOR_SWIPE_RESETS');

		// CICO-11444 to fix the issue of poping up select box in ipad
		$('#encoder-type').blur();

		// If SAFLOK_MSR is the chosen encoder type, we would show a dropdown with active encoders listed.
		/** *************************CICO-11444 *****************************************/
		$scope.encoderSelected = "";
		if ($scope.fromView === "checkin") {
			$scope.isRemoteEncodingEnabled = $scope.reservationBillData.is_remote_encoder_enabled;
		} else {
			$scope.isRemoteEncodingEnabled = $scope.reservationData.reservation_card.is_remote_encoder_enabled;
		}

		if (sessionStorage.encoderSelected && sessionStorage.encoderSelected !== '') {
			$scope.encoderSelected = parseInt(sessionStorage.encoderSelected);
		}

		/** ***************************************************************************/

		var reservationStatus = "";

		$scope.data = {};
		// If the keypopup inviked from check-in flow - registration card)
		if ($scope.fromView === "checkin") {
			reservationStatus = $scope.reservationBillData.reservation_status;
			// Setup data for late checkout
			$scope.data.is_late_checkout = false;
			$scope.data.confirmNumber = $scope.reservationBillData.confirm_no;
			$scope.data.roomNumber = $scope.reservationBillData.room_number;
		// If the keypopup inviked from inhouse - staycard card)
		} else {
			reservationStatus = $scope.reservationData.reservation_card.reservation_status;
			// Setup data for late checkout
			$scope.data.is_late_checkout = $scope.reservationData.reservation_card.is_opted_late_checkout;
			$scope.data.confirmNumber = $scope.reservationData.reservation_card.confirmation_num;
			$scope.data.roomNumber = $scope.reservationData.reservation_card.room_number;

		}

    	if ($scope.data.is_late_checkout) {
    		$scope.data.late_checkout_time = $scope.reservationData.reservation_card.late_checkout_time;
    	}
		var statusMessage = $filter('translate')('KEY_CONNECTED_STATUS');

    	that.setStatusAndMessage(statusMessage, 'success');
    	// To check reservation status and select corresponding texts and classes.
    	if (reservationStatus === 'CHECKING_IN' ) {
			$scope.data.reservationStatusText = $filter('translate')('KEY_CHECKIN_STATUS');
			$scope.data.colorCodeClass = 'check-in';
			$scope.data.colorCodeClassForClose = 'green';
		}
		else if (reservationStatus === 'CHECKEDIN' ) {
			$scope.data.reservationStatusText = $filter('translate')('KEY_INHOUSE_STATUS');
			$scope.data.colorCodeClass = 'inhouse';
			$scope.data.colorCodeClassForClose = 'blue';
		}
		else if (reservationStatus === 'CHECKING_OUT') {
			$scope.data.reservationStatusText = $filter('translate')('KEY_CHECKOUT_STATUS');
			$scope.data.colorCodeClass = 'check-out';
			$scope.data.colorCodeClassForClose = 'red';
		}
		// TODO: include late checkout scenario

		// Based on different status, we switch between the views
		$scope.deviceConnecting = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;
		$scope.pressedCancelStatus = false;
        $scope.showTabletOption = true;

		that.noOfErrorMethodCalled = 0;
		that.MAX_SEC_FOR_DEVICE_CONNECTION_CHECK = 10000;

		$scope.numberOfKeysSelected = 0;
		$scope.printedKeysCount = 0;
		$scope.writingInProgress = false;
		that.numOfKeys = 0;
		that.printKeyStatus = [];
		that.isAdditional = false;

		// whether we need to create smartband along with key creation
		that.isSmartbandCreateWithKeyWrite = $scope.isSmartbandCreateWithKeyWrite; // coming from popup initialization
		// variable to maintain last successful ID from card reader, will use for smartband creation
		that.lastSuccessfulCardIDReaded = '';

        if ($scope.keyType === 'New') {
            $scope.buttonText = $filter('translate')('KEY_PRINT_BUTTON_TEXT');
        } else {
            $scope.buttonText = $filter('translate')('KEY_DUPLICATE_BUTTON_TEXT');
        }
        // as per CICO-31909 Initally we check if the device is connected
        // check if it is a desktop or iPad
        $scope.isIpad = sntapp.browser === 'rv_native' && sntapp.cordovaLoaded;
		
        if ($scope.isIpad && $scope.isRemoteEncodingEnabled) {
            $scope.deviceConnecting = true;
            that.setStatusAndMessage($filter('translate')('CONNECTING_TO_KEY_CARD_READER'), 'pending');
            $scope.showDeviceConnectingMessge();
            $scope.showPrintKeyOptions = true;
            $scope.encoderSelected = '';
        } else if (!$scope.isIpad && $scope.isRemoteEncodingEnabled) {
            $scope.showTabletOption = false;
            showPrintKeyOptions(true);
        } else {
            $scope.showDeviceConnectingMessge();
        }
	};

	$scope.isPrintKeyEnabled = function() {
		if ($scope.numberOfKeysSelected === 0) {
			return false;
		}
		if ($scope.numberOfKeysSelected > 0) {
			if ($scope.isRemoteEncodingEnabled && $scope.encoderSelected === "") {
				return false;
			}
			return true;
		}
	};

	$scope.selectedEncoder = function() {
		sessionStorage.encoderSelected = $scope.encoderSelected;
	};
	/*
	* If the device is not connected, try the connection again after 1 sec.
	* repeat the connection check for 10 seconds.
	* If the connection still fails, show a device not connected status in the popup.
	*/
	var showDeviceNotConnected = function() {
		// For 10 seconds, we will check the connectivity
		// and if still no connection found,
		// will display the device not connected screen
		$scope.$emit('hideLoader');
		var secondsAfterCalled = 0;

        scopeState.isCheckingDeviceConnection = false;

		that.noOfErrorMethodCalled++;
		secondsAfterCalled = that.noOfErrorMethodCalled * 1000;
		setTimeout(function() {
			if (secondsAfterCalled <= that.MAX_SEC_FOR_DEVICE_CONNECTION_CHECK) { // 10seconds
                var checkDeviceConnection = function() {
					$log.info('deviceready listener...');
                    sntapp.cardReader = new CardOperation();
                    $timeout(function() {
                        $scope.showDeviceConnectingMessge();
                    }, 300);
                    document.removeEventListener("deviceready", checkDeviceConnection, false);
                };

                if (that.noOfErrorMethodCalled > 1 && $scope.isIpad) {
                    sntCordovaInit();
                    document.addEventListener("deviceready", checkDeviceConnection, false);
                } else {
                    $scope.showDeviceConnectingMessge();
                }
			}
		}, 1000);
		if (secondsAfterCalled > that.MAX_SEC_FOR_DEVICE_CONNECTION_CHECK) {
            // remove tablet option from dropdown if no connected device found
            $scope.encoderTypes = _.filter($scope.encoderTypes, function(encoder) {
                return encoder.description !== 'Tablet';
            });

            if ($scope.isRemoteEncodingEnabled) {
                // hide tablet option if only remote encoders and no device connected
                $scope.showTabletOption = false;
                that.setStatusAndMessage($filter('translate')('ERROR_CONNECTING_TO_KEY_CARD_READER'), 'error');
                showPrintKeyOptions(true);
            } else {
                $scope.deviceConnecting = false;
                $scope.keysPrinted = false;
                $scope.showPrintKeyOptions = false;
                $scope.deviceNotConnected = true;
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
		}

	};

	$scope.tryAgainButtonPressed = function() {
		that.noOfErrorMethodCalled = 0;
		$scope.showDeviceConnectingMessge();
	};
	/**
	* Check if the card reader device connection is available.
	* Display a screen having device connecting message.
	*/
	$scope.showDeviceConnectingMessge = function() {
		$scope.deviceConnecting = true;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;
		$scope.showPrintKeyOptions = $scope.isIpad && $scope.isRemoteEncodingEnabled;

		scopeState.isCheckingDeviceConnection = true;

        $timeout(function() {
            if (scopeState.isCheckingDeviceConnection) {
                showDeviceNotConnected();
            }
        }, 2000);

		var callBack = {
			'successCallBack': onDeviceConnectionSuccess,
			'failureCallBack': showDeviceNotConnected
		};

		if (sntapp.cardSwipeDebug) {
			sntapp.cardReader.checkDeviceConnectedDebug(callBack);
		}
		else {
			try {
				sntapp.cardReader.checkDeviceConnected(callBack);
			} catch (e) {
				showDeviceNotConnected();
			}
		}
	};
	$scope.keySelected = function(index) {
		that.numOfKeys = 0;
		$scope.numberOfKeysSelected = ($scope.numberOfKeysSelected === index) ? --$scope.numberOfKeysSelected : index;
		that.numOfKeys = $scope.numberOfKeysSelected;
		$scope.printedKeysCount = 0;
		if (that.numOfKeys > 0) {
                    if ($scope.keyType === 'New') {
                        $scope.buttonText = $filter('translate')('KEY_PRINT_BUTTON_TEXT_KEY1');
                    } else {
                        $scope.buttonText = $filter('translate')('KEY_DUPLICATE_BUTTON_TEXT_KEY1');
                    }

		}
		// 'printKeyStatus' is the dictionary used to monitor the printing & writing key status
		var elementToPut = {};

		that.printKeyStatus = [];
		for (var i = 1; i <= $scope.numberOfKeysSelected; i++) {
			elementToPut = {};
			elementToPut['key'] = 'key' + i;
			elementToPut['printed'] = false;
			elementToPut['fetched'] = false;
			that.printKeyStatus.push(elementToPut);
		}
	};

	$scope.clickedPrintKey = function() {
		if ($scope.numberOfKeysSelected === 0) {
			return;
		}
        // if tablet chosen it means we need to get the details of device connected
        if ($scope.encoderSelected === '-1') {
            $scope.writingInProgress = true;
            that.getCardInfo();
            return false;
        }
		// CICO-11444. If saflok_msr we we ll be connecting to remote encoders in the network
		else if ($scope.isRemoteEncodingEnabled) {
			that.callKeyFetchAPI();
			return false;
		}
        // if remote encoding false
        else {
            $scope.writingInProgress = true;
            that.getCardInfo();
        }
	};

	that.getCardInfo = function() {
		that.setStatusAndMessage($filter('translate')('KEY_READING_STATUS'), 'pending');
		$scope.$emit('showLoader');
		var options = {
			'successCallBack': that.callKeyFetchAPI,
			'failureCallBack': that.showCardInfoFetchFailedMsg
		};

		if (sntapp.cardSwipeDebug) {
			sntapp.cardReader.retrieveCardInfoDebug(options);
		}
		else {
			sntapp.cardReader.retrieveCardInfo(options);
		}

	};

	that.showCardInfoFetchFailedMsg = function(errorObject) {
		$scope.$emit('hideLoader');
		// Asynchrounous action. so we need to notify angular that a change has occured.
		// It lets you to start the digestion cycle explicitly
		$scope.$apply();
		var message = $filter('translate')('KEY_UNABLE_TO_READ_STATUS') + errorObject['RVErrorDesc'];

		that.showKeyPrintFailure(message);
	};
	/*
	* Server call to fetch the key data.
	*/
	this.callKeyFetchAPI = function(cardInfo) {
		$scope.$emit('hideLoader');
		that.setStatusAndMessage($filter('translate')('KEY_GETTING_KEY_IMAGE_STATUS'), 'pending');
		var reservationId = '';

		if ($scope.viewFromBillScreen) {
			reservationId = $scope.reservationBillData.reservation_id;
		} else {
			reservationId = $scope.reservationData.reservation_card.reservation_id;
		}
	    var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": true};
	    // for initial case the key we are requesting is not additional

	    if (!that.isAdditional) {
	    	that.isAdditional = true;
	    	var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": false};
	    }
	    if (typeof cardInfo !== 'undefined') {
	    	postParams.card_info = cardInfo;
	    	that.lastSuccessfulCardIDReaded = cardInfo.card_uid;
	    } else if ($scope.isRemoteEncodingEnabled) {
	    	postParams.card_info = "";
            postParams.key_encoder_id = $scope.encoderSelected;
	    }

        if ($scope.keyType === 'Duplicate') {
            postParams.is_additional = true;
        }

	    $scope.invokeApi(RVKeyPopupSrv.fetchKeyFromServer, postParams, that.keyFetchSuccess, that.keyFetchFailed);

	};

	/*
	* Success callback for key fetching
	*/
	this.keyFetchSuccess = function(response) {
		$scope.$emit('hideLoader');
		that.keyData = response;
		that.printKeys();
	};

	/*
	* Key fetch failed callback. Show a print key failure status
	*/
	this.keyFetchFailed = function(errorMessage) {
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
		var message = $filter('translate')('KEY_CREATION_FAILED_STATUS');

		that.showKeyPrintFailure(message);

	};

	/*
	* Calculate the keyWrite data from the API response and call the write key method for key writing.
	*/
	that.printKeys = function() {
		var index = -1;

		for (var i = 0; i < that.printKeyStatus.length; i++) {
			if (that.printKeyStatus[i].printed === false) {
				index = i + 1;
				break;
			}
		}
		// CICO-11444 if SAFLOK_MSR, we will be writing to remote encoder via print_key api call itself.
		// No encoder is attached to ipad.
        // Check Tablet was not chosen for key generation
		if ($scope.isRemoteEncodingEnabled && $scope.encoderSelected !== '-1') {
			that.numOfKeys--;
			that.printKeyStatus[index - 1].printed = true;
			$scope.printedKeysCount = index;
			$scope.buttonText = 'Print key ' + (index + 1) + '/' + that.printKeyStatus.length;

			if (that.numOfKeys === 0) {
				that.showKeyPrintSuccess();
				return true;
			}
			return false;
		}
	    that.writeKey(that.keyData, index);
	};

	/*
	* Calls the cordova service to write the keys
	*/
	this.writeKey = function(keyWriteData, index) {
		var keyData = [];

		keyData.push(JSON.stringify(keyWriteData));
		$scope.$emit('showLoader');
		that.setStatusAndMessage($filter('translate')('KEY_WRITING_PROGRESS_STATUS'), 'pending');

		var options = {
			// Cordova write success callback. If all the keys were written sucessfully, show key success message
			// If keys left to print, call the cordova write key function to write the pending key
			'successCallBack': function(data) {
				$scope.$emit('hideLoader');
				that.setStatusAndMessage($filter('translate')('KEY_CREATED_STATUS'), 'success');
				// if the setting of smart band create along with key creation enabled, we will create a smartband with open room charge
    			if (that.isSmartbandCreateWithKeyWrite === "true" && that.lastSuccessfulCardIDReaded !== '') {
    				var data = {};
    				// since there is not UI for adding first name & last name, we are setting as Blank, please see the comments of the story CICO-9315

    				data.first_name = '';
    				data.last_name  = '';
    				// setting as OPEN ROOM charge
    				data.is_fixed = false;
    				// setting smartband account number as last read ID from card reader
    				data.account_number = that.lastSuccessfulCardIDReaded;
    				return that.addNewSmartbandWithKey(data, index);
    			}

				that.numOfKeys--;
				that.printKeyStatus[index - 1].printed = true;
				$scope.printedKeysCount = index;
				$scope.buttonText = 'Print key ' + (index + 1) + '/' + that.printKeyStatus.length;
				$scope.$apply();
				if (that.numOfKeys === 0) {
					that.showKeyPrintSuccess();
					return true;
				}


			},
			'failureCallBack': function(errorObject) {
				$scope.$emit('hideLoader');
				if (that.numOfKeys > 0) {
					that.setStatusAndMessage($filter('translate')('KEY_CREATION_FAILED_STATUS_LONG') + ': '  + errorObject['RVErrorDesc'], 'error');
				}
				else {
					var message = $filter('translate')('KEY_CREATION_FAILED_STATUS') + ': '  + errorObject['RVErrorDesc'];

					that.showKeyPrintFailure(message);
				}
				$scope.$apply();

			},
			arguments: keyData
		};

		if (sntapp.cardSwipeDebug) {
			sntapp.cardReader.writeKeyDataDebug(options);
		}
		else {
			sntapp.cardReader.writeKeyData(options);
		}

	};
	/**
	* Set the selected band type - fixed room/open charge to the band
	*/
	this.writeBandType = function(dataParams) {
		that.setStatusAndMessage($filter('translate')('WRITING_BAND_TYPE'), 'pending');
		var data = dataParams;
		var index = dataParams.index;
		var args = [];
		var bandType = '00000002';

		if (data.is_fixed) {
			bandType = '00000001';
		}
		args.push(bandType);
		args.push(that.lastSuccessfulCardIDReaded);
		args.push('19');// Block Address - hardcoded
		var options = {
			// Cordova write success callback
			'successCallBack': function(data) {
				$scope.$emit('hideLoader');
				that.numOfKeys--;
				if (that.numOfKeys === 0) {
					$scope.$emit('hideLoader');
					that.showKeyPrintSuccess();
					return true;
				}
				that.setStatusAndMessage($filter('translate')('KEY_BAND_CREATED_SUCCESSFULLY'), 'success');
				that.printKeyStatus[index - 1].printed = true;
				$scope.printedKeysCount = index;
				$scope.buttonText = 'Print key ' + (index + 1) + '/' + that.printKeyStatus.length;
				$scope.$apply();
				return;
			},
			'failureCallBack': function(errorObject) {
				$scope.$emit('hideLoader');
				that.numOfKeys--;
				if (that.numOfKeys > 0) {
					that.setStatusAndMessage($filter('translate')('KEY_BAND_CREATED_FAILED_WRITING_BANDTYPE') + ': ' + errorObject['RVErrorDesc'], 'error');
					that.printKeyStatus[index - 1].printed = true;
					$scope.printedKeysCount = index;
                                        $scope.buttonText = 'Print key ' + (index + 1) + '/' + that.printKeyStatus.length;
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

		if (sntapp.cardSwipeDebug) {
			sntapp.cardReader.setBandTypeDebug(options);
		}
		else {
			sntapp.cardReader.setBandType(options);
		}

	};
	/**
	* function used to add smartband, mainly for smartband creation while key writing
	*/
	this.addNewSmartbandWithKey = function(data, index) {
		var is_fixed = data.is_fixed;

		that.setStatusAndMessage($filter('translate')('ADDING_BAND'), 'pending');
		// success call back of smartband's api call for creation
		var successCallbackOfAddNewSmartband_ = function(data) {
			that.setStatusAndMessage($filter('translate')('BAND_ADDED'), 'success');
			$scope.$emit('showLoader');
			var params = {};

			params.index = index;
			params.is_fixed = is_fixed;
			params.account_number = data.account_number;
			that.writeBandType (params);
		};

		// failure call back of smartband's api call for creation
		var failureCallbackOfAddNewSmartband = function(errorMessage) {
			that.setStatusAndMessage($filter('translate')('KEY_CREATED_BAND_ADDING_FAILED') + ': ' + errorMessage, 'error');
			$scope.$emit('hideLoader');
			that.numOfKeys--;
			if (that.numOfKeys > 0) {
				that.printKeyStatus[index - 1].printed = true;
				$scope.printedKeysCount = index;
				$scope.buttonText = 'Print key ' + (index + 1) + '/' + that.printKeyStatus.length;
				$scope.$apply();
			}
			else {
				var message = $filter('translate')('KEY_CREATED_BAND_ADDING_FAILED') + ': ' + errorMessage;

				that.showKeyPrintFailure(message);
			}
		};
		var reservationId = '';

		if ($scope.viewFromBillScreen) {
			reservationId = $scope.reservationBillData.reservation_id;
		} else {
			reservationId = $scope.reservationData.reservation_card.reservation_id;
		}
		data.index = index;
		data.reservationId = reservationId;
		$scope.invokeApi(RVKeyPopupSrv.addNewSmartBand, (data), successCallbackOfAddNewSmartband_, failureCallbackOfAddNewSmartband);
	};

	var showPrintKeyOptions = function (status) {
		// if status === false, they are not able to connect. I dont know why these type of designs
		// we have to call failurecallback on that
		if (status === false) {
			return showDeviceNotConnected();
		}

        // if a device connected then add Tablet option and show as default
        // We are keeping -1 as id for Tablet option since it is not used anywhere in APIs
        if ($scope.showTabletOption) {
            var result = _.findWhere($scope.encoderTypes, {description: 'Tablet'});

            if (typeof result === 'undefined') {
                $scope.encoderTypes.push({
                    id: '-1',
                    description: 'Tablet'
                });
            }
            $scope.encoderSelected = '-1';
        } else {
            $scope.encoderSelected = '';
		}

		$scope.$emit('hideLoader');
		$scope.deviceConnecting = false;
		$scope.deviceNotConnected = false;
		$scope.keysPrinted = false;
		$scope.showPrintKeyOptions = true;
        // fixed as part of CICO-38352
        if (!$scope.$$phase) {
            $scope.$apply();
        }
	};

    var onDeviceConnectionSuccess = function(status) {
    	scopeState.isCheckingDeviceConnection = false;

        if (status) {
            that.setStatusAndMessage($filter('translate')('KEY_CONNECTED_STATUS'), 'success');
        }
        showPrintKeyOptions(status);
    };

	var showKeysPrinted = function() {
		$scope.$emit('hideLoader');
		$scope.deviceConnecting = false;
		$scope.keysPrinted = true;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};

	$scope.init();
	/*
	 * To handle cancel option after checkin success
	 */
    $scope.pressedCancel = function(message) {
		$scope.$emit('hideLoader');
		$scope.printKeyFailMsg = $filter('translate')('KEY_NOT_PRINTED');
		if (message !== undefined) {
			$scope.printKeyFailMsg = message;
		}
		$scope.deviceConnecting = false;
		$scope.keysPrinted = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.pressedCancelStatus = true;

		$('#encoder-type').blur();
		// TODO:verfiy if required

	};

	/*
	* Show the key print success message
	*/
	this.showKeyPrintSuccess = function() {
		showKeysPrinted();
	};

	/*
	* Show the key print failure message
	*/
	this.showKeyPrintFailure = function(message) {
		$scope.$emit('hideLoader');
		if (typeof message === 'undefined') {
			var message = $filter('translate')('KEY_CREATION_FAILED_STATUS');
		}
		$scope.pressedCancel(message);
		// Check if digest is already in progress - if not start digest
		if (!$scope.$$phase) {
			$scope.$apply();
		}

	};

	// Close popup
	$scope.closeDialog = function() {
        $scope.$emit('RESUME_OBSERVE_FOR_SWIPE_RESETS');
		ngDialog.close();
	};
	// To handle close button click
	$scope.goToStaycard = function() {
		$scope.closeDialog();
		$state.go('rover.reservation.staycard.reservationcard.reservationdetails',
				{"id": $scope.reservationBillData.reservation_id,
				"confirmationId": $scope.reservationBillData.confirm_no, "isrefresh": true});

	};
	$scope.goToSearch = function() {
		$scope.closeDialog();
		$state.go('rover.search');

	};
}]);
