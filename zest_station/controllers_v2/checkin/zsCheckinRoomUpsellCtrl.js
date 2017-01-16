sntZestStation.controller('zsCheckinRoomUpsellCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsCheckinSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsCheckinSrv) {


		var onBackButtonClicked = function() {

			var reservations = zsCheckinSrv.getCheckInReservations();

			if ($scope.displayMode === 'ROOM_DETAILS' && $scope.upsellRooms.length !== 1) {
				$scope.displayMode = 'ROOM_UPSELL_LIST';
			} else {
				$state.go('zest_station.checkInReservationDetails');
			}
		};

		var navigateToTermsPage = function() {
			
			var stateParams = {
				'guest_id': $scope.selectedReservation.guest_details[0].id,
				'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
				'deposit_amount': $scope.selectedReservation.reservation_details.deposit_amount,
				'room_no': $scope.selectedReservation.reservation_details.room_number, // this changed from room_no, to room_number
				'room_status': $scope.selectedReservation.reservation_details.room_status,
				'payment_type_id': $scope.selectedReservation.reservation_details.payment_type,
				'guest_email': $scope.selectedReservation.guest_details[0].email,
				'guest_email_blacklisted': $scope.selectedReservation.guest_details[0].is_email_blacklisted,
				'first_name': $scope.selectedReservation.guest_details[0].first_name,
				'balance_amount': $scope.selectedReservation.reservation_details.balance_amount,
				'confirmation_number': $scope.selectedReservation.confirmation_number,
				'pre_auth_amount_for_zest_station': $scope.selectedReservation.reservation_details.pre_auth_amount_for_zest_station,
				'authorize_cc_at_checkin': $scope.selectedReservation.reservation_details.authorize_cc_at_checkin
			};
			$state.go('zest_station.checkInTerms', stateParams);
		};

		$scope.skipRoomUpsell = function() {
			navigateToTermsPage();
		};

		$scope.buyRoomUpsell = function() {
			var upsellSuccess = function() {
				$state.go('zest_station.checkInReservationDetails');
			};

			upsellSuccess();
		};

		$scope.viewSelectedRoomDetails = function(selectedRoom) {
			$scope.selectedRoom = selectedRoom;
			$scope.displayMode = 'ROOM_DETAILS';
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = (function() {
			// hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();

			$scope.upsellRooms = JSON.parse($stateParams.upsell_rooms);
			$scope.selectedRoom = {};

			if ($scope.upsellRooms.length === 1) {
				$scope.selectedRoom = $scope.upsellRooms[0];
				$scope.displayMode = 'ROOM_DETAILS';
			} else {
				$scope.displayMode = 'ROOM_UPSELL_LIST';
			}
		}());

	}
]);