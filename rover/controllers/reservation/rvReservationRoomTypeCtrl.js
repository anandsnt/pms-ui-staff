sntRover.controller('RVReservationRoomTypeCtrl', ['$scope', 'roomRates', 'RVReservationBaseSearchSrv',
	function($scope, roomRates, RVReservationBaseSearchSrv) {

		var init = function() {
			console.log(roomRates);
			$scope.tax = roomRates.tax;
			$scope.rooms = roomRates.rooms;
			$scope.activeRoom = 0;
			$scope.activeCriteria = "ROOM_TYPE";
			$scope.selectedRoomType = -1;
		};

		init();

		$scope.setSelectedType = function(val) {
			$scope.selectedRoomType = $scope.selectedRoomType == val ? -1 : val;
		}
	}
]);