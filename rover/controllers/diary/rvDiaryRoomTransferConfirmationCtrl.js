sntRover.controller('RVDiaryRoomTransferConfirmationCtrl', [ 
												'$scope', 
												'$rootScope', 
												'$state', 
												'rvDiarySrv', 
												'ngDialog', 
												'rvDiaryMetadata',
												'$vault',
												'rvDiaryUtil',
												'$filter',
	function($scope, $rootScope, $state, rvDiarySrv, ngDialog, meta, $vault, util, $filter) {

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

		var formDateAndTimeForMe = function(obj, custom_date) {
			var arrivalDate, departureDate;

			obj.arrivalTime 			= new Date(obj[r.row_children][m.start_date]).toLocaleTimeString();
			obj.departureTime 			= new Date(obj[r.row_children][m.end_date]).toLocaleTimeString();		

			arrivalDate 				= tzIndependentDate(custom_date.date.toDateString().replace(/-/g, '/'));
			obj.arrivalDateToShow 		= $filter('date')(arrivalDate, $rootScope.dateFormat);
			obj.arrivalDate 			= $filter('date')(arrivalDate, $rootScope.mmddyyyyBackSlashFormat);

			departureDate 				= tzIndependentDate(custom_date.date.toDateString().replace(/-/g, '/'));
			obj.departureDateToShow 	= $filter('date')(departureDate, $rootScope.dateFormat);
			obj.departureDate 			= $filter('date')(departureDate, $rootScope.mmddyyyyBackSlashFormat);
		};

		
		//forming date & time for current to display and to pass
		formDateAndTimeForMe(current, oldArrivalDateComp);

		//forming date & time for next to display and to pass
		formDateAndTimeForMe(next, newArrivalDateComp);



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
