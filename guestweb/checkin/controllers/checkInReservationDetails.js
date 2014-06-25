
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService,$state) {

	$scope.pageValid = false;
	
	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else{
		$scope.pageValid = true;
	};

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
		$state.go('checkinUpgrade');
	}
	else{
		$state.go('checkinKeys');
	}			

}
}		

}

};

var dependencies = [
'$scope','$rootScope','$location','checkinDetailsService','$state',
checkInReservationDetails
];

snt.controller('checkInReservationDetails', dependencies);
})();


