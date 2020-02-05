sntZestStation.controller('zsCheckinCommonBaseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsUtilitySrv',
	'zsCheckinSrv',
	function($scope, $stateParams, $state, zsUtilitySrv, zsCheckinSrv) {
		// TODO: This controller will control the checkin from any part of zestation and 
		// in multiple iterations, zsCheckinNextPageBaseCtrl will be removed

		var checkinParams;
		var checkIfEmailIsBlackListedOrValid = function() {
			// from some states mail is sent as guest_email and some email
			var email = checkinParams.guest_email ||  checkinParams.email || "";

			return email.length > 0 && !checkinParams.guest_email_blacklisted && zsUtilitySrv.isValidEmail(email);
		};
		var afterGuestCheckinCallback = function() {
			$scope.checkinInProgress = false;
			var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid();
			var nextStateParams = {
				'guest_id': checkinParams.guest_id,
				'reservation_id': checkinParams.reservation_id,
				'room_no': checkinParams.room_no,
				'first_name': checkinParams.first_name,
				'email': checkinParams.guest_email || checkinParams.email
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
			var apiParams = {
				'reservation_id': checkinParams.reservation_id,
				'workstation_id': $scope.zestStationData.set_workstation_id,
				'authorize_credit_card': false,
				'do_not_cc_auth': false,
				'is_promotions_and_email_set': false,
				'is_kiosk': true,
				'signature': checkinParams.signature
			};
			var options = {
				params: apiParams,
				successCallBack: afterGuestCheckinCallback,
				failureCallBack: function() {
					$state.go('zest_station.speakToStaff', {
						'message': 'Checkin Failed.'
					});
					$scope.checkinInProgress = false;
				}
			};
			
			$scope.callAPI(zsCheckinSrv.checkInGuest, options);
		};

		// TODO: use this method for all checkins from KIOSK after this, one or two screens sprint
		$scope.$on('CHECKIN_GUEST', function(e, data) {
			checkinParams = data.checkinParams;
			checkinGuest();
		});

		$scope.$on('CHECK_IF_REQUIRED_GUEST_DETAILS_ARE_PRESENT', function(e, params) {
			checkinParams = params.checkinParams;
			var retrievGuestInfoCallback = function(data) {

				if (!data.metadata.required_for_all_adults) {
					data.guests = _.filter(data.guests, function(guest) {
						return guest.primary;
					});
				} else {
					// Filter out only Adult guest
					data.guests = _.filter(data.guests, function(guest) {
						return guest.guest_type === 'ADULT';
					});
				}


				// utils function
				_.each(data.guests, function(guest) {
					var mandatoryFields = _.filter(guest.guest_details, function(field) {
						return field.mandatory;
					});
					var missingInfoForGuest = _.filter(mandatoryFields, function(field) {
						return !field.current_value;
					});

					guest.is_missing_any_required_field = guest.info_bypassed ? false : missingInfoForGuest.length > 0;
				});

				var guestsWithMissingInfo = _.filter(data.guests, function(guest) {
					return guest.is_missing_any_required_field;
				});

				if (guestsWithMissingInfo.length > 0) {
					// present new state to collect remainig guest details
					$state.go('zest_station.zsCheckinSaveGuestInfo', {
						checkinParams: angular.toJson(checkinParams),
						guestInfo: angular.toJson(data)
					});
				} else {
					checkinGuest();
				}
			};
			var options = {
				params: {
					guest_detail_id: checkinParams.guest_id,
					reservation_id: checkinParams.reservation_id
				},
				successCallBack: retrievGuestInfoCallback
			};

			$scope.callAPI(zsCheckinSrv.getGuestMandatoryFields, options);
		});
	}
]);