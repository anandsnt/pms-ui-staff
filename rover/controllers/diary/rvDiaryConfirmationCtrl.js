sntRover.controller('RVDiaryConfirmationCtrl', [ '$scope', 
												 '$rootScope', 
												 '$state', 
												 '$vault', 
												 'ngDialog',
												 'rvDiarySrv',
	function($scope, $rootScope, $state, $vault, ngDialog, rvDiarySrv) {
		BaseCtrl.call(this, $scope);

		$scope.title = ($scope.selectedReservations.length > 1 ? 'these cabins' : 'this cabin');

		(function() {
				var convertTimeFormat = function(fn, obj){
					var arrival 			= new Date(obj.arrival),
						departure 			= new Date(obj.departure);

						return fn(arrival.toComponents(),  
								  departure.toComponents());
				},
				dFormat = function(arrival, departure) {
					return {
						arrival_time:   arrival.time.toString(true),
						arrival_date:   arrival.date.day + ' ' + arrival.date.monthName + ' ' + arrival.date.year,
						departure_time: departure.time.toString(true),
						departure_date: departure.date.day + ' ' + departure.date.monthName + ' ' + departure.date.year
					};
				},
				vFormat = function(arrival, departure) {
					return {
	      				arrival_date: arrival.date.year + '-' + (arrival.date.month + 1) + '-' + arrival.date.day,
	      				arrival_time: arrival.time.toReservationFormat(false),
	      				departure_date: departure.date.year + '-' + (departure.date.month + 1) + '-' + departure.date.day,
	      				departure_time: departure.time.toReservationFormat(false)
					};
				}, 
				occupancy = $scope.selectedReservations[0].occupancy;

			$scope.selection 		= {
				rooms: []
			};

			$scope.vaultSelections = {
				rooms: []
			};

			$scope.reservationsSettings = rvDiarySrv.ArrivalFromCreateReservation();

			_.extend($scope.vaultSelections, convertTimeFormat(vFormat, occupancy));
			_.extend($scope.selection, convertTimeFormat(dFormat, occupancy)); 

			_.each($scope.selectedReservations, function(obj, idx, list) {
				var item = {
					room_id: obj.room.id,
					room_no: obj.room_no,
					room_type: obj.room_type_name,
					amount: obj.occupancy.amount,
					rate_id: obj.occupancy.rate_id,
					numAdults: 		(_.has($scope.reservationsSettings, 'adults') ? $scope.reservationsSettings.adults : 1),
			        numChildren: 	(_.has($scope.reservationsSettings, 'children') ? $scope.reservationsSettings.children : 0),
			        numInfants: 	(_.has($scope.reservationsSettings, 'infants') ? $scope.reservationsSettings.infants : 0)
			    };

			    $scope.vaultSelections.push(item);
				$scope.selection.push(item); 
			})
		})();

		$scope.selectAdditional = function() {
			ngDialog.close();
		};

		$scope.removeSelectedOccupancy = function(idx) {
			$scope.selectedReservations.splice(idx, 1);
		};

		$scope.routeToSummary = function() {
			$scope.saveToVault('temporaryReservationDataFromDiaryScreen', vaultSelections);
			
			$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
				reservation: 'HOURLY'
			});

			ngDialog.close();
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
	    $scope.readFromVault = function(key) {
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
}]);
