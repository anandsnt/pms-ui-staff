sntRover.controller('RVDiaryConfirmationCtrl', [ '$scope', '$rootScope', 'rvDiarySrv', 
	function($scope, $rootScope, rvDiarySrv) {
		//'use strict';
		BaseCtrl.call(this, $scope);

		$scope.rooms = $scope.selectedReservations;

		$scope.arrival_time = '';
		$scope.arrival_date = '';
		$scope.departure_time = '';
		$scope.departure_date = '';


	}
]);