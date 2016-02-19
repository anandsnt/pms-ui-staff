/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope,$rootScope,$state) {

		$scope.checkinNow = function(){
			$rootScope.isAutoCheckinOn = false;
			$state.go('checkinReservationDetails');
		};

		$scope.checkinLater = function(){
			$rootScope.isAutoCheckinOn = true;
			$state.go('checkinReservationDetails');
		};
};

var dependencies = [
'$scope','$rootScope','$state',
checkinOptionsController
];

sntGuestWeb.controller('checkinOptionsController', dependencies);
})();