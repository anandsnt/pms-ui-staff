
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location) {

		$scope.checked = false;
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
		'$scope','$rootScope','$location',
		checkInReservationDetails
		];

		snt.controller('checkInReservationDetails', dependencies);
		})();


