sntRover.controller('RVEditRatesCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		$scope.save = function(room ,index){
			$scope.reservationData.rooms[index] = room;
			$scope.saveReservation();
		}
	}
]);