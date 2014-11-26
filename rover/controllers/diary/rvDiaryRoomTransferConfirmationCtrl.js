sntRover.controller('RVDiaryRoomTransferConfirmationCtrl', [ 
												'$scope', 
												'$rootScope', 
												'$state', 
												'rvDiarySrv', 
												'ngDialog', 
												'rvDiaryMetadata',
												'$vault',
	function($scope, $rootScope, $state, rvDiarySrv, ngDialog, meta, $vault) {

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

		$scope.price = roomXfer.next.room.new_price - roomXfer.current.room.old_price;

		$scope.selectAdditional = function() {
			ngDialog.close();
		};

		$scope.reserveRoom = function(nextRoom, reservation){

			var dataToPassConfirmScreen = {};
			dataToPassConfirmScreen.arrival_date = nextRoom.arrivalDate;
			dataToPassConfirmScreen.arrival_time = nextRoom.arrivalTime;
			
			dataToPassConfirmScreen.departure_date = nextRoom.departureDate;
			dataToPassConfirmScreen.departure_time = nextRoom.departureTime;			
			
			var rooms = {
				room_id: next.room.id,
				rateId:  next.room.room_type.id,
				amount: $scope.price
			}
			dataToPassConfirmScreen.rooms = [];
			dataToPassConfirmScreen.rooms.push(rooms);
			$vault.set('temporaryReservationDataFromDiaryScreen', JSON.stringify(dataToPassConfirmScreen));
			$scope.closeDialog();
			$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {reservation: 'HOURLY'})
		};

		$scope.confirm = function() {
			$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.reservation);
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};
	}
]);
