sntRover.controller('RVDiaryRoomTransferConfirmationCtrl', [ 
												'$scope', 
												'$rootScope', 
												'$state', 
												'rvDiarySrv', 
												'ngDialog', 
												'rvDiaryMetadata',
												'$vault',
												'rvDiaryUtil',
	function($scope, $rootScope, $state, rvDiarySrv, ngDialog, meta, $vault, util) {

		var roomXfer = $scope.roomXfer,
			current = (roomXfer.current),
			next = (roomXfer.next),
			m = meta.occupancy,
			r = meta.room,
			oldArrivalDateComp 		= new Date(current[r.row_children][m.start_date]).toComponents(),
			oldDepartureDateComp 	= new Date(current[r.row_children][m.end_date]).toComponents(),
			newArrivalDateComp 		= new Date(next[r.row_children][m.start_date]).toComponents(),
			newDepartureDateComp 	= new Date(next[r.row_children][m.end_date]).toComponents();

		BaseCtrl.call(this, $scope);


		current.arrivalTime 	= new Date(current[r.row_children][m.start_date]).toLocaleTimeString();
		current.departureTime 	= new Date(current[r.row_children][m.end_date]).toLocaleTimeString();		
		current.arrivalDate 	= oldArrivalDateComp.date.day + ' ' + oldArrivalDateComp.date.month + ' ' + oldArrivalDateComp.date.year;
		current.departureDate 	= oldDepartureDateComp.date.day + ' ' + oldDepartureDateComp.date.month + ' ' + oldDepartureDateComp.date.year;


		next.arrivalTime 		= new Date(next[r.row_children][m.start_date]).toLocaleTimeString();
		next.departureTime 		= new Date(next[r.row_children][m.end_date]).toLocaleTimeString();

		next.arrivalDate 		= newArrivalDateComp.date.day + ' ' + newArrivalDateComp.date.month + ' ' + newArrivalDateComp.date.year;
		next.departureDate 		= newDepartureDateComp.date.day + ' ' + newDepartureDateComp.date.month + ' ' + newDepartureDateComp.date.year;

		$scope.price = parseFloat(roomXfer.next.room.new_price - roomXfer.current.room.old_price);

		$scope.moveWithoutRateChange = function() {
			$scope.roomXfer.next.room.new_price = $scope.roomXfer.current.room.old_price;
			$scope.confirm();
		};

		$scope.selectAdditional = function() {
			ngDialog.close();
		};


		$scope.confirm = function() {
			$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.occupancy);
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};
	}
]);
