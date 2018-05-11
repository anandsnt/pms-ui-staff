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
	function($scope, $rootScope, $state, zsEventConstants, zsCheckoutSrv, $stateParams, $timeout, zsCheckinSrv, zsGeneralSrv) {

		BaseCtrl.call(this, $scope);

		$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
		$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function() {
			$state.go('zest_station.home');
		});
		$scope.setScreenIcon('key');
		$scope.mode = 'LAST_NAME_ENTRY';
		$scope.reservationParams = {
			'last_name': 'AAAA',
			'room_no': 'wv101'
		};

		var dismissKeyBoardActions = function () {
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

		var fetchReservationDetailsForCheckingIn = function(reservation_id) {

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

		var fetchReservationForPassportScanning = function(reservation_id, stateParams) {
			var onSuccess = function(response) {
				zsCheckinSrv.setSelectedCheckInReservation(response.results); // important
				$state.go('zest_station.checkInScanPassport', stateParams);
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
				if (!$scope.reservationHasPassportsScanned(guest_details)) {
					$scope.zestStationData.continuePickupFlow = function() {
						goToKeyDispense(stateParams);
					};
					stateParams.from_pickup_key = true;
					fetchReservationForPassportScanning(data.reservation_id, stateParams);
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

		var searchReservation = function() {
			var checkoutVerificationSuccess = function(data) {
				if (typeof data !== typeof undefined) {
					$scope.reservation_id = data.reservation_id ? data.reservation_id : 'UNDEFINED';
				}
				if (data.is_checked_in) {
					var stateParams = {
						'reservation_id': data.reservation_id,
						'room_no': $scope.reservationParams.room_no,
						'first_name': data.first_name
					};
					if ($scope.zestStationData.check_in_collect_passport) {
						fetchGuestDetails(data, stateParams);
					} else {
						goToKeyDispense(stateParams);
					}
				} else {
					if (!data.is_checked_in && data.guest_arriving_today) {
						fetchReservationDetailsForCheckingIn(data.reservation_id);
					} else {
						generalFailureActions();
					}
				}
			};
			var params = {
				'checked_in': true,
				'last_name': $scope.reservationParams.last_name,
				'room_no': $scope.reservationParams.room_no + ''.replace(/\-/g, '') // adding '' to for non-str values
			};
			var options = {
				params: params,
				successCallBack: checkoutVerificationSuccess,
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
			$scope.reservationParams.room_no.length > 0 ? searchReservation() : '';
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
	}
]);