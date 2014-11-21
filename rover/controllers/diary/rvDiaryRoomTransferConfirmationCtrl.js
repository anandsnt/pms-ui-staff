sntRover.controller('RVDiaryRoomTransferConfirmationCtrl', [ '$scope', '$rootScope', '$state', 'rvDiarySrv', 'ngDialog', 'meta', 
	function($scope, $rootScope, $state, rvDiarySrv, ngDialog, meta) {
		var roomXfer = $scope.roomXfer,
			current = roomXfer.current,
			next = roomXfer.next,
			m = meta.occupancy,
			r = meta.room,
			oldArrivalDateComp 		= current[r.row_children][m.start_date].toComponents(),
			oldDepartureDateComp 	= current[r.row_children][m.end_date].toComponents(),
			newArrivalDateComp 		= next[r.row_children][m.start_date].toComponents(),
			newDepartureDateComp 	= next[r.row_children][m.end_date].toComponents();

		BaseCtrl.call(this, $scope);

		current.arrivalTime 	= current.start_date.toLocaleTimeString();
		current.departureTime 	= current.end_date.toLocaleTimeString();
		current.arrivalDate 	= oldArrivalDateComp.day + ' ' + oldArrivalDateComp.month + ' ' + oldArrivalDateComp.year;
		current.departureDate 	= oldDepartureDateComp.day + ' ' + oldDepartureDateComp.month + ' ' + oldDepartureDateComp.year;

		next.arrivalTime 		= next.start_date.toLocaleTimeString();
		next.departureTime 		= next.end_date.toLocaleTimeString();
		next.arrivalDate 		= newArrivalDateComp.day + ' ' + newArrivalDateComp.month + ' ' + newArrivalDateComp.year;
		next.departureDate 		= newDepartureDateComp.day + ' ' + newDepartureDateComp.month + ' ' + newDepartureDateComp.year;

		$scope.selectAdditional = function() {
			ngDialog.close();
		};

		$scope.confirm = function() {
			$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.reservation);
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};
	}
]);
