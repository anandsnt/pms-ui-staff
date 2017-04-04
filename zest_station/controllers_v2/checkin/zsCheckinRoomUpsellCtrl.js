sntZestStation.controller('zsCheckinRoomUpsellCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsCheckinSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsCheckinSrv) {


		var onBackButtonClicked = function() {
			if ($scope.mode === 'ROOM_DETAILS' && $scope.upsellRooms.length !== 1) {
				$scope.mode = 'ROOM_UPSELL_LIST';
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
				'authorize_cc_at_checkin': $scope.selectedReservation.reservation_details.authorize_cc_at_checkin,
				'is_from_room_upsell': 'true'
			};

			$state.go('zest_station.checkInTerms', stateParams);
		};

		

		$scope.skipRoomUpsell = function() {
			if ($scope.zestStationData.station_addon_upsell_active) {
				$state.go('zest_station.addOnUpsell', {
					'is_from_room_upsell': 'true'
				});
			} else {
				navigateToTermsPage();
			}
		};

		$scope.viewSelectedRoomDetails = function(selectedRoom) {
			$scope.selectedRoom = selectedRoom;
			$scope.mode = 'ROOM_DETAILS';
		};

		var generalError = function() {
			$scope.mode = 'ERROR_MODE';
		};

		$scope.buyRoomUpsell = function() {
			var upsellSuccess = function() {
				$scope.selectedReservation.isRoomUpraded = true;
				// skipECI used to track going back to reservation details from upsell, avoid re-routing to ECI if purchased or upsold a room
				$scope.selectedReservation.skipECI = true;
				zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
				if ($scope.zestStationData.station_addon_upsell_active) {
					$state.go('zest_station.addOnUpsell', {
						'is_from_room_upsell': 'true'
					});
				} else {
					$state.go('zest_station.checkInReservationDetails');
				}
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

		var setPageNumberDetails = function() {

			if ($scope.upsellRooms.length <= 3) {
				// if 3 or less upgrades are available
				$scope.pageStartingIndex = 1;
				$scope.pageEndingIndex = $scope.upsellRooms.length;
			} else {
				// if multiple pages (each containing 3 items) are present and user navigates
				// using next and previous buttons
				$scope.pageStartingIndex = 1 + 3 * ($scope.pageNumber - 1);
				// ending index can depend upon the no of items
				if ($scope.pageNumber * 3 < $scope.upsellRooms.length) {
					$scope.pageEndingIndex = $scope.pageNumber * 3;
				} else {
					$scope.pageEndingIndex = $scope.upsellRooms.length;
				}
			}
			// set viewable room list - 3 items at a time
			$scope.viewableRoomUpgrades = [];
			// set 3 or less items based on availablity
			var startingUpsell = $scope.upsellRooms[$scope.pageStartingIndex - 1];
			
			$scope.viewableRoomUpgrades.push(startingUpsell);
			// check if second room for the page is available
			if (!_.isUndefined($scope.upsellRooms[$scope.pageStartingIndex])) {
				$scope.viewableRoomUpgrades.push($scope.upsellRooms[$scope.pageStartingIndex]);
			}
			// check if third room for the page is available
			if (!_.isUndefined($scope.upsellRooms[$scope.pageStartingIndex + 1])) {
				$scope.viewableRoomUpgrades.push($scope.upsellRooms[$scope.pageStartingIndex + 1]);
			}
			// hide/show next previous
			$scope.hideNextButton = ($scope.pageEndingIndex === $scope.upsellRooms.length);
			$scope.hidePreviousButton = $scope.pageStartingIndex === 1;

		};

		$scope.viewNextPage = function() {
			$scope.pageNumber++;
			setPageNumberDetails();
		};

		$scope.viewPreviousPage = function() {
			$scope.pageNumber--;
			setPageNumberDetails();
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

				// set page number details
				$scope.pageNumber = 1;
				if ($scope.upsellRooms.length > 0) {
					setPageNumberDetails();
				} else {
					generalError();
				}
				$scope.showPageNumberDetails = true;

				if ($scope.upsellRooms.length === 1) {
					$scope.selectedRoom = $scope.upsellRooms[0];
					$scope.mode = 'ROOM_DETAILS';
				} else {
					$scope.mode = 'ROOM_UPSELL_LIST';
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
				fetchHotelRooms(response);
			};


			$scope.callAPI(zsCheckinSrv.fetchRoomUpsellDetails, {
				params: {
					reservation_id: $scope.selectedReservation.id
				},
				'successCallBack': fetchUpsellRoomTypeSuccess,
				'failureCallBack': generalError
			});
		};

		$scope.showRoomDetailsForStyleA = function(room) {
			if ($scope.zestStationData.room_upsell_style === 'STYLE_A') {
				$scope.viewSelectedRoomDetails(room);
			} else {
				return;
			}
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