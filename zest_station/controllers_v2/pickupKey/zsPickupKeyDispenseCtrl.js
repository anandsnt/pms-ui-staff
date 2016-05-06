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
			//check if socket is open
			if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
				$scope.socketOperator.DispenseKey($scope.dispenseKeyData);
			} else {
				$scope.$emit('CONNECT_WEBSOCKET'); // connect socket
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
			if (response.key_info && response.key_info[0]) {
				if (response.key_info[0].base64) {
					$scope.dispenseKeyData = response.key_info[0].base64;
					$scope.mode = $scope.noOfKeysSelected === 1 ? 'SOLO_KEY_CREATION_IN_PROGRESS_MODE' : 'KEY_ONE_CREATION_IN_PROGRESS_MODE';
					dispenseKey();
				}
			} else {
				setFailureReason();
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
				'failureCallBack': setFailureReason
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

	}
]);