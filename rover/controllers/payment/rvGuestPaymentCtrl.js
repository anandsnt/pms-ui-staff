
sntRover.controller('RVPaymentGuestCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv', function($rootScope, $scope, $state, RVPaymentSrv){
	BaseCtrl.call(this, $scope);
	$scope.openAddNewPaymentModel = function(){
  	 	var passData = {
  	 		"user_id": $scope.paymentData.user_id,
  	 		"guest_id": $scope.paymentData.guest_id,
  	 		"fromView": "guestcard"
  	 	};
  	 	var paymentData = $scope.paymentData;
  	 	$scope.showAddNewPaymentModal(passData, paymentData);
  	 };
	
	
}]);