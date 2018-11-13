sntZestStation.controller('zsCheckinNextPageBaseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsUtilitySrv',
	'zsCheckinSrv',
	function($scope, $stateParams, $state, zsUtilitySrv, zsCheckinSrv) {

		var stateParams = JSON.parse($stateParams.params);
		var checkIfEmailIsBlackListedOrValid = function() {
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

		$scope.checkinGuest = function() {
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
	}
]);