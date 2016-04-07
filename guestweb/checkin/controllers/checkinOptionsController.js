/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope, $rootScope, $state, checkinNowService) {

		$rootScope.checkinOptionShown = true;
		//set default values
		var early_checkin_switch_on = false;
		var reservation_has_early_checkin = false;// check if reservation matches criteria 
		var early_checkin_offer_id = "";
		var offer_eci_bypass = false;
		var eci_upsell_limit_reached = false;
		var is_room_already_assigned = false;
		var is_room_ready = false;
		var is_donot_move_room_marked = false;
		var early_checkin_charge = "";
		var checkin_time = "";
		var roomAssignedFromZestWeb = false;
		var reservation_is_in_early_checkin_window = false;//check if its inside early checkin window


		var init = function() {

			$scope.isLoading = true;
			var params = {
				'reservation_id': $rootScope.reservationID
			};
			checkinNowService.fetchEarlyCheckinData(params).then(function(response) {
				//set variables based on the response
				early_checkin_switch_on = response.early_checkin_on;
				reservation_has_early_checkin = response.early_checkin_available;
				early_checkin_offer_id = response.early_checkin_offer_id
				offer_eci_bypass = response.offer_eci_bypass;
				eci_upsell_limit_reached = response.eci_upsell_limit_reached;
				is_room_already_assigned = response.is_room_already_assigned;
				is_room_ready = response.is_room_ready;
				is_donot_move_room_marked = response.is_donot_move_room_marked;
				early_checkin_charge = response.early_checkin_charge;
				checkin_time = response.checkin_time;
				reservation_is_in_early_checkin_window = response.reservation_in_early_checkin_window;
				// if user is not arriving today
				if (!response.guest_arriving_today) {
					$state.go('checkinArrival');
				} else {
					$scope.isLoading = false;
				}

			}, function() {
				$scope.netWorkError = true;
				$scope.isLoading = false;
			});
		}();

		var navigateToNextScreen = function() {
			if (!early_checkin_switch_on || (early_checkin_switch_on && !reservation_has_early_checkin) || !reservation_is_in_early_checkin_window) {
				// earlycheckin turened off or is out of early checkin window
				$state.go('checkinKeys');
			} else if (early_checkin_switch_on && reservation_has_early_checkin) {
				if (offer_eci_bypass) {
					// Early checkin byepass
					//$state.go('earlyCheckinReady');
					//need to change later
					$state.go('checkinKeys');
				} else {
					if (eci_upsell_limit_reached || typeof early_checkin_offer_id === 'undefined' || early_checkin_offer_id === null) {
						//limted by overall count and room type
						$state.go('checkinArrival');
					} else {
						//offer early checkin purchase
						$state.go('earlyCheckinOptions', {
							'time': checkin_time,
							'charge': early_checkin_charge,
							'id': early_checkin_offer_id,
							'isFromCheckinNow': 'true',
							'roomAssignedFromZestWeb': roomAssignedFromZestWeb ? 'true' : 'false'
						});
					}
				}
			}
		};

		var assignRoom = function(type) {
			var params = {
				application: 'WEB',
				forcefully_assign_room: false,
				reservation_id: $rootScope.reservationID,
				without_rate_change: true
			};
			$scope.isLoading = true;
			checkinNowService.assignRoom(params).then(function(response) {
				$scope.isLoading = false;
				if (response.status !== "failure") {
					roomAssignedFromZestWeb = true;
					navigateToNextScreen();
				} else {
					$scope.isLoading = false;
					if (!early_checkin_switch_on || !reservation_has_early_checkin || !reservation_is_in_early_checkin_window) {
						$state.go('eciOffroomAssignFailed');
					} else {
						$state.go("roomAssignFailed");
					}
				}
			}, function() {
				$scope.isLoading = false;
				$state.go("roomAssignFailed");
			});
		};

		var roomAssignmentActions = function() {
			if (!is_room_already_assigned) {
				// room not ready and but can assign new room
				assignRoom();
			}
			if (is_room_already_assigned && is_room_ready) {
				// Hurray! room available. navigate to next screen.
				navigateToNextScreen();
			} else if (is_room_already_assigned && !is_room_ready) {
				// oops!.room not ready and cannot assign new room
				if (!early_checkin_switch_on || !reservation_has_early_checkin || !reservation_is_in_early_checkin_window) {
					$state.go('eciOffRoomNotReady');
				} else {
					$state.go('roomNotReady');
				}
			} else {
				return;
			}
		};

		$scope.checkinNow = function() {
			//check if room is assigned, if not assigned assign room
			roomAssignmentActions();
		};
		$scope.checkinLater = function() {
			//continue existing precheckin flow
			$state.go('checkinArrival');
		};
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', 'checkinNowService',
		checkinOptionsController
	];

	sntGuestWeb.controller('checkinOptionsController', dependencies);
})();