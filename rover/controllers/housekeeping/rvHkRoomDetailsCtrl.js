sntRover.controller('RVHkRoomDetailsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	'roomDetailsData',
	'$filter',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, RVHkRoomStatusSrv, roomDetailsData, $filter) {

		BaseCtrl.call(this, $scope);

		// set the previous state
		$rootScope.setPrevState = {
			title: $filter('translate')('ROOM_STATUS'),
			name: 'rover.housekeeping.roomStatus',
			param: {}
		}

		$scope.setTitle($filter('translate')('ROOM_DETAILS'));
		$scope.heading = $filter('translate')('ROOM_DETAILS');
		$scope.$emit("updateRoverLeftMenu", "roomStatus");

		$scope.updateHKStatus = function() {
			$scope.$emit('showLoader');
			RVHkRoomDetailsSrv.updateHKStatus($scope.data.room_details.current_room_no, $scope.currentHKStatus.id).then(function(data) {
				$scope.$emit('hideLoader');
				$scope.data.room_details.current_hk_status = $scope.currentHKStatus.value;
				$scope.calculateColorCodes();

				RVHkRoomStatusSrv.updateHKStatus($scope.data.room_details);
			}, function() {
				$scope.$emit('hideLoader');
			});
		};


		// stop bounce effect only on the room-details
		var roomDetailsEl = document.getElementById('#room-details');
		angular.element(roomDetailsEl)
			.bind('ontouchmove', function(e) {
				e.stopPropagation();
			});



		$scope.roomDetails = roomDetailsData;


		$scope.getHeaderColor = function() {
			// if room is out
			if ($scope.roomDetails.room_reservation_hk_status !== 1) {
				return 'out';
			};

			// if the room is clean
			if ($scope.roomDetails.current_hk_status === 'CLEAN') {
				return 'clean';
			};

			// if the room is dirty
			if ($scope.roomDetails.current_hk_status === 'DIRTY') {
				return 'dirty';
			};

			// if the room is pickup
			if ($scope.roomDetails.current_hk_status === 'PICKUP') {
				return 'pickup';
			};

			// if the room is inspected
			if ($scope.roomDetails.current_hk_status === 'INSPECTED') {
				return 'inspected';
			};
		};


		// default open tab
		// connected default to 'Work'
		// stanAlone and maintainceStaff default to 'Work'
		/**
		 * CICO-8620
		 * Added condition for the comment in ticket
		 * When opening the room details screen, default to WORK view for logged in employee $rootScope.isStandAlone && !!roomDetailsData.work_sheet_id
		 */

		if (!$rootScope.isStandAlone || ($rootScope.isStandAlone && ($rootScope.isMaintenanceStaff || $rootScope.isMaintenanceManager)) || ($rootScope.isStandAlone && !!roomDetailsData.work_sheet_id)) {
			$scope.openTab = 'Work';
		} else {
			$scope.openTab = 'Guest';
		}
		
		var getGuestStatusMapped = function(reservationStatus, isLateCheckout) {
			var viewStatus = "";
			//If the guest is opted for late checkout
			if (isLateCheckout === "true") {
				return "late-check-out";
			}

			//Determine the guest status class based on the reservation status
			if ("RESERVED" === reservationStatus) {
				viewStatus = "arrival";
			} else if ("CHECKING_IN" === reservationStatus) {
				viewStatus = "check-in";
			} else if ("CHECKEDIN" === reservationStatus) {
				viewStatus = "inhouse";
			} else if ("CHECKEDOUT" === reservationStatus) {
				viewStatus = "departed";
			} else if ("CHECKING_OUT" === reservationStatus) {
				viewStatus = "check-out";
			} else if ("CANCELED" === reservationStatus) {
				viewStatus = "cancel";
			} else if (("NOSHOW" === reservationStatus) || ("NOSHOW_CURRENT" === reservationStatus)) {
				viewStatus = "no-show";
			}

			return viewStatus;

		}

		$scope.guestViewStatus = getGuestStatusMapped($scope.roomDetails.reservation_status,
			$scope.roomDetails.is_late_checkout);

		// methods to switch tab
		$scope.tabSwitch = function(tab) {
			if (!!tab) {
				$scope.openTab = tab;
			};
		};

		$scope.updateRoomDetails = function(prop, value) {
			if ($scope.roomDetails.hasOwnProperty(prop)) {
				$scope.roomDetails[prop] = value;
				$scope.getHeaderColor();
			} else {
				console.info('RVHkRoomDetailsCtrl: No prop "' + prop + '" found on $scope.roomDetails');
			}
			if (prop === "room_reservation_hk_status") {
				RVHkRoomStatusSrv.setRoomStatus($scope.roomDetails.id, prop, value);
			} else if (prop === "current_hk_status") {
				var status = _.find($scope.roomDetails.hk_status_list, function(status) {
					return status.value === value;
				});
				RVHkRoomStatusSrv.setWorkStatus($scope.roomDetails.id, status);
			}

		};
	}
]);