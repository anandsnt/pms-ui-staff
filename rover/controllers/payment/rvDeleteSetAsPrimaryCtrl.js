sntRover.controller('RVDeleteSetAsPrimaryCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.successSetAsPrimary = function(){
		angular.forEach($scope.paymentData.data, function(value, key) {
	       value.is_primary = false;
	     });
		$scope.paymentData.data[$scope.paymentData.index].is_primary = true;
		$scope.$emit("hideLoader");
		ngDialog.close();
	};
	$scope.successDelete = function(){
		$scope.paymentData.data.splice($scope.paymentData.index, 1);
		$scope.$emit("hideLoader");
		ngDialog.close();
	};
	$scope.setAsPrimary = function(){
		console.log(JSON.stringify($scope.paymentData));
		var data = {
			"id": $scope.paymentData.payment_id,
			"user_id": $scope.paymentData.user_id
		};
		$scope.invokeApi(RVPaymentSrv.setAsPrimary, data, $scope.successSetAsPrimary);
	};
	$scope.deletePayment= function(){
		console.log(JSON.stringify($scope.paymentData));
		var data = {
			"id": $scope.paymentData.payment_id
		};
		$scope.invokeApi(RVPaymentSrv.deletePayment, data, $scope.successDelete);
	};
	
}]);