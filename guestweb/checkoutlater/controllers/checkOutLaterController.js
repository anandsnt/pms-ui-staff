/*
	Late checkout option Ctrl where user can opt a later checkout time
*/

(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location,$state) {
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

	if($scope.pageValid){

		$scope.showBackButtonImage = true;
		$scope.netWorkError = false;
		$scope.isFetching = true;

		// If CC is not attached to the reservation we need to add CC to proceed to opt an late checkouttime.
		$scope.gotToNextStep = function(fee,chargeId){
			if(!$rootScope.isCCOnFile && !$rootScope.isSixpayments){
				$state.go('ccVerification',{'fee':fee,'message':"Late check-out fee",'isFromCheckoutNow':false});
			}
			else{
				$state.go('checkOutLaterSuccess',{id:chargeId});
			}

		};

		// fetch late checkout options available
		LateCheckOutChargesService.fetchLateCheckoutOptions().then(function(charges) {
			$scope.charges = charges;
			$scope.netWorkError = false;
			$scope.isFetching = false;
			if($scope.charges.length > 0) {
				$scope.optionsAvailable = true;
			}
		},function(){
			$scope.netWorkError = true;
			$scope.isFetching = false;
		});
	}
};

var dependencies = [
'$scope',
'LateCheckOutChargesService','$rootScope','$location','$state',
checkOutLaterController
];

sntGuestWeb.controller('checkOutLaterController', dependencies);
})();