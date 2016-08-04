sntZestStation.controller('zsKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsGeneralSrv) {

		//pickup key and checkin share this . But HTML will be differnt.
		//and use two states and two controllers inheriting this controller.
		//zest_station.checkInKeyDispense and zest_station.pickUpKeyDispense
		//include all common functions that will be shared in both screens
		//use the inherited controller for the customized actions like
		//navigation to next page or nav back

		/**
		 * [initializeMe description]
		 */
		var cardwriter = new CardOperation();
		var initializeMe = function() {

			BaseCtrl.call(this, $scope);
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);


		}();
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
		var fetchDoorLockSettings = function() {
			var onResponse = function(response) {
				var remote = (response.enable_remote_encoding) ? 'enabled' : 'disabled';
				$scope.remoteEncoding = response.enable_remote_encoding;
			};
			$scope.callAPI(zsGeneralSrv.getDoorLockSettings, {
				params: {},
				'successCallBack': onResponse
			});
		}();


		//**************** refactoring ****************\\

		var onSuccessLocalKeyWrite = function(cardInfo) {
			callKeyFetchAPI(cardInfo);
			//then, continueFromCordovaKeyWrite();
		};

		var callKeyFetchAPI = function(cardInfo) {
			var postParams = {
				"is_additional": false,
				"reservation_id": $scope.reservation_id,
				"key": 1,
				//"is_kiosk": true
			};
			if ($scope.makingKey === 1) {
                postParams.is_additional = false;
            } else {
                postParams.is_additional = true;
            }

			if (typeof cardInfo !== 'undefined') {
				postParams.card_info = cardInfo;
			} else {
				postParams.card_info = "";
			}
			//debugging
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

			}
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
			//calls the pickup key controller to continue flow
			$scope.$emit('continueFromCordovaKeyWrite');
		};

		var fetchKeyDataSuccess = function(response) {
			$scope.keyData = response;
			writeKey($scope.keyData, $scope.makingKey);
		};

		/*
		 * Calculate the keyWrite data from the API response and call the write key method for key writing.
		 */
		var onSuccessWriteKeyDataLocal = function(response) {
			//if the setting of smart band create along with key creation enabled, we will create a smartband with open room charge
			continueFromCordovaKeyWrite(response);
		};

		/*
		 * Calls the cordova service to write the keys
		 */
		var writeKey = function(keyWriteData, index) {

			var keyData = [];
			keyData.push(JSON.stringify(keyWriteData));

			var options = {
				//Cordova write success callback. If all the keys were written sucessfully, show key success message
				//If keys left to print, call the cordova write key function to write the pending key
				'successCallBack': onSuccessWriteKeyDataLocal,
				'failureCallBack': emitCordovaKeyError,
				'arguments': keyData
			};

			$scope.cardwriter = new CardOperation();
			cardwriter.writeKeyData(options);
		};

		$scope.numberOfCordovaCalls = 0;

		var emitCordovaKeyError = function(response) {
			$scope.$emit('printLocalKeyCordovaFailed', response);
		}
		var makeKeyViaCordova = function(data, reservation_id, keys) {
			//to start writing process to a local device (ingenico | infinea), need to read the card info, then write back the respond onto the card
			if ($scope.writeLocally() && $scope.isIpad) {
				console.info('accessing card writer object to retrieve card info...');
				console.log('$scope.cardwriter: ', $scope.cardwriter)

				cardwriter.retrieveCardInfo({
					'successCallBack': onSuccessLocalKeyWrite,
					'failureCallBack': emitCordovaKeyError
				});

			} else if ($scope.isIpad) {
				//If cordova not loaded in server, or page is not yet loaded completely
				//One second delay is set so that call will repeat in 1 sec delay
				if ($scope.numberOfCordovaCalls < 50) {
					console.log('retry: ', $scope.numberOfCordovaCalls);
					setTimeout(function() {
						$scope.numberOfCordovaCalls = parseInt($scope.numberOfCordovaCalls) + parseInt(1);
						makeKeyViaCordova(data, reservation_id, keys);
					}, 2000);
				}
			} else {
				//onSuccessLocalKeyWrite();
				emitCordovaKeyError('bad config? not in ipad while trying to local encode to cordova..');
			}
		};



	}
]);