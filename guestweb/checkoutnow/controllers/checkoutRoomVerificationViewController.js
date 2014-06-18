(function() {
	var checkoutRoomVerificationViewController = function($scope,$rootScope,$state,$modal) {

	$scope.pageValid = false;
	$scope.roomNumber = "";

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckin){
		$state.go('checkinConfirmation');
	}
	else{
		$scope.pageValid = true;
	}	

	if($scope.pageValid){
		//setup options for error popup
		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkoutnow/partials/roomVerificationErrorModal.html',
			controller: roomVerificationErrorModalCtrl
		};

		$scope.continueButtonClicked = function(){

		//TO DO:
		//

		if($scope.roomNumber === "300"){
			$rootScope.isRoomVerified =  true;
			if($rootScope.isLateCheckoutAvailable ){
					$state.go('checkOutOptions');
		    }else {
		    	$state.go('checkOutConfirmation');	
			}
		}
		else{
			$modal.open($scope.opts); // error modal popup
		}

	
	};

	
}
}

var dependencies = [
'$scope','$rootScope','$state','$modal',
checkoutRoomVerificationViewController
];

snt.controller('checkoutRoomVerificationViewController', dependencies);
})();


// controller for the modal

	var roomVerificationErrorModalCtrl = function ($scope, $modalInstance) {
		$scope.closeDialog = function () {
			$modalInstance.dismiss('cancel');
		};
	};