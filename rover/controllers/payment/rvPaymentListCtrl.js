sntRover.controller('RVShowPaymentListCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.invokeApi(RVPaymentSrv.getPaymentList, userId, paymentSuccess);  
	
}]);