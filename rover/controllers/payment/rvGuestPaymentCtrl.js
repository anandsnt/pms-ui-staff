
sntRover.controller('RVPaymentGuestCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv', function($rootScope, $scope, $state, RVPaymentSrv){
	BaseCtrl.call(this, $scope);
	$scope.openAddNewPaymentModel = function(){
  	 	var passData = {
  	 		"reservationId": $scope.paymentData.user_id,
  	 		"fromView": "guestcard"
  	 	};
  	 	$scope.showAddNewPaymentModal(passData);
  	 };
	
	
}]);