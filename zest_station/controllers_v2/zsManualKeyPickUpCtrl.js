sntZestStation.controller('zsManualKeyPickUpCtrl', [
	'$scope',
	'zsEventConstants',
	'$filter',
	'$state',
	'$stateParams',
	function($scope, zsEventConstants, $filter, $state, $stateParams) {

		var setUpManualKeyPickUpMessage = function() {
			// check if translation is added for the tag or not
			var roomKeliveryTranslationMsg = $filter('translate')('MANUAL_KEY_PICKUP_MSG');

			if (roomKeliveryTranslationMsg !== 'MANUAL_KEY_PICKUP_MSG' && roomKeliveryTranslationMsg !== '') {
				// Translation was added
				$scope.keyDeliveryMessage = $filter('translate')('MANUAL_KEY_PICKUP_MSG');
			} else {
				$scope.keyDeliveryMessage = $scope.zestStationData.room_key_delivery_message;
			}
		};

		$scope.gotToNextScreen = function() {
			// from pickup key mode, the next screen is Home and for 
			// checkin it will be reg card delivery options
			if ($stateParams.mode === 'PICKUP_KEY') {
				$state.go('zest_station.home');
			} else {
				var stateParams = {
					'guest_id': $stateParams.guest_id,
					'email': $stateParams.email,
					'reservation_id': $stateParams.reservation_id,
					'room_no': $stateParams.room_no,
					'first_name': $stateParams.first_name,
					'key_type': "MANUAL"
				};
				// check if a registration card delivery option is present (from Admin>Station>Check-in), if none are checked, go directly to final screen
				var registration_card = $scope.zestStationData.registration_card;

				$scope.setScreenIcon('bed');

				if (!registration_card.email && !registration_card.print && !registration_card.auto_print) {
					$state.go('zest_station.zsCheckinFinal', stateParams);
				} else {
					$state.go('zest_station.zsCheckinBillDeliveryOptions', stateParams);
				}
			}
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = (function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit('hideLoader');
			// hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			// hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			setUpManualKeyPickUpMessage();
		}());
	}
]);