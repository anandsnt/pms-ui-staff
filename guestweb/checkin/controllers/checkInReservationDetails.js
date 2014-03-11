
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService) {
		

		$scope.pageSuccess = true;

		if($rootScope.isCheckedin){

			$scope.pageSuccess = false;
			$location.path('/checkinSuccess');
		}
		else if($rootScope.isCheckedout){

			$scope.pageSuccess = false;
			$location.path('/checkOutNowSuccess');
		}
		else if(!$rootScope.isCheckin){

			$scope.pageSuccess = false;
			$location.path('/');
		}


		if($scope.pageSuccess){

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

		}


	};

	var dependencies = [
	'$scope','$rootScope','$location','checkinDetailsService',
	checkInReservationDetails
	];

	snt.controller('checkInReservationDetails', dependencies);
})();


