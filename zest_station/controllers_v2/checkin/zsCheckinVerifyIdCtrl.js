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
			var scrollOptions = {
				click: false,
				preventDefaultException: {tagName:/.*/}
			};

			$scope.setScroller('guests-list', scrollOptions);
			$scope.screenMode = 'WAIT_FOR_STAFF';
			$scope.adminPin = '';
			$scope.showWarningPopup = false;
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
			var showOnlyPrimaryGuest = !$scope.zestStationData.kiosk_scan_all_guests;

			if (showOnlyPrimaryGuest) {
				$scope.selectedReservation.guest_details = _.filter($scope.selectedReservation.guest_details, function(guest) {
					return guest.is_primary;
				});
			}

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

			$scope.ringBell = function() {
				$scope.$emit('PLAY_BELL_SOUND');
			};

			$scope.goToNext = function() {
				$scope.callBlurEventForIpad();
				var successCallback = function(response) {
					verfiedStaffId = response.user_id;
					$scope.screenMode = 'GUEST_LIST';
					$scope.refreshScroller('guests-list');
					// For some reason keyboard did'nt dismiss even after the above code
					// TODO: investigate later
					$scope.callBlurEventForIpad();
				};
				var failureCallback = function() {
					$scope.screenMode = 'PIN_ERROR';
				};
				var options = {
					params: {
						'pin_code': $scope.adminPin
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

				if ($scope.zestStationData.is_kiosk_ows_messages_active) {
					$scope.setScreenIcon('checkin');
					$state.go('zest_station.checkinSuccess', nextStateParams);
				}
				// if collectiing nationality after email, but email is already valid
				else if ($scope.zestStationData.check_in_collect_nationality && haveValidGuestEmail) {
					$scope.$emit('showLoader');
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
						$state.go('zest_station.speakToStaff', {
							'message': 'Checkin Failed.'
						});
						$scope.checkinInProgress = false;
					}
				};

				if ($scope.inDemoMode()) {
					afterGuestCheckinCallback();
				} else {
					$scope.callAPI(zsCheckinSrv.checkInGuest, options);
				}
			};

			var generateDataSet = function() {
				apiParams = {
					guests_accepted_with_id: [],
					guests_accepted_without_id: []
				};
				allGuestsAreVerified = true;
				_.each($scope.selectedReservation.guest_details, function(guest) {
					if (guest.review_status === 'WITH_ID') {
						apiParams.guests_accepted_with_id.push(guest);
					} else if (guest.review_status === 'NO_ID') {
						apiParams.guests_accepted_without_id.push(guest);
					} else {
						allGuestsAreVerified = false;
					}
				});
			};

			var addGuestDataToParams = function(params, guestData, key) {
				if (guestData.length > 0) {
					var newData = {
						'key': key,
						'new_value': ''
					};
					var guestNames = _.map(guestData, function(guest) {
						return guest.first_name + ' ' + guest.last_name;
					});
					newData.new_value = guestNames.join(', ');
					params.details.push(newData);
				}
				return params;
			};

			var callApiToRecord = function() {
				var params = {
					"id": stateParams.reservation_id,
					"user_id": verfiedStaffId,
					"application": 'ROVER',
					"action_type": "ID_REVIEWED",
					"details": []
				};

				params = addGuestDataToParams(params, apiParams.guests_accepted_with_id, 'Guests Verified With ID');
				params = addGuestDataToParams(params, apiParams.guests_accepted_without_id, 'Guests Verified Without ID');

				var options = {
					params: params,
					successCallBack: function() {
						if (stateParams.mode === 'PICKUP_KEY') {
							$scope.zestStationData.continuePickupFlow();
						} else {
							checkinGuest();
						}
					}
				};

				$scope.callAPI(zsGeneralSrv.recordReservationActions, options);
			};

			$scope.approveGuest = function() {
				generateDataSet();
				if (allGuestsAreVerified) {
					callApiToRecord();
				}
				return;
			};

		}
	]);