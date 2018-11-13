sntZestStation.controller('zsKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsGeneralSrv',
	'$filter',
	'$timeout',
	function($scope, $stateParams, $state, zsEventConstants, zsGeneralSrv, $filter, $timeout) {

		// pickup key and checkin share this . But HTML will be differnt.
		// and use two states and two controllers inheriting this controller.
		// zest_station.checkInKeyDispense and zest_station.pickUpKeyDispense
		// include all common functions that will be shared in both screens
		// use the inherited controller for the customized actions like
		// navigation to next page or nav back

		/**
		 * [initializeMe description]
		 */
		var cardwriter = new CardOperation();
		var initializeMe = (function() {

			BaseCtrl.call(this, $scope);
			// hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

			$scope.noOfKeysCreated = 0;


		}());
		
		/**
		 * [set data from stateParams description]
		 * @type {[type]}
		 */

		$scope.selectedReservation = {
			"reservationId": $stateParams.reservation_id,
			"room": $stateParams.room_no,
			"first_name": $stateParams.first_name
		};

		/**
		 * [fetchDoorLockSettings description]
		 * @return {[type]} [description]
		 */
		var fetchDoorLockSettings = (function() {
			var onResponse = function(response) {
				var remote = (response.enable_remote_encoding) ? 'enabled' : 'disabled';

				$scope.remoteEncoding = response.enable_remote_encoding;
			};

			$scope.callAPI(zsGeneralSrv.getDoorLockSettings, {
				params: {},
				'successCallBack': onResponse
			});
		}());


		//* *************** refactoring ****************\\

		var onSuccessLocalKeyWrite = function(cardInfo) {
			callKeyFetchAPI(cardInfo);
			// then, continueFromCordovaKeyWrite();
		};

		var callKeyFetchAPI = function(cardInfo) {
			var postParams = {
				"is_additional": false,
				"reservation_id": $scope.reservation_id,
				"key": 1
					// "is_kiosk": true
			};
			
			// for debugging in production on ipad
			$scope.zestStationData.makeTotalKeys = $scope.makingKey;

			postParams.is_additional = $scope.noOfKeysCreated > 0;
			console.log('requesting additional key: [ ',postParams.is_additional,']');

			// for debugging in production on ipad
			$scope.zestStationData.makingAdditionalKey = postParams.is_additional;

			if (typeof cardInfo !== 'undefined') {
				postParams.card_info = cardInfo;
			} else {
				postParams.card_info = "";
			}
			// debugging
			var debugPostParams = {
				'reservation_id': $scope.reservation_id,
				'key': 1,
				'is_additional': false,
				'card_info': {
					'card_size': "1024",
					'card_uid': "6CEC45B3",
					'band_type': "",
					'card_type': "1"
				}

			};
			var debugging = false;

			if (debugging) {
				console.info(JSON.stringify(debugPostParams));

				$scope.callAPI(zsGeneralSrv.encodeKey, {
					params: debugPostParams,
					'successCallBack': fetchKeyDataSuccess,
					'failureCallBack': emitCordovaKeyError
				});
			} else {
				$scope.callAPI(zsGeneralSrv.encodeKey, {
					params: postParams,
					'successCallBack': fetchKeyDataSuccess,
					'failureCallBack': emitCordovaKeyError
				});
			}
		};


		$scope.$on('printLocalKeyCordova', function(evt, reservation_id, keys) {
			$scope.reservation_id = reservation_id;
			$scope.makingKey = keys;
			makeKeyViaCordova(reservation_id, keys);
		});

		$scope.saveUIDToReservation = function(uid) {
			var onResponse = function() {
				$scope.$emit("hideLoader");
			};

			$scope.callAPI(zsTabletSrv.saveUIDtoRes, {
				params: {
					reservation_id: $scope.selectedReservation.reservation_id,
					uid: uid
				},
				'successCallBack': onResponse,
				'failureCallBack': onResponse
			});
		};

		var continueFromCordovaKeyWrite = function(response) {
			// calls the pickup key controller to continue flow
			$scope.$emit('continueFromCordovaKeyWrite');
		};

		var fetchKeyDataSuccess = function(response) {
			// show loader incase of iPad
			if ($scope.writeLocally()) {
				$scope.$emit('showLoader');
			}
			$scope.keyData = response;
			writeKey($scope.keyData, $scope.makingKey);
		};

		/*
		 * Calculate the keyWrite data from the API response and call the write key method for key writing.
		 */
		var onSuccessWriteKeyDataLocal = function(response) {
			// if the setting of smart band create along with key creation enabled, we will create a smartband with open room charge
			continueFromCordovaKeyWrite(response);
		};

		/*
		 * Calls the cordova service to write the keys
		 */
		var writeKey = function(keyWriteData, index) {

			var keyData = [];

			keyData.push(JSON.stringify(keyWriteData));

			var options = {
				// Cordova write success callback. If all the keys were written sucessfully, show key success message
				// If keys left to print, call the cordova write key function to write the pending key
				'successCallBack': onSuccessWriteKeyDataLocal,
				'failureCallBack': emitCordovaKeyError,
				'arguments': keyData
			};

			$scope.cardwriter = new CardOperation();
			cardwriter.writeKeyData(options);
		};

		$scope.numberOfCordovaCalls = 0;

		var emitCordovaKeyError = function(response) {
			$scope.$emit('hideLoader');
			$scope.$emit('printLocalKeyCordovaFailed', response);

			$scope.trackSessionActivity('KEY_ENCODE_FAILURE, IPAD', response.toString(), 'R' + $scope.selectedReservation.reservationId, $scope.mode, true);
		};
		var makeKeyViaCordova = function(data, reservation_id, keys) {
			// to start writing process to a local device (ingenico | infinea), need to read the card info, then write back the respond onto the card
			if ($scope.writeLocally() && $scope.isIpad) {
				console.info('accessing card writer object to retrieve card info...');
				console.log('$scope.cardwriter: ', $scope.cardwriter);

				cardwriter.retrieveCardInfo({
					'successCallBack': onSuccessLocalKeyWrite,
					'failureCallBack': emitCordovaKeyError
				});

			} else if ($scope.isIpad) {
				// If cordova not loaded in server, or page is not yet loaded completely
				// One second delay is set so that call will repeat in 1 sec delay
				if ($scope.numberOfCordovaCalls < 50) {
					console.log('retry: ', $scope.numberOfCordovaCalls);
					setTimeout(function() {
						$scope.numberOfCordovaCalls = parseInt($scope.numberOfCordovaCalls) + parseInt(1);
						makeKeyViaCordova(data, reservation_id, keys);
					}, 2000);
				}
			} else {
				// onSuccessLocalKeyWrite();
				emitCordovaKeyError('bad config? not in ipad while trying to local encode to cordova..');
			}
		};

		/* ******************************************************************************************************* */

		var updateLogForKeyActions = function(keyNo, keyStatus) {
			if ($scope.inDemoMode()) {
				return;
			}

			$scope.resetTime();
			var params = {
				"reservation_id": $stateParams.reservation_id,
				"key_no": keyNo,
				"status": keyStatus
			};
			// console.log("reservation_id :" + $stateParams.reservation_id + " key :" + keyNo + " -----status :" + keyStatus);

			$scope.callAPI(zsGeneralSrv.logKeyStatus, {
				params: params,
				'loader': 'none' // to hide loader
			});
		};

		/**
		 * [localEncodingSuccsess description]
		 * @param  {[type]} response [description]
		 * @return {[type]}          [description]
		 */
		var localEncodingSuccsess = function(response) {
			$scope.zestStationData.makingKeyInProgress = false;
			// reset timer so as to avoid unwanted timeouts
			$scope.resetTime();
			if ($scope.inDemoMode()) {
				setTimeout(function() {
					$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
					$scope.dispenseKey();

					$scope.runDigestCycle();
				}, 2000);

			} else {
				if (response !== null && response.key_info && response.key_info[0]) {
					if (response.key_info[0].base64) {
						$scope.dispenseKeyData = response.key_info[0].base64;
						$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
						$scope.dispenseKey();

						$scope.runDigestCycle();
					} else {
						$scope.onGeneralFailureCase();
					}
				} else {
					$scope.onGeneralFailureCase();
				}
			}
		};

		var remoteEncodingSuccsess = function() {
			$scope.zestStationData.makingKeyInProgress = false;
			$scope.resetTime();
			revertFailureReason();
			$scope.noOfKeysCreated++;
			if ($scope.noOfKeysSelected === $scope.noOfKeysCreated) {
				// all keys are made
				$scope.mode = 'KEY_CREATION_SUCCESS_MODE';
				if (!$scope.inDemoMode()) {
					$scope.trackEvent('all keys encoded', 'key_encode');	
				}
				

			} else if ($scope.noOfKeysSelected > $scope.noOfKeysCreated) {
				// one key has been made out of total 2
				$scope.mode = 'KEY_ONE_CREATION_SUCCESS_MODE';
				// provide some timeout for user to grab keys
				$timeout($scope.initMakeKey(), 6000);
			}
			updateLogForKeyActions($scope.noOfKeysCreated, "success");
			$scope.runDigestCycle();
		};

		var startMakingKey = function(keyNo) {
			$scope.zestStationData.makingKeyInProgress = true;
			var onResponseSuccess;
			var params = {
				'is_additional': false,
				'is_kiosk': true,
				'key': 1,
				'reservation_id': $scope.selectedReservation.reservationId
			};

			if (keyNo) {
				params.key = keyNo;
				if (keyNo === 2) {
					params.is_additional = true;
				}
			}
			if (!$scope.remoteEncoding) {
				params.uid = null;
				onResponseSuccess = localEncodingSuccsess;
			} else {
				params.key_encoder_id = $scope.zestStationData.key_encoder_id;
				onResponseSuccess = remoteEncodingSuccsess;
			}
			$scope.resetTime();
			if ($scope.inDemoMode()) {
				setTimeout(function() {
					onResponseSuccess({
						'status': 'success'
					});
				}, 1200);
			} else {
				if ($scope.writeLocally()) {
					console.log('write locally');
					// encode / dispense key from infinea || ingenico
					// local encoding + infinea
					if ($scope.inDemoMode()) {
						setTimeout(function() {
							onSuccessWriteKeyDataLocal();
						}, 2800); // add some delay for demo purposes
					} else {

						$scope.$emit('printLocalKeyCordova', $scope.selectedReservation.reservationId, $scope.noOfKeysSelected);
						return;
					}
				} else {
					$scope.callAPI(zsGeneralSrv.encodeKey, {
						params: params,
						'loader': 'none', // to hide loader
						'successCallBack': onResponseSuccess,
						'failureCallBack': $scope.onGeneralFailureCase
					});
				}
			}
		};

		$scope.initMakeKey = function() {
			if ($scope.zestStationData.keyWriter === 'websocket') {
				$scope.remoteEncoding = false;
				console.info('starting key create with Sankyo...');
			} else {
				console.info('waiting on user to press make key, which will start key create here...');
			}
			if ($scope.noOfKeysSelected === 1) {
				$scope.mode = 'SOLO_KEY_CREATION_IN_PROGRESS_MODE';
			} else if ($scope.noOfKeysCreated === 0) {
				// one key has been made out of total 2
				$scope.mode = 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
			} else {
				// do nothing
			}

			$scope.trackSessionActivity('KEY_ENCODE', 'Make Key', 'R' + $scope.selectedReservation.reservationId, $scope.mode);

			if ($scope.remoteEncoding || $scope.zestStationData.keyWriter === 'local') {
				$scope.readyForUserToPressMakeKey = true;
				if ($scope.zestStationData.keyWriter === 'local') {
					console.warn('local encoder');
					$scope.localWriter = true; // icmp (ingenico) or infinea device
				}
			} else {
				startMakingKey();
			}
		};

		$scope.readyForUserToPressMakeKey = true;
		$scope.onReadyToPrintKey = function(keyNo) {
			if ($scope.readyForUserToPressMakeKey) {
				$scope.readyForUserToPressMakeKey = false;
				// show loader incase of iPad
				if ($scope.writeLocally()) {
					$scope.$emit('showLoader');
				}
				startMakingKey(keyNo);

            	$scope.trackEvent('MakeKey', 'user_selected');
			}
		};


		$scope.onGeneralFailureCase = function() {
			$scope.$emit('hideLoader');
			$scope.zestStationData.makingKeyInProgress = false;
			$scope.mode = 'DISPENSE_KEY_FAILURE_MODE';
			$scope.zestStationData.consecutiveKeyFailure++;
			if ($scope.zestStationData.consecutiveKeyFailure >= $scope.zestStationData.kioskOutOfOrderTreshold) {
				$scope.zestStationData.workstationOooReason = $filter('translate')('KEY_CREATION_FAILED');
				$scope.zestStationData.workstationStatus = 'out-of-order'; // go out of order when (printing or key encoding fails)
				$scope.addReasonToOOSLog('KEY_CREATION_FAILED');
				$scope.trackEvent('failure - go out of service', 'key_encode');
			} else {
				$scope.trackEvent('key-failure-mode', 'key_encode');
			}
			var keyNo = ($scope.noOfKeysCreated === 0) ? 1 : 2;

			updateLogForKeyActions(keyNo, "failed");
			$scope.resetTime();
			$scope.runDigestCycle();
		};
		/**
		 * [resetFailureReason description]
		 * we need to set the oos reason message in admin
		 */
		var revertFailureReason = function(response) {
			$scope.zestStationData.workstationOooReason = '';
			$scope.zestStationData.workstationStatus = 'in-order';
			$scope.zestStationData.consecutiveKeyFailure = 0;
		};

		/* ********************************************* Websocket key dispense starts here ***************************************/
		/**
		 * [dispenseKey description]
		 *  if webscoket ready state is not ready
		 */
		$scope.dispenseKey = function() {
			$scope.zestStationData.makingKeyInProgress = true;
			if ($scope.inDemoMode()) {
				setTimeout(function() {
					saveUIDToReservationSuccsess();
					$scope.runDigestCycle();
				}, 3500);

			} else {
				$scope.readyForUserToPressMakeKey = false;
				// check if socket is open
				if (!_.isUndefined($scope.socketOperator.returnWebSocketObject()) && $scope.socketOperator.returnWebSocketObject().readyState === 1) {
				// this param has to be set corresponding to key created
				var is_first_key = $scope.noOfKeysCreated === 0 ? 1 : 0;

				$scope.socketOperator.DispenseKey($scope.dispenseKeyData, is_first_key);
				} else {
					$scope.$emit('CONNECT_WEBSOCKET'); // connect socket
				}
			}
		};

		/**
		 * [saveUIDToReservation description]
		 * @param  {[type]} uid [description]
		 * @return {[type]}     [description]
		 */
		var saveUIDToReservationSuccsess = function() {
			// reset timer so as to avoid unwanted timeouts
			$scope.resetTime();
			$scope.noOfKeysCreated++;

			if ($scope.noOfKeysSelected === $scope.noOfKeysCreated) {
				// all keys are made
				$scope.mode = 'KEY_CREATION_SUCCESS_MODE';
				if (!$scope.inDemoMode()) {
					$scope.trackEvent('all keys encoded', 'key_encode');
				}
			} else if ($scope.noOfKeysSelected > $scope.noOfKeysCreated) {
				// if more key is needed
				$scope.mode = 'KEY_ONE_CREATION_SUCCESS_MODE';
			}
			$timeout(function() {
				$scope.readyForUserToPressMakeKey = true;
				$scope.zestStationData.makingKeyInProgress = false;

			}, 1000);
			revertFailureReason();
			updateLogForKeyActions($scope.noOfKeysCreated, "success");
		};

		var saveUIDToReservation = function(uid) {

			$scope.callAPI(zsGeneralSrv.saveUIDtoRes, {
				params: {
					reservation_id: $scope.selectedReservation.reservationId,
					uid: uid
				},
				'successCallBack': saveUIDToReservationSuccsess,
				'failureCallBack': $scope.onGeneralFailureCase
			});
		};

		$scope.showDispenserGateIsBlockedPopup = false;
		$scope.closeGateErrorWarning = function() {
			$scope.showDispenserGateIsBlockedPopup = false;
		};
		$scope.$on('DISPENSE_FAILED_AS_GATE_IS_NOT_FREE', function() {
			$scope.addReasonToOOSLog('DISPENSE_FAILED_AS_GATE_IS_NOT_FREE');
			$scope.showDispenserGateIsBlockedPopup = true;
			$timeout(function() {
				$scope.readyForUserToPressMakeKey = true;
				$scope.zestStationData.makingKeyInProgress = false;

			}, 1000);
		});

		$scope.$on('DISPENSE_SUCCESS', function(event, data) {
			$scope.zestStationData.workstationStatus = 'in-order';
			$scope.zestStationData.workstationOooReason = '';
			saveUIDToReservation(data.msg);
		});

		$scope.$on('SOCKET_CONNECTED', function() {
			$scope.dispenseKey();
		});

		$scope.$on('DISPENSE_FAILED', function() {
			$scope.zestStationData.makingKeyInProgress = false;
			$scope.addReasonToOOSLog('DISPENSE_FAILED');
			$scope.onGeneralFailureCase();
		});
		$scope.$on('SOCKET_FAILED', function() {
			if ($scope.noOfKeysSelected !== $scope.noOfKeysCreated) {
				$scope.zestStationData.workstationOooReason = $filter('translate')('SOCKET_FAILED');
				$scope.addReasonToOOSLog('SOCKET_FAILED');
				$scope.onGeneralFailureCase();
			}
		});
		$scope.$on('DISPENSE_CARD_EMPTY', function() {
			$scope.zestStationData.workstationOooReason = $filter('translate')('KEYS_EMPTY');
			$scope.addReasonToOOSLog('DISPENSER_EMPTY');
			$scope.onGeneralFailureCase();
		});

		/* ********************************************* Websocket key dispense starts here ***************************************/

		/* ********************************************* iPad Operations Starts here       ***************************************/

		$scope.$on('printLocalKeyCordovaFailed', function(evt, response) {
			console.warn('error: ', response);
			$scope.onGeneralFailureCase();
		});

		$scope.$on('continueFromCordovaKeyWrite', function() {
			$scope.$emit('hideLoader');
			remoteEncodingSuccsess();
		});

		/* ********************************************* iPad Operations Starts here ***************************************/


		/**
		 * [reEncodeKey on failure we will retry]
		 * @return {[type]} [description]
		 */
		$scope.reEncodeKey = function() {
            $scope.trackEvent('retry key encode', 'user_selected');

            $scope.resetTime();
			var executeKeyOperations = function() {
				if ($scope.zestStationData.keyWriter === 'websocket') {
					if($scope.noOfKeysCreated === 0){
						// when no key is created dipense keys
						// provide some timeout for user to grab keys
						$timeout($scope.dispenseKey, 2000);
					}
					else{
						// need to show button to dispense key
						$timeout(function() {
							$scope.readyForUserToPressMakeKey = true;
						}, 1000);
					}
				} else {
					$timeout(function() {
						$scope.readyForUserToPressMakeKey = true;
					}, 1000);
				}
			};

			// check if one of the selected no of keys was created or not
			if ($scope.noOfKeysCreated === 1 && $scope.noOfKeysSelected === 2) {
				$scope.mode = 'KEY_ONE_SUCCESS_KEY_TWO_FAILED';
				executeKeyOperations();
			} else {
				$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
				executeKeyOperations();
			}
		};

		/**
         * [makeKeys description]
         * @param  {[type]} no_of_keys [description]
         * @return {[type]}            [description]
         */
        $scope.makeKeys = function(no_of_keys) {
            $scope.noOfKeysSelected = no_of_keys;
            $scope.initMakeKey();
        };


	}
]);