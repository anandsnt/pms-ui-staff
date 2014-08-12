sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','ngDialog', function($scope, RVBillPaymentSrv, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.renderData = {};
	$scope.init = function(){
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, '', $scope.getPaymentListSuccess);
	};
	$scope.getPaymentListSuccess = function(data){
		$scope.renderData = data;
	};
	
}]);