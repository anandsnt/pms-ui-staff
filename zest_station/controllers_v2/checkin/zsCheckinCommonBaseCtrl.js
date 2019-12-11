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
			var email = checkinParams.guest_email ||  checkinParams.email;

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
			console.log("checkin apiParams \n\n\n");
			console.log(apiParams);
			console.log("checkin apiParams \n\n\n");
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

		$scope.$on('CHECK_IF_REQUIRED_GUEST_DETAILS_ARE_PRESENT', function(e, data) {
			checkinParams = data.checkinParams;
			var retrievGuestInfoCallback = function(data) {
				data = [{
						"key": "last_name",
						"label": "ZS_GUEST_LAST_NAME",
						"mandatory": false,
						"type": "text", // input field,
						"value": ""
					}, {
						"key": "first_name",
						"label": "ZS_GUEST_FIRST_NAME",
						"mandatory": false,
						"type": "text", // input field,
						"value": ""
					},

					{
						"key": "gender",
						"label": "ZS_GUEST_GENDER",
						"mandatory": false,
						"type": "select", // select box with defined values
						"values": ["Male", "Female"],
						"value": ""
					}, {
						"key": "vip",
						"label": "ZS_GUEST_VIP",
						"mandatory": false,
						"type": "boolean", // select box with YES/NO,
						"value": ""
					}, {
						"key": "dob",
						"label": "ZS_GUEST_DOB",
						"mandatory": true,
						"type": "date", // date picker,
						"value": ""
					}, {
						"key": "expiry",
						"label": "ZS_GUEST_EXPIRY",
						"mandatory": false,
						"type": "date", // date picker,
						"value": ""
					}
				];

				var missingData = _.filter(data, function(field) {
					return !field.value;
				});

				var mandatoryFieldsMissing = _.filter(missingData, function(field) {
					return field.mandatory;
				});

				if (mandatoryFieldsMissing.length > 0) {
					// present new state to collect remainig guest details
					$state.go('zest_station.zsCheckinSaveGuestInfo', {
						checkinParams: angular.toJson(checkinParams),
						guestInfo: angular.toJson(missingData)
					});
				} else {
					checkinGuest();
				}
			};
			var options = {
				params: {
					guest_id: checkinParams.guest_id
				},
				successCallBack: retrievGuestInfoCallback
			};
			retrievGuestInfoCallback();
			//$scope.callAPI(zsCheckinSrv.retrievGuestInfo, options);
		});
	}
]);