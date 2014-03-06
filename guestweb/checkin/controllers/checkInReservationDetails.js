
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location) {


		$scope.heading = "Your Trip details";

		$scope.ShowupgradedLabel = false;

		$scope.upgradesAvailable = true;

		$scope.checkInButtonClicked = function(){

			if($scope.upgradesAvailable){

				$scope.upgradesAvailable = false;
				$location.path('/checkinUpgrade');
			}
			else
				$location.path('/checkinKeys');




		}



};

		var dependencies = [
		'$scope','$rootScope','$location',
		checkInReservationDetails
		];

		snt.controller('checkInReservationDetails', dependencies);
		})();


