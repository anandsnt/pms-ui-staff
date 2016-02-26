/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope, $rootScope, $state, sntGuestWebSrv) {
		$rootScope.checkinOptionShown = true;

		var early_checkin_switch_on = true;
		var reservation_in_early_checkin_window = true;
		var offerEci = (typeof early_checkin_offer_id !== 'undefined') ? true : false;
		var offer_eci_bypass = true;
		var eci_upsell_limit_reached = false;
		var is_room_already_assigned = true;
		var is_room_ready = false;
		var is_donot_move_room_marked = true;

		var finalNavigations = function() {
			if (!early_checkin_switch_on || (early_checkin_switch_on && !reservation_in_early_checkin_window)) {
				$state.go('checkinKeys');
			} else if (early_checkin_switch_on && reservation_in_early_checkin_window) {
				if (offer_eci_bypass) {
					// Early checkin is  on but no offer available now
					$state.go('earlyCheckinReady');
				} else {
					if (eci_upsell_limit_reached) {
						$state.go('checkinArrival');
					} else {
						$state.go('earlyCheckinOptions', {
							'time': '02:00 PM',
							'charge': '$20',
							'id': 2,
							'isFromCheckinNow': 'true'
						});
					}
				}
			}
		};

		var assignRoom = function(type) {
			var onFailure = function() {
				$state.go("roomAssignFailed");
			}
			var onSuccess = function() {
				finalNavigations();
			};
			onFailure();
		};

		var roomAssignmentActions = function() {
			if (!is_room_already_assigned || (is_room_already_assigned && !is_room_ready && !is_donot_move_room_marked)) {
				// room not ready and but can assign new room
				assignRoom();
			}
			if (is_room_already_assigned && is_room_ready) {
				// room available 
				finalNavigations();
			} else if (is_room_already_assigned && !is_room_ready && is_donot_move_room_marked) {
				// room not ready and cannot assign new room
				$state.go('roomNotReady');
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
		'$scope', '$rootScope', '$state', 'sntGuestWebSrv',
		checkinOptionsController
	];

	sntGuestWeb.controller('checkinOptionsController', dependencies);
})();