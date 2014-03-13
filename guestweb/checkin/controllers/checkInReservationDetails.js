
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService) {
		

		$scope.pageSuccess = true;
		

		if($rootScope.isCheckedin &&  !$rootScope.isActiveToken){

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

			$scope.checked =  ($rootScope.ShowupgradedLabel) ? true:false;



			$scope.reservationData = checkinDetailsService.getResponseData();

			

			
			// check if checkbox is checked and then disable it

			$scope.$watch('checked',function(){

				if($scope.checked){

					$scope.checkInButtonOpacity = 1.0;
					$rootScope.checkedApplyCharges = true;

				}
				else{
					$scope.checkInButtonOpacity = 0.5;
					$rootScope.checkedApplyCharges = false;
				}
			});

			$scope.checkInButtonOpacity = ($rootScope.ShowupgradedLabel) ? 1.0 : 0.5;

			$scope.checkInButtonClicked = function(){

		


			if($scope.checked){

					// if room upgrades are available

					if($rootScope.upgradesAvailable){

						$location.path('/checkinUpgrade');
					}
					else{

						$location.path('/checkinKeys');
					}
		
					
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


