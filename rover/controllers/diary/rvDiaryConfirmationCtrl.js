sntRover.controller('RVDiaryConfirmationCtrl', [ '$scope', 
												 '$rootScope', 
												 '$state', 
												 '$stateParams', 
												 'rvDiaryStoreSrv', 
												 'ngDialog',
	function($scope, $rootScope, $state, $stateParams, rvDiaryStoreSrv, ngDialog) {
		BaseCtrl.call(this, $scope);
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

			$scope.selectedReservations.forEach(function(slot, idx) {
				$scope.selectionsForVault.push({       
					room_id: slot.room.id,
			        rateId: slot.reservation.rate_id,
			        numAdults: 1,
			        numChildren: 0,
			        numInfants: 0,
			        amount: slot.reservation.amount
				});
			});
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
			$scope.selectionsForVault.arrival_date ='2014-07-15';
	      	$scope.selectionsForVault.departure_date ='2014-07-16';
	      	$scope.selectionsForVault.arrival_time = '04:30 AM';
	      	$scope.selectionsForVault.departure_time = '09:15 PM';

			$state.go('rover.reservations.mainCard.stayCard.summaryAndConfirm', {
				reservation: 'HOURLY'
			});
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};

		$scope.selectionsForVault = [];
}]);
