sntZestStation.controller('zsCheckinRoomUpsellCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsCheckinSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsCheckinSrv) {


		var onBackButtonClicked = function() {
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

		$scope.viewSelectedRoomDetails = function(selectedRoom) {
			$scope.selectedRoom = selectedRoom;
			$scope.displayMode = 'ROOM_DETAILS';
		};

		var generalError = function() {
			$scope.displayMode = 'ERROR_MODE';
		};

		$scope.buyRoomUpsell = function() {
			var upsellSuccess = function() {
				$state.go('zest_station.checkInReservationDetails');
			};

			var params = {
				reservation_id: $scope.selectedReservation.reservation_details.reservation_id,
				upsell_amount_id: parseInt($scope.selectedRoom.upsell_amount_id, 10),
				room_no: $scope.selectedRoom.upgrade_room_number,
				upgrade_room_type_id: $scope.selectedRoom.upgrade_room_type_id,
				is_preassigned: $scope.selectedRoom.is_preassigned
			};

			$scope.callAPI(zsCheckinSrv.selectRoomUpgrade, {
				params: params,
				'successCallBack': upsellSuccess,
				'failureCallBack': generalError
			});
		};
		/**
		 * [isRoomReadyToAssign check if roomn is ready to be assigned]
		 * @param  {obj}  room
		 * @return {Boolean}      
		 */
		var isRoomReadyToAssign = function(room) {
			if (room.room_status === "READY" && room.fo_status === "VACANT" && !room.is_preassigned) {
				if (room.checkin_inspected_only === "true" && room.room_ready_status === "INSPECTED") {
					return true;
				} else if (room.checkin_inspected_only === "false") {
					return true;
				}
			}
			return false;
		};
		/**
		 * [fetchHotelRooms fectch the rooms in hotel and find which all rooms are available for
		 * the upgradable room type]
		 * @return {[type]} [description]
		 */
		var fetchHotelRooms = function(upsellRoomsTypes) {

			var fetchHotelRoomsSuccess = function(response) {
				var roomUpgradesList = [];

				_.each(upsellRoomsTypes, function(roomType) {
					// select rooms of the available upgradable room type
					var roomsInRoomType = _.where(response.rooms, {
						"room_type_id": roomType.upgrade_room_type_id_int
					});

					// check if the room is ready to be assigned
					var roomToUpgrade = _.filter(roomsInRoomType, isRoomReadyToAssign)[0];

					if (!_.isUndefined(roomToUpgrade)) {
						roomType.upgrade_room_number = roomToUpgrade.room_number;
						roomType.donot_move_room = roomToUpgrade.donot_move_room;
						roomUpgradesList.push(roomType);
					}
				});
				$scope.upsellRooms = roomUpgradesList;

				if ($scope.upsellRooms.length === 1) {
					$scope.selectedRoom = $scope.upsellRooms[0];
					$scope.displayMode = 'ROOM_DETAILS';
				} else {
					$scope.displayMode = 'ROOM_UPSELL_LIST';
				}
			};

			$scope.callAPI(zsCheckinSrv.fethHotelRooms, {
				params: {
					reservation_id: $scope.selectedReservation.reservation_details.reservation_id
				},
				'successCallBack': fetchHotelRoomsSuccess,
				'failureCallBack': generalError
			});
		};

		/**
		 * [fetchUpsellRoomTypes fetch upgradable room types]
		 * @return {[type]} [description]
		 */
		var fetchUpsellRoomTypes = function() {
			var fetchUpsellRoomTypeSuccess = function(response) {
				fetchHotelRooms(response.upsell_mapping);
			};


			$scope.callAPI(zsCheckinSrv.fetchRoomUpsellDetails, {
				params: {
					reservation_id: $scope.selectedReservation.id
				},
				'successCallBack': fetchUpsellRoomTypeSuccess,
				'failureCallBack': generalError
			});
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
			$scope.selectedRoom = {};
			fetchUpsellRoomTypes();

		}());

	}
]);