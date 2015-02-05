
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

	//setup options for terms and conditions modal
	$scope.termsPopup = {
		backdrop: true,
		backdropClick: true,
		templateUrl: '/assets/checkin/partials/termsAndContions.html',
		controller: TermsCtrl,
		resolve: {
	        termsText:function(){
	          return $scope.reservationData.terms_and_conditions;
	        }
      }
	};

	// check if checkbox is checked and  enable/disable checkin button 
	// $scope.$watch('checked',function(){
	// 	if($scope.checked)
	// 		$rootScope.checkedApplyCharges = true;
	// 	else
	// 		$rootScope.checkedApplyCharges = false;				
	// });
    
    $scope.termsClicked = function(){
    	$modal.open($scope.termsPopup);
    }
    //setup options for modal
	$scope.opts = {
		backdrop: true,
		backdropClick: true,
		templateUrl: '/assets/checkin/partials/errorModal.html',
		controller: ModalInstanceCtrl
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

// controller for the modal

var TermsCtrl = function ($scope, $modalInstance,$rootScope,termsText) {
	$scope.termsText = termsText;
	$scope.closeDialog = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.agreeClicked = function(){
		$rootScope.checkedApplyCharges = true;
		$scope.closeDialog();
		console.log("fgrvhjfkvgb4rjk")
	};

	$scope.cancel = function(){
		$rootScope.checkedApplyCharges = false;
		$scope.closeDialog();
		console.log("fgrvhjfdwdgwdgkvgb4rjk")
	};
};

