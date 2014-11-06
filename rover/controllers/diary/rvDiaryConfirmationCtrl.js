sntRover.controller('RVDiaryConfirmationCtrl', [ '$scope', '$rootScope', '$state', 'rvDiarySrv', 'ngDialog',
	function($scope, $rootScope, $state, rvDiarySrv, ngDialog) {
		//'use strict';
		BaseCtrl.call(this, $scope);

		$scope.rooms = _.pluck($scope.selectedReservations, 'room');
		$scope.reservations = _.pluck($scope.selectedReservations, 'reservation');

		$scope.title = ($scope.rooms.length > 1 ? 'these cabins' : 'this cabin');

		(function() {
			var resSample = $scope.reservations[0],
				arrival = new Date(resSample.arrival),
				departure = new Date(resSampe.departure),
				arrivalDateComp = arrival.toComponents().date,
				departureDateComp = departure.toComponents().date,
				arrivalTimeComp = arrival.toComponents().time,
				departureTimeComp = departure.toComponents().time;

			$scope.arrival_time = arrivalTimeComp.toStrint(true); //resSample.start_date.toLocaleTimeString();
			$scope.arrival_date = arrivalDateComp.day + ' ' + arrivalDateComp.monthName + ' ' + arrivalDateComp.year;
			$scope.departure_time = departureTimeComp.toString(true);
			$scope.departure_date = departureDateComp.day + ' ' + departureDateComp.monthName + ' ' + departureDateComp.year;

		})();

		$scope.selectAdditional = function() {
			ngDialog.close();
		};

		$scope.reserveRooms = function() {

		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};
	}
]);