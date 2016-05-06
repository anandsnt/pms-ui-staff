sntZestStation.controller('zsCheckinKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'zsGeneralSrv',
	'$timeout',
	'$filter',
	function($scope, $stateParams, $state, zsEventConstants, $controller, zsGeneralSrv, $timeout, $filter) {

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
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.mode = "DISPENSE_KEY_MODE";
		}();

		var stateParams = {
			'guest_id': $stateParams.guest_id,
			'email': $stateParams.email,
			'reservation_id': $stateParams.reservation_id,
			'room_no': $stateParams.room_no,
			'first_name': $stateParams.first_name
		}


		$scope.reEncodeKey = function() {
			$scope.mode = "DISPENSE_KEY_MODE";
		};

		var changePageModeToFailure = function(){
			$scope.mode = "DISPENSE_KEY_FAILRURE_MODE";
			$scope.runDigestCycle();
		};
		/**
		 * [setFailureReason description]
		 * we need to set the oos reason message in admin
		 */
		var onGeneralFailureCase = function(response) {
			$scope.zestStationData.workstationOooReason = $filter('translate')('CHECKIN_KEY_FAIL');
			$scope.zestStationData.workstationStatus = 'out-of-order';
			changePageModeToFailure();
		};

		/**
		 * [dispenseKey description]
		 *  if webscoket ready state is not ready
		 */
		var dispenseKey = function() {
			//check if socket is open
			if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
				$scope.socketOperator.DispenseKey($scope.dispenseKeyData);
			} else {
				$scope.$emit('CONNECT_WEBSOCKET'); // connect socket
			}
		};

		

		var noOfKeysCreated = 0;
		/**
		 * [saveUIDToReservation description]
		 * @param  {[type]} uid [description]
		 * @return {[type]}     [description]
		 */
		var saveUIDToReservation = function(uid) {
			var saveUIDToReservationSuccsess = function() {
				noOfKeysCreated++;

				if ($scope.noOfKeysSelected === noOfKeysCreated) {
					//all keys are made
					$scope.mode = "KEY_CREATION_SUCCESS_MODE";
				} else if ($scope.noOfKeysSelected > noOfKeysCreated) {
					//if more key is needed
					$scope.mode = "KEY_ONE_CREATION_SUCCESS_MODE";
					//provide some timeout for user to grab keys
					$timeout(dispenseKey, 6000);
				}
			};
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
			$scope.zestStationData.workstationOooReason = "";
			saveUIDToReservation(data.msg);
		});
		$scope.$on('DISPENSE_FAILED', function(event, data) {
			onGeneralFailureCase();
		});
		$scope.$on('SOCKET_FAILED', function() {
			$scope.zestStationData.workstationOooReason = $filter('translate')('SOCKET_FAILED');
			$scope.zestStationData.workstationStatus = 'out-of-order';
			changePageModeToFailure();
		});
		$scope.$on('DISPENSE_CARD_EMPTY', function() {
			$scope.zestStationData.workstationOooReason = $filter('translate')('CHECKIN_KEY_FAIL_EMPTY');
			$scope.zestStationData.workstationStatus = 'out-of-order';
			changePageModeToFailure();
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
			if (response.key_info && response.key_info[0]) {
				if (response.key_info[0].base64) {
					$scope.dispenseKeyData = response.key_info[0].base64;
					$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
					dispenseKey();
				}
			} else {
				onGeneralFailureCase();
			}
		};
		/**
		 * [initMakeKey description]
		 * @return {[type]} [description]
		 */
		var initMakeKey = function() {
			var onResponseSuccess;
			var params = {
				"is_additional": false,
				"is_kiosk": true,
				"key": 1,
				"reservation_id": $scope.selectedReservation.reservationId
			};

			if (!$scope.remoteEncoding) {
				params.uid = null;
				onResponseSuccess = localEncodingSuccsess;
			} else {
				if ($scope.noOfKeysSelected === 1) {
					$scope.mode = 'SOLO_KEY_CREATION_IN_PROGRESS_MODE';
				} else if (noOfKeysCreated === 0) {
					//one key has been made out of total 2
					$scope.mode = 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
				} else {
					//do nothing
				}
				params.key_encoder_id = $scope.zestStationData.key_encoder_id;
				onResponseSuccess = remoteEncodingSuccsess;
			};

			$scope.callAPI(zsGeneralSrv.encodeKey, {
				params: params,
				"loader": "none", //to hide loader
				'successCallBack': onResponseSuccess,
				'failureCallBack': onGeneralFailureCase
			});
		};

		function remoteEncodingSuccsess(response) {
			noOfKeysCreated++;
			if ($scope.noOfKeysSelected === noOfKeysCreated) {
				//all keys are made
				$scope.mode = "KEY_CREATION_SUCCESS_MODE";
			} else if ($scope.noOfKeysSelected > noOfKeysCreated) {
				//one key has been made out of total 2
				$scope.mode = "KEY_ONE_CREATION_SUCCESS_MODE";
				//provide some timeout for user to grab keys
				$timeout(initMakeKey, 6000);
			}
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


		$scope.goToNextScreen = function(status) {
			stateParams.key_success = status ==='success'; 
			$state.go('zest_station.zsCheckinBillDeliveryOptions', stateParams);
		};

	}
]);