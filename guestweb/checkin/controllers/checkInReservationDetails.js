
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService) {

		$scope.checked = false;

		$scope.reservationData = checkinDetailsService.getResponseData();

		$scope.checkInButtonClicked = function(){


		if($scope.checked){
		if($rootScope.upgradesAvailable){

				$location.path('/checkinUpgrade');
			}
			else
				$location.path('/checkinKeys');
		
			}
		}



};

		var dependencies = [
		'$scope','$rootScope','$location','checkinDetailsService',
		checkInReservationDetails
		];

		snt.controller('checkInReservationDetails', dependencies);
		})();


