sntRover.controller('RVDiaryConfirmationCtrl', [ '$scope', 
												 '$rootScope', 
												 '$state', 
												 '$stateParams', 
												 'rvDiaryStoreSrv', 
												 'ngDialog',
	function($scope, $rootScope, $state, $stateParams, rvDiaryStoreSrv, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.rooms.forEach(function(room, idx) {

		});

		$scope.title = ($scope.rooms.length > 1 ? 'these cabins' : 'this cabin');

		(function() {
			var resSample 			= $scope.reservations[0],
				arrival 			= new Date(resSample.arrival),
				departure 			= new Date(resSample.departure),
				compA 				= arrival.toComponents(),
				compB 				= departure.toComponents(),
				arrivalDateComp 	= compA.date,
				departureDateComp 	= compB.date,
				arrivalTimeComp 	= compA.time,
				departureTimeComp 	= compB.time;

			$scope.arrival_time 	= compA.time.toString(true); 
			$scope.arrival_date 	= compA.date.day + ' ' + compA.date.monthName + ' ' + compA.date.year;
			$scope.departure_time 	= compB.time.toString(true);
			$scope.departure_date 	= compB.date.day + ' ' + compB.date.monthName + ' ' + compB.date.year;

		})();

		$scope.selectAdditional = function() {
			ngDialog.close();
		};

		$scope.removeSelectedOccupancy = function(idx) {
			$scope.selectedReservations.splice(idx, 1);
		};

		$scope.reserveRooms = function() {
			/*$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
				reservation: $scope.selectedReservations
			});*/
			$state.go('reservations/hourly', {
				rooms: $scope.rooms,
				reservations: $scope.reservations
			});
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};
	}
]);