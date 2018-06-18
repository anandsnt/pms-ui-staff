	sntZestStation.controller('zsCheckinVerifyIdCtrl', [
		'$scope',
		'$state',
		'zsEventConstants',
		'$stateParams',
		'zsGeneralSrv',
		'zsCheckinSrv',
		'zsUtilitySrv',
		function($scope, $state, zsEventConstants, $stateParams, zsGeneralSrv, zsCheckinSrv, zsUtilitySrv) {


			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.screenMode = 'WAIT_FOR_STAFF';
			$scope.adminPin = '';
			$scope.showWarningPopup = false;
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
			var stateParams = JSON.parse($stateParams.params);
			var verfiedStaffId = '';
			var apiParams = {
				guests_accepted_with_id: [],
				guests_accepted_without_id: []
			};
			var allGuestsAreVerified;

			$scope.adminVerify = function() {
				$scope.screenMode = 'ADMIN_PIN_ENTRY';
			};

			$scope.goToNext = function() {
				var successCallback = function(response) {
					verfiedStaffId = response.id;
					$scope.screenMode = 'GUEST_LIST';
				};
				var failureCallback = function() {
					$scope.screenMode = 'PIN_ERROR';
				};
				var options = {
					params: {
						'pin': $scope.adminPin
					},
					successCallBack: successCallback,
					failureCallBack: failureCallback
				};

				if ($scope.inDemoMode()) {
					successCallback({
						id: 123
					});
				} else {
					$scope.callAPI(zsGeneralSrv.verifyStaffByPin, options);
				}

			};

			$scope.retryPinEntry = function() {
				$scope.screenMode = 'ADMIN_PIN_ENTRY';
			};

			var checkIfEmailIsBlackListedOrValid = function() {
				// from some states mail is sent as guest_email and some email
				var email = !stateParams.guest_email ? '' : stateParams.guest_email;

				return email.length > 0 && !(stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail(email);
			};
			var afterGuestCheckinCallback = function() {
				$scope.checkinInProgress = false;
				// if email is valid and is not blacklisted
				var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid();
				var nextStateParams = {
					'guest_id': stateParams.guest_id,
					'reservation_id': stateParams.reservation_id,
					'room_no': stateParams.room_no,
					'first_name': stateParams.first_name,
					'email': stateParams.guest_email
				};

				console.log(nextStateParams);

				if ($scope.zestStationData.is_kiosk_ows_messages_active) {
					$scope.setScreenIcon('checkin');
					$state.go('zest_station.checkinSuccess', nextStateParams);
				}
				// if collectiing nationality after email, but email is already valid
				else if ($scope.zestStationData.check_in_collect_nationality && haveValidGuestEmail) {
					$state.go('zest_station.collectNationality', nextStateParams);
				} else if (haveValidGuestEmail) {
					$state.go('zest_station.checkinKeyDispense', nextStateParams);
				} else {
					$state.go('zest_station.checkInEmailCollection', nextStateParams);
				}
			};

			var checkinGuest = function() {
				var stateParams = JSON.parse($stateParams.params);
				var checkinParams = {
					'reservation_id': stateParams.reservation_id,
					'workstation_id': $scope.zestStationData.set_workstation_id,
					'authorize_credit_card': false,
					'do_not_cc_auth': false,
					'is_promotions_and_email_set': false,
					'is_kiosk': true,
					'signature': stateParams.signature
				};
				var options = {
					params: checkinParams,
					successCallBack: afterGuestCheckinCallback,
					failureCallBack: function() {
						var stateParams = {
							'message': 'Checkin Failed.'
						};
						$state.go('zest_station.speakToStaff', stateParams);
						$scope.checkinInProgress = false;
					}
				};

				console.log(options);

				if ($scope.inDemoMode()) {
					afterGuestCheckinCallback();
				} else {
					$scope.callAPI(zsCheckinSrv.checkInGuest, options);
				}
			}


			var generateApiParams = function(approvePendingIds) {
				apiParams = {
					guests_accepted_with_id: [],
					guests_accepted_without_id: []
				};
				allGuestsAreVerified = true;
				_.each($scope.selectedReservation.guest_details, function(guest) {
					if (guest.review_status === '1') {
						apiParams.guests_accepted_with_id.push(guest.id);
					} else if (guest.review_status === '2' || approvePendingIds) {
						apiParams.guests_accepted_without_id.push(guest.id);
					} else {
						allGuestsAreVerified = false;
					}
				});
			};

			var callApiToRecord = function() {
				var params = apiParams;
				params.staff_id = verfiedStaffId;
				console.log(apiParams);
				var options = {
					params: apiParams,
					successCallBack: checkinGuest
				};

				$scope.callAPI(zsGeneralSrv.recordIdVerification, options);
			};

			$scope.acceptWithoutID = function() {
				var approvePendingIds = true;
				generateApiParams(approvePendingIds);
				callApiToRecord();
			};

			$scope.abortCheckin = function() {
				$state.go('zest_station.home');
			};

			$scope.hideWarningPopup = function() {
				$scope.showWarningPopup = false;
			};

			$scope.continueToNextScreen = function() {
				generateApiParams();
				if (!allGuestsAreVerified) {
					$scope.showWarningPopup = true;
				} else {
					callApiToRecord();
				}
			};
		}
	]);