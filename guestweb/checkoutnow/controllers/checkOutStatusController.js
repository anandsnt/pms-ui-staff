
(function() {
	var checkOutStatusController = function($scope, checkoutNowService,$rootScope,$state) {

	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckin){
		$state.go('checkinConfirmation');
	}
	else if(!$rootScope.isRoomVerified && !$rootScope.isCheckedout){
		$state.go('checkoutRoomVerification');
	}
	else{
		$scope.pageValid = true;
	}

	if($scope.pageValid){
		$scope.finalMessage = "Thank You for staying with us!";
		$scope.errorMessage = "";

	// data posted status
	$scope.posted = false;
	$scope.isCheckoutCompleted= $rootScope.isCheckedout;
	$scope.netWorkError = false;


	// prevent chekout operation if user has already checked out

	if(!$scope.isCheckoutCompleted){
		var url = '/guest_web/home/checkout_guest.json';
		var data = {'reservation_id':$rootScope.reservationID};

		checkoutNowService.completeCheckout(url,data).then(function(response) {
			$scope.posted = true;
			$scope.success = (response.status !== "failure") ? true : false;
			if($scope.success) {
				$rootScope.isCheckedout = $scope.isCheckoutCompleted = true;
			}
			else {
				$scope.errorMessage = response.errors[0];
			}
		},function(){
			$scope.netWorkError = true;
			$scope.posted = true;
		});
	};
 }
};

var dependencies = [
'$scope',
'checkoutNowService','$rootScope','$state',
checkOutStatusController
];

snt.controller('checkOutStatusController', dependencies);
})();