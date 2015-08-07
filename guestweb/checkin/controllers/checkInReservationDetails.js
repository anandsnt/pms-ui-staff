
(function() {
	var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService,$state,$modal) {

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
	$scope.showTermsPopup = false;

	//setup options for modal
	$scope.opts = {
		backdrop: true,
		backdropClick: true,
		templateUrl: '/assets/checkin/partials/acceptChargesError.html',
		controller: ModalInstanceCtrl
	};

	$scope.termsClicked = function(){
    	$scope.showTermsPopup = true;
     };

	$scope.agreeClicked = function(){
		$rootScope.checkedApplyCharges = $scope.checked =  true;
		$scope.showTermsPopup = false;
	};

	$scope.cancel = function(){
		$rootScope.checkedApplyCharges = $scope.checked = false;
		$scope.showTermsPopup = false;
	};

	$scope.checkInButtonClicked = function(){
		if($scope.checked){
			// if room upgrades are available
			if($rootScope.upgradesAvailable){
				$state.go('checkinUpgrade');
			}
			else{
				  if($rootScope.isAutoCheckinOn){
				    $state.go('checkinArrival');
				  }
				  else{
				    $state.go('checkinKeys');
				  }
			}
		}
		else{
			$modal.open($scope.opts); // error modal popup
		};
	}

}

};

var dependencies = [
'$scope','$rootScope','$location','checkinDetailsService','$state','$modal',
checkInReservationDetails
];

snt.controller('checkInReservationDetails', dependencies);
})();
