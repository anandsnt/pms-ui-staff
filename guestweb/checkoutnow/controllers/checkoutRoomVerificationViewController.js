(function() {
	var checkoutRoomVerificationViewController = function($scope,$rootScope,$state) {

	$scope.pageValid = false;

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

		$scope.continueButtonClicked = function(){

		$rootScope.isRoomVerified =  true;
		if($rootScope.isLateCheckoutAvailable ){
				$state.go('checkOutOptions');
	    }else {
	    	$state.go('checkOutConfirmation');	
		}
	};
}
}

var dependencies = [
'$scope','$rootScope','$state',
checkoutRoomVerificationViewController
];

snt.controller('checkoutRoomVerificationViewController', dependencies);
})();