/*
	Checkin reservation details Ctrl 
	Reservation details are shown in this page.
*/
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
	
	/*
	*	if birthday selection is turened on in admin, show birthday page 
	*   Else if prompt for guest details (the new version of guest details)
	*   Other scenarios are room upgrades, checkin key -> if precheckin in turned on
	*   If precheckin is turned on go to ETA page.
	*/

	$scope.checkInButtonClicked = function(){
		if($scope.checked){
			if($rootScope.guestBirthdateOn && !$rootScope.isBirthdayVerified){
				$state.go('birthDateDetails');
			}
			else if($rootScope.guestPromptAddressOn && !$rootScope.isGuestAddressVerified){
				$state.go('promptGuestDetails');
			}
			else if(!$rootScope.guestAddressOn || $rootScope.isGuestAddressVerified){
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
				};
			}
			else{
					$state.go('guestDetails');	
			}				
		}
		else{
			$modal.open($scope.opts); // error modal popup
		};
	};

	$scope.skipTermsAndContinue = function(){
		$scope.checked = true;
		$scope.checkInButtonClicked();
	};

}

};

var dependencies = [
'$scope','$rootScope','$location','checkinDetailsService','$state','$modal',
checkInReservationDetails
];

sntGuestWeb.controller('checkInReservationDetails', dependencies);
})();
