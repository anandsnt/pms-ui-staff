
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService) {
		
		$scope.pageSuccess = true;
		
		// page navigatons if any of following conditions happpens

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
					//check if checkbox was already checked (before going to upgrades)
					$scope.checked =  ($rootScope.ShowupgradedLabel) ? true:false;
					$scope.reservationData = checkinDetailsService.getResponseData();
					$rootScope.confirmationNumber = $scope.reservationData.confirm_no;			
					// check if checkbox is checked and  enable/disable checkin button 
					$scope.$watch('checked',function(){
						if($scope.checked)
							$rootScope.checkedApplyCharges = true;
						else
							$rootScope.checkedApplyCharges = false;				
					});

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


