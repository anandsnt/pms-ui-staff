sntGuestWeb.controller('checkOutLandingController', ['$rootScope','$location','$state','$scope', function($rootScope,$location,$state,$scope) {


	$scope.pageValid = false;
	// Check if user is trying to access this page when he/she don't have access for this page
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
	else if(!$rootScope.isLateCheckoutAvailable){
		$state.go('checkOutConfirmation');
	}
	else{
		$scope.pageValid = true;
	};


}]);

sntGuestWeb.filter('customizeLabelText', function () {
    return function (input, scope) {
        return input.substring(0, 1) +" ' "+ input.substring(1, 2).toBold() +" ' "+ input.substring(2);
    };
});