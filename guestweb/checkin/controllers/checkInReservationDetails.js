
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService) {
		
		$scope.pageValid = true;
		
		//TO DO: page navigatons if any of following conditions happpens

		if($scope.pageValid){
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


