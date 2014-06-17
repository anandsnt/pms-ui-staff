(function() {
	var checkoutRoomVerificationViewController = function($scope,$rootScope,$state) {

		$scope.pageValid = true;
	//TO DO: Navigations		

	if($scope.pageValid){

		$scope.continueButtonClicked = function(){
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