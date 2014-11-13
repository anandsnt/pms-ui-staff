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

			$scope.selectionsForVault.arrival_date 		=compA.date.year + ' ' + compA.date.monthName + ' ' + compA.date.day;
	      	$scope.selectionsForVault.departure_date 	=compB.date.year + ' ' + compB.date.monthName + ' ' + compB.date.day;
	      	$scope.selectionsForVault.arrival_time 		= $scope.arrival_time
	      	$scope.selectionsForVault.departure_time 	= $scope.departure_time			

			$scope.selectedReservations.forEach(function(slot, idx) {
				$scope.selectionsForVault.push({       
					room_id: 		slot.room.id,
			        rateId: 		slot.occupancy.rate_id,
			        numAdults: 		1,
			        numChildren: 	0,
			        numInfants: 	0,
			        amount: 		slot.occupancy.amount
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
			$scope.saveToValut('rooms', $scope.selectionsForVault)
			$state.go('rover.reservations.mainCard.stayCard.summaryAndConfirm', {
				reservation: 'HOURLY'
			});
		};

	    // save data to $vault
	    // @param {String} - 'key', the name
	    // @param {Object} - 'value', to be saved
	    // @return {String} - saved value in $vault
	    $scope.saveToVault = function(key, value) {
	    	// $vault.set will only accept numbers & strings
	    	$vault.set( key, JSON.stringify(value) );

	    	// return the same value string back
	    	return $vault.get( key ) || false;
	    };

	    // read data from $vault
	    // @param {String} - 'key', the name
	    // @return {Object} - parsed, saved value from $value
	    $scope.ReadFromVault = function(key) {
	    	return !!$vault.get( key ) ? JSON.parse( $vault.get(key) ) : false; 
	    };

	    // may be moved to utils or to a deeper scope into react
	    $scope.dateToMs = function(date) {
	    	return	Object.prototype.toString.apply( date ) == '[object Date]' ? date.getTime() : false;
	    };
	    $scope.msToDate = function(ms) {
	    	return Object.prototype.toString.apply( new Date(ms) ) == '[object Date]' ? new Date(ms) : false;
	    };

		$scope.closeDialog = function() {
			ngDialog.close();
		};

		$scope.selectionsForVault = [];
}]);
