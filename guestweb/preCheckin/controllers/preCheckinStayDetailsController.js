(function() {
	var preCheckinStayDetailsController = function($scope, checkoutNowService,$rootScope,$state) {

	$scope.pageValid = false;

	// if($rootScope.isCheckedin){
	// 	$state.go('checkinSuccess');
	// }
	// else if($rootScope.isCheckin){
	// 	$state.go('checkinConfirmation');
	// }
	// else if(!$rootScope.isRoomVerified && !$rootScope.isCheckedout){
	// 	$state.go('checkoutRoomVerification');
	// }
	// else{
	// 	$scope.pageValid = true;
	// }		

	if($scope.pageValid){
	
 }
};

var dependencies = [
'$scope',
'checkoutNowService','$rootScope','$state',
preCheckinTripDetailsController
];

snt.controller('preCheckinTripDetailsController', dependencies);
})();