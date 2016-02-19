/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope,$rootScope,$state) {
		$rootScope.checkinOptionShown = true;
		$scope.checkinNow = function(){
			$state.go('checkinReservationDetails');
		};

		$scope.checkinLater = function(){
			$state.go('checkinArrival');
		};
};

var dependencies = [
'$scope','$rootScope','$state',
checkinOptionsController
];

sntGuestWeb.controller('checkinOptionsController', dependencies);
})();