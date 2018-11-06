sntZestStation.controller('zsPickupKeyFindReservationCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckoutSrv',
	'$stateParams',
	'$timeout',
	'zsCheckinSrv',
	'zsGeneralSrv',
	'$controller',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckoutSrv, $stateParams, $timeout, zsCheckinSrv, zsGeneralSrv, $controller) {

		(function init() {
			BaseCtrl.call(this, $scope);
			$controller('zsPaymentCtrl', {
				$scope: $scope
			});
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function() {
				$state.go('zest_station.home');
			});
			$scope.setScreenIcon('key');
			$scope.mode = 'LAST_NAME_ENTRY';
			$scope.mainScreenMode = 'FIND_RESERVATION';
			$scope.reservationParams = {
				'last_name': '',
				'room_no': ''
			};
			$scope.creditCardNumber = '';
			$scope.reservationData = {};
			$scope.hideAddCardOption = $scope.zestStationData.paymentGateway === 'MLI' &&
					$scope.zestStationData.hotelSettings.mli_cba_enabled ||
				$scope.zestStationData.paymentGateway === 'CBA';

		})();

		var dismissKeyBoardActions = function() {
			$scope.hideKeyboardIfUp();
			$scope.callBlurEventForIpad();
			$scope.resetTime();
		};

		var generalFailureActions = function() {
			$scope.mode = 'NO_MATCH';
			dismissKeyBoardActions();
		};

		/* ********************************************************************************************** */
		/*                If the reservation is not checked in, proceed to checkin flow                   */
		/* ********************************************************************************************** */

		var fetchDetailsForCheckingIn = function(reservation_id) {

			var goToCheckinFlow = function(response) {
				zsCheckinSrv.setSelectedCheckInReservation(response.results);
				var primaryGuest = _.find(response.results[0].guest_details, function(guest_detail) {
					return guest_detail.is_primary === true;
				});

				$state.go('zest_station.checkInReservationDetails', {
					'first_name': primaryGuest.first_name,
					'pickup_key_mode': 'manual'
				});
			};
			var options = {
				params: {
					'reservation_id': reservation_id
				},
				successCallBack: goToCheckinFlow,
				failureCallBack: generalFailureActions
			};

			$scope.callAPI(zsGeneralSrv.fetchCheckinReservationDetails, options);
		};

		/* ********************************************************************************************** */
		/*  If scan option is turned ON and ID wasn't scanned during checkin, scan ID in pickupkey flow   */
		/* ********************************************************************************************** */

		var fetchDetailsForIdScanning = function(reservation_id, stateParams) {
			var onSuccess = function(response) {
				zsCheckinSrv.setSelectedCheckInReservation(response.results); // important
				if ($scope.zestStationData.kiosk_manual_id_scan) {
                    stateParams.mode = 'PICKUP_KEY';
                    stateParams.reservation_id = reservation_id;
                    $state.go('zest_station.checkInIdVerification', {
                        params: JSON.stringify(stateParams)
                    });
                } else {
					$state.go('zest_station.checkInScanPassport', stateParams);
                }
			};
			var options = {
				params: {
					'reservation_id': reservation_id
				},
				successCallBack: onSuccess,
				failureCallBack: generalFailureActions
			};

			$scope.callAPI(zsGeneralSrv.fetchCheckinReservationDetails, options);
		};

		var fetchGuestDetails = function(data, stateParams) {
			var successCallBack = function(guest_details) {
				if (!$scope.reservationHasPassportsScanned(guest_details) && (!guest_details.primary_guest_details.guest_id_reviewed || $scope.zestStationData.pickup_key_always_ask_for_id)) {
					$scope.zestStationData.continuePickupFlow = function() {
						goToKeyDispense(stateParams);
					};
					stateParams.from_pickup_key = true;
					fetchDetailsForIdScanning(data.reservation_id, stateParams);
				} else {
					goToKeyDispense(stateParams);
				}
			};
			var options = {
				params: {
					'id': data.reservation_id
				},
				successCallBack: successCallBack,
				failureCallBack: generalFailureActions
			};

			$scope.callAPI(zsGeneralSrv.fetchGuestDetails, options);
		};

		var goToKeyDispense = function(stateParams) {
			$state.go('zest_station.pickUpKeyDispense', stateParams);
		};


		var onCCVerificationSuccess = function() {
			if ($scope.reservationData.is_checked_in) {
				var stateParams = {
					'reservation_id': $scope.reservationData.reservation_id,
					'room_no': $scope.reservationParams.room_no,
					'first_name': $scope.reservationData.first_name
				};

				// Check if ID scan is required
				if ($scope.zestStationData.check_in_collect_passport || $scope.zestStationData.kiosk_manual_id_scan) {
					fetchGuestDetails($scope.reservationData, stateParams);
				} else {
					goToKeyDispense(stateParams);
				}
			} else {
				// if the reservation is not checked in, procced to checkin
				if (!$scope.reservationData.is_checked_in && $scope.reservationData.guest_arriving_today) {
					fetchDetailsForCheckingIn($scope.reservationData.reservation_id);
				} else {
					generalFailureActions();
				}
			}
		};

		$scope.validateCConFile = function() {
			$scope.callBlurEventForIpad();
			var onCCVerificationFailure = function() {
				$scope.mode = 'CC_MATCH_FAILED';
			};
			var options = {
				params: {
					'last_four_cc_digits': $scope.creditCardNumber,
					'id': $scope.reservationData.reservation_id,
                    'application': 'KIOSK'
				},
				successCallBack: onCCVerificationSuccess,
				failureCallBack: onCCVerificationFailure
			};

			$scope.callAPI(zsCheckoutSrv.validateCC, options);
		};

		$scope.reEnterCC = function() {
			$scope.mode = 'CC_ENTRY';
			$scope.focusInputField('credit-card');
		};

		var searchReservation = function() {
			var findReservationSuccess = function(data) {
				$scope.reservationData = data;
				if (!data.is_checked_in && !data.guest_arriving_today || data.is_checked_out) {
					generalFailureActions();
				} else {
					if ($scope.reservationData.has_cc) {
						$scope.mode = $scope.hideAddCardOption ? 'CC_ENTRY' : 'CC_OPTIONS';
						$scope.focusInputField('credit-card');
					} else {
						$scope.mode = 'NO_CC_ON_FILE';
					}
				}
			};
			var params = {
				'last_name': $scope.reservationParams.last_name,
				'room_no': $scope.reservationParams.room_no + ''.replace(/\-/g, '') // adding '' to for non-str values
			};
			var options = {
				params: params,
				successCallBack: findReservationSuccess,
				failureCallBack: generalFailureActions
			};

			$scope.callAPI(zsCheckoutSrv.findReservation, options);
		};

		$scope.lastNameEntered = function() {
			dismissKeyBoardActions();
			// if room is already entered, no need to enter again
			if ($scope.reservationParams.room_no.length > 0) {
				searchReservation();
			} else if ($scope.reservationParams.last_name.length > 0) {
				$scope.mode = 'ROOM_NUMBER_ENTRY';
				$scope.focusInputField('room-number');
			}
		};

		$scope.roomNumberEntered = function() {
			dismissKeyBoardActions();
			if ($scope.reservationParams.room_no.length > 0) {
				searchReservation();
			}
		};

		$scope.reEnterText = function(type) {
			dismissKeyBoardActions();
			if (type === 'room') {
				$scope.mode = 'ROOM_NUMBER_ENTRY';
				$scope.focusInputField('room-number');
			} else {
				$scope.mode = 'LAST_NAME_ENTRY';
				$scope.focusInputField('last-name');
			}
		};

		/* CC actions starts here */

		$scope.useNewCard = function () {
			$scope.mainScreenMode = 'PAYMENT_IN_PROGRESS';
			$scope.reservation_id = $scope.reservationData.reservation_id;
			$scope.screenMode.paymentAction = 'ADD_CARD'; 
			$scope.payUsingNewCard();
		};

		$scope.$on('SAVE_CC_SUCCESS', function() {
			$timeout(function() {
				onCCVerificationSuccess();

			}, 200);
		});

		$scope.$on('PAYMENT_FAILED', function() {
			$scope.mainScreenMode = 'PAYMENT_FAILED';
		});

	}
]);
