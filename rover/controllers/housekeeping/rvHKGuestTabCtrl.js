sntRover.controller('RVHKWorkTabCtrl', [
	'$scope',
	'$rootScope',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	function($scope, $rootScope, RVHkRoomDetailsSrv, RVHkRoomStatusSrv) {

		BaseCtrl.call(this, $scope);

		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		$scope.arrivals = {};
		$scope.departure = {};

		if ( !!$scope.roomDetails.arrival_time ) {
			$scope.arrivals.show = true;
			$scope.arrivals.time = $scope.roomDetails.arrival_time;
		};

		if ( !!$scope.roomDetails.late_checkout_time ) {
			$scope.departure.show = true;
			$scope.departure.time = $scope.roomDetails.late_checkout_time;
		} else if ( !!$scope.roomDetails.departure_time ) {
			$scope.departure.show = true;
			$scope.departure.time = $scope.roomDetails.departure_time;
		} else if ( !!$scope.roomDetails.dept_date ) {
			$scope.departure.show = true;
			$scope.departure.date = $scope.roomDetails.dept_date;
		}

	}
]);