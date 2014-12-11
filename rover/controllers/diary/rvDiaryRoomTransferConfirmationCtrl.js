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

		$scope.price = roomXfer.next.room.new_price - roomXfer.current.room.old_price;


		$scope.selectAdditional = function() {
			ngDialog.close();
		};

		$scope.reserveRoom = function(nextRoom, occupancy){

			var dataToPassConfirmScreen = {};
			dataToPassConfirmScreen.arrival_date = nextRoom.arrivalDate;
			dataToPassConfirmScreen.arrival_time = nextRoom.arrivalTime;
			
			dataToPassConfirmScreen.departure_date = nextRoom.departureDate;
			dataToPassConfirmScreen.departure_time = nextRoom.departureTime;			
			var rooms = {
				room_id: next.room.id,
				rateId:  next.room.rate_id,
				amount: roomXfer.next.room.new_price,
				reservation_id: next.occupancy.reservation_id,
				confirmation_id: next.occupancy.confirmation_number,
				numAdults: next.occupancy.numAdults, 	
	    		numChildren : next.occupancy.numChildren,
	    		numInfants 	: next.occupancy.numChildren,
	    		guest_card_id: next.occupancy.guest_card_id,
	    		company_card_id: next.occupancy.company_card_id,
	    		travel_agent_id: next.occupancy.travel_agent_id,
			}
			dataToPassConfirmScreen.rooms = [];
			dataToPassConfirmScreen.rooms.push(rooms);
			$vault.set('temporaryReservationDataFromDiaryScreen', JSON.stringify(dataToPassConfirmScreen));
			$scope.closeDialog();
			$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
				reservation: 'HOURLY',
				mode:'EDIT_HOURLY'
			})
		};

		$scope.confirm = function() {
			$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.occupancy);
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};
	}
]);
