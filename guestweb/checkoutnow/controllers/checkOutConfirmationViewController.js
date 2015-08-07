
(function() {
	var checkOutConfirmationController = function($scope,$rootScope,$state) {


	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckin){
		$state.go('checkinConfirmation');
	}
	else if($rootScope.isCheckedout ){
		$state.go('checkOutStatus');
	}
	else if(!$rootScope.isRoomVerified){
		$state.go('checkoutRoomVerification');
	}
	else{
		$scope.pageValid = true;
	}

	if($scope.pageValid){
		$scope.checkoutTimessage = $rootScope.checkoutTimessage ? $rootScope.checkoutTimessage:"Check-out time is ";
		$scope.footerMessage1 = !$rootScope.isLateCheckoutAvailable ? 'Late check-out is not available.' :'' ;
	}
};

var dependencies = [
'$scope','$rootScope','$state',
checkOutConfirmationController
];

snt.controller('checkOutConfirmationController', dependencies);
})();