sntRover.controller('RVHKGuestTabCtrl', [
	'$scope',
	'$rootScope',
	'RVHkRoomDetailsSrv',
	'$filter',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, $filter) {

		BaseCtrl.call(this, $scope);

		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		/*
		Arrived - Show both departure date & departure time (if any)
		Stayover - Show both departure date & departure time (if any)
		Day use or Due out - Show departure time(or late check out time) alone. No need of showing date.
		*/

		var currentStatus = $scope.roomDetails.current_room_reservation_status;

		switch(currentStatus) {
			case 'ARRIVED':
			case 'STAYOVER':
				$scope.roomDetails.hasDept = !!$scope.roomDetails.dept_date || $scope.roomDetails.departure_time ? true : false;
				$scope.roomDetails.departure = { 'date': $scope.roomDetails.dept_date, 'time': $scope.roomDetails.departure_time };
				break;

			case 'DUE OUT':
			case 'DUE OUT / ARRIVAL':
			case 'DUE OUT / DEPARTED':
			case 'ARRIVED / DAY USE / DUE OUT':
			case 'ARRIVED / DAY USE / DUE OUT / DEPARTED':
				$scope.roomDetails.hasDept = !!$scope.roomDetails.late_checkout_time || $scope.roomDetails.departure_time ? true : false;
				$scope.roomDetails.departure = { 'time': $scope.roomDetails.is_late_checkout === 'true' ? $scope.roomDetails.late_checkout_time : $scope.roomDetails.departure_time };
				break;

			default:
				$scope.roomDetails.hasDept = false;
				break;
		}
	}
]);