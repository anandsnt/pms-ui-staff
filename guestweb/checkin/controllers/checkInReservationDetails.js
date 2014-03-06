
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location) {


		

		

		$scope.checkInButtonClicked = function(){

		
			if($rootScope.upgradesAvailable){

				$rootScope.upgradesAvailable = false;
				$rootScope.ShowupgradedLabel = true;
				$rootScope.roomUpgradeheading = "Your new Trip details";
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


