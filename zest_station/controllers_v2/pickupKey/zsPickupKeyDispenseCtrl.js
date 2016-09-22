sntZestStation.controller('zsPickupKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'zsGeneralSrv',
	'$timeout',
	'$filter',
	function($scope, $stateParams, $state, zsEventConstants, $controller, zsGeneralSrv, $timeout, $filter) {

		/**********************************************************************************************
		 **		Expected state params -----> reservation_id, room_no and first_name'			  
		 **		Exit function -> clickedOnCloseButton- root ctrl function						
		 **																		 
		 ***********************************************************************************************/

		/**
		 *    MODES inside the page
		 *    
		 * 1. DISPENSE_KEY_MODE -> select No of keys
		 * 2. DISPENSE_KEY_FAILRURE_MODE -> failure mode
		 * 3. SOLO_KEY_CREATION_IN_PROGRESS_MODE -> one key selected case
		 * 4. KEY_ONE_CREATION_IN_PROGRESS_MODE -> 2 key selected, 1st in progress
		 * 5. KEY_ONE_CREATION_SUCCESS_MODE -> 2 key selected, 1st completed
		 * 6. KEY_CREATION_SUCCESS_MODE -> all requested keys were created
		 */

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			// All the common actions for dispensing keys are to be included in
			// zsKeyDispenseCtrl
			$controller('zsKeyDispenseCtrl', {
				$scope: $scope
			});
			$scope.mode = "DISPENSE_KEY_MODE";
			$scope.readyForUserToPressMakeKey = true;
		}();

		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			if ($scope.zestStationData.pickup_qr_scan) {
				$state.go('zest_station.qrPickupKey');
			} else {
				$state.go('zest_station.checkOutReservationSearch', {
					'mode': 'PICKUP_KEY'
				});
			}
		});

		//handling style in ctrl, so as not to mess up style sheet
		//this is a small style addition
		var marginTop = $scope.zestStationData.show_room_number ? '40px' : '0px';
		$scope.doneButtonStyle = {
			'margin-top': marginTop
		};

		$scope.reEncodeKey = function() {
			$scope.mode = "DISPENSE_KEY_MODE";
		};

		var onGeneralFailureCase = function() {
			$scope.mode = "DISPENSE_KEY_FAILRURE_MODE";
			$scope.runDigestCycle();
		};
		/**
		 * [dispenseKey description]
		 *  if webscoket ready state is not ready
		 */
		var dispenseKey = function() {
			if ($scope.inDemoMode()) {
				setTimeout(function() {
					saveUIDToReservationSuccsess();
					$scope.runDigestCycle();
				}, 3500);

			} else {
				//check if socket is open
				if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
					$scope.socketOperator.DispenseKey($scope.dispenseKeyData);
				} else {
					$scope.$emit('CONNECT_WEBSOCKET'); // connect socket
				}
			}
		};

		/**
		 * [setFailureReason description]
		 * we need to set the oos reason message in admin
		 */
		var setFailureReason = function(response) {
			$scope.zestStationData.workstationOooReason = $filter('translate')('PICKUP_KEY_FAIL');
			$scope.zestStationData.workstationStatus = 'out-of-order';
			onGeneralFailureCase();
		};

		/**
		 * [resetFailureReason description]
		 * we need to set the oos reason message in admin
		 */
		var revertFailureReason = function(response) {
			$scope.zestStationData.workstationOooReason = "";
			$scope.zestStationData.workstationStatus = 'in-order';
		};

		var noOfKeysCreated = 0;
		/**
		 * [saveUIDToReservation description]
		 * @param  {[type]} uid [description]
		 * @return {[type]}     [description]
		 */
		var saveUIDToReservationSuccsess = function() {
			noOfKeysCreated++;

			if ($scope.noOfKeysSelected === noOfKeysCreated) {
				//all keys are made
				$scope.mode = "KEY_CREATION_SUCCESS_MODE";
				revertFailureReason();
			} else if ($scope.noOfKeysSelected > noOfKeysCreated) {
				//if more key is needed
				$scope.mode = "KEY_ONE_CREATION_SUCCESS_MODE";
				revertFailureReason();
				//provide some timeout for user to grab keys
				$timeout(dispenseKey, 6000);
			}
		};
		var saveUIDToReservation = function(uid) {
			$scope.callAPI(zsGeneralSrv.saveUIDtoRes, {
				params: {
					reservation_id: $scope.selectedReservation.reservationId,
					uid: uid
				},
				'successCallBack': saveUIDToReservationSuccsess,
				'failureCallBack': onGeneralFailureCase
			});
		};

		$scope.$on('DISPENSE_SUCCESS', function(event, data) {
			$scope.zestStationData.workstationStatus = 'in-order';
			saveUIDToReservation(data.msg);
		});
		$scope.$on('DISPENSE_FAILED', function(event, data) {
			onGeneralFailureCase();
		});
		$scope.$on('SOCKET_FAILED', function() {
			$scope.zestStationData.workstationOooReason = $filter('translate')('SOCKET_FAILED');
			$scope.zestStationData.workstationStatus = 'out-of-order';
			onGeneralFailureCase();
		});
		$scope.$on('DISPENSE_CARD_EMPTY', function() {
			$scope.zestStationData.workstationOooReason = $filter('translate')('PICKUP_KEY_FAIL_EMPTY');
			$scope.zestStationData.workstationStatus = 'out-of-order';
			onGeneralFailureCase();
		});
		$scope.$on('SOCKET_CONNECTED', function() {
			dispenseKey();
		});

		/**
		 * [localEncodingSuccsess description]
		 * @param  {[type]} response [description]
		 * @return {[type]}          [description]
		 */
		var localEncodingSuccsess = function(response) {
			if ($scope.inDemoMode()) {
				setTimeout(function() {
					$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
					dispenseKey();

					$scope.runDigestCycle();
				}, 2000);

			} else {
				if (response !== null && response.key_info && response.key_info[0]) {
					if (response.key_info[0].base64) {
						$scope.dispenseKeyData = response.key_info[0].base64;
						$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
						dispenseKey();

						$scope.runDigestCycle();
					} else {
						setFailureReason();
					}
				} else {
					setFailureReason();
				}
			}
		};
		/**
		 * [initMakeKey description]
		 * @return {[type]} [description]
		 */
		$scope.$on('printLocalKeyCordovaFailed', function(evt, response) {
			console.warn('error: ', response);
			onGeneralFailureCase();
		});

		$scope.$on('continueFromCordovaKeyWrite', function() {
			remoteEncodingSuccsess();
		});

		var startMakingKey = function(keyNo) {
			var onResponseSuccess;
			var params = {
				"is_additional": false,
				"is_kiosk": true,
				"key": 1,
				"reservation_id": $scope.selectedReservation.reservationId
			};

			if (keyNo) {
				params.key = keyNo;
				if (keyNo === 2) {
					params.is_additional = true;
				}
			};

			if (!$scope.remoteEncoding) {
				params.uid = null;
				onResponseSuccess = localEncodingSuccsess;
			} else {
				params.key_encoder_id = $scope.zestStationData.key_encoder_id;
				onResponseSuccess = remoteEncodingSuccsess;
			};


			if ($scope.inDemoMode()) {
				setTimeout(function() {
					onResponseSuccess({
						'status': 'success'
					});
				}, 1200);
			} else {
				if ($scope.writeLocally()) {
					console.log('write locally');
					//encode / dispense key from infinea || ingenico
					//local encoding + infinea
					if ($scope.inDemoMode()) {
						setTimeout(function() {
								onSuccessWriteKeyDataLocal();
							}, 2800) //add some delay for demo purposes
					} else {
						$scope.$emit('printLocalKeyCordova', $scope.selectedReservation.reservationId, $scope.noOfKeysSelected);
						return;
					};
				} else {
					$scope.callAPI(zsGeneralSrv.encodeKey, {
						params: params,
						"loader": "none", //to hide loader
						'successCallBack': onResponseSuccess,
						'failureCallBack': setFailureReason
					});
				}

			}
		};


		var initMakeKey = function() {
			if ($scope.zestStationData.keyWriter === 'websocket'){
				$scope.remoteEncoding = false;
				console.info('starting key create with Sankyo...');
			} else {
				console.info('waiting on user to press make key, which will start key create here...');
			}
			if ($scope.noOfKeysSelected === 1) {
				$scope.mode = 'SOLO_KEY_CREATION_IN_PROGRESS_MODE';
			} else if (noOfKeysCreated === 0) {
				//one key has been made out of total 2
				$scope.mode = 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
			} else {
				//do nothing
			}
			if ($scope.remoteEncoding || $scope.zestStationData.keyWriter === 'local') {
				$scope.readyForUserToPressMakeKey = true;
				if ($scope.zestStationData.keyWriter === 'local') {
					console.warn('local encoder')
					$scope.localWriter = true; //icmp (ingenico) or infinea device
				}
			} else {
				startMakingKey();
			}
		};


		$scope.onReadyToPrintKey = function(keyNo) {
			if ($scope.readyForUserToPressMakeKey) {
				$scope.readyForUserToPressMakeKey = false;
				startMakingKey(keyNo);
			}
		};



		function remoteEncodingSuccsess(response) {
			noOfKeysCreated++;
			if ($scope.noOfKeysSelected === noOfKeysCreated) {
				//all keys are made
				$scope.mode = "KEY_CREATION_SUCCESS_MODE";
				revertFailureReason();
			} else if ($scope.noOfKeysSelected > noOfKeysCreated) {
				//one key has been made out of total 2
				$scope.mode = "KEY_ONE_CREATION_SUCCESS_MODE";
				revertFailureReason();
				//provide some timeout for user to grab keys
				$timeout(initMakeKey, 3000);
			}
			$scope.runDigestCycle();
		};


		/**
		 * [makeKeys description]
		 * @param  {[type]} no_of_keys [description]
		 * @return {[type]}            [description]
		 */
		$scope.makeKeys = function(no_of_keys) {
			$scope.noOfKeysSelected = no_of_keys;
			initMakeKey();
		};

	}
]);