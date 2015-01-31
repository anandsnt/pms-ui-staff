snt.controller('emailVerificationStatusController', ['$rootScope','$location','$state','$scope', function($rootScope,$location,$state,$scope) {


	$scope.pageValid = true;
	$scope.showBackButtonImage = false;

	// if($rootScope.isCheckedin){
	// 	$state.go('checkinSuccess');
	// }
	// else if($rootScope.isCheckin){
	// 	$state.go('checkinConfirmation');
	// }
	// else if($rootScope.isCheckedout ){
	// 	$state.go('checkOutStatus');
	// }
	// else if(!$rootScope.isRoomVerified){
	// 	$state.go('checkoutRoomVerification');
	// }
	// else if(!$rootScope.isLateCheckoutAvailable){
	// 	$state.go('checkOutConfirmation');
	// }
	// else{
	// 	$scope.pageValid = true;
	// };


}]);