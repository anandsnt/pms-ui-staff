sntRover.controller('RVDeleteSetAsPrimaryCtrl', ['$rootScope', '$scope', '$state', 'RVPaymentSrv', 'RVCompanyCardSrv', 'ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, RVCompanyCardSrv, ngDialog) {
	BaseCtrl.call(this, $scope);
	$scope.successSetAsPrimary = function() {
		angular.forEach($scope.paymentData.data, function(value, key) {
	       value.is_primary = false;
	     });
		$scope.paymentData.data[$scope.paymentData.index].is_primary = true;
		$scope.refreshScroller('paymentList');
		$scope.$emit("hideLoader");
		ngDialog.close();
	};
	$scope.successDelete = function() {
		$scope.paymentData.data.splice($scope.paymentData.index, 1);
		$scope.$emit("hideLoader");
		ngDialog.close();
	};
	$scope.failureCallBack = function(errorMessage) {

		$scope.$emit("hideLoader");
		$scope.updateErrorMessage(errorMessage);
		$scope.refreshScroller('paymentList');
		$scope.closeDialog() ;
	};
	$scope.setAsPrimary = function() {
		if (!$scope.paymentData.isFromWallet) {
			var data = {
				"id": $scope.paymentData.payment_id,
				"user_id": $scope.paymentData.user_id
			};
			$scope.invokeApi(RVPaymentSrv.setAsPrimary, data, $scope.successSetAsPrimary, $scope.failureCallBack);
		} else {
			var data = {
				"associated_payment_method_id": $scope.paymentData.payment_id,
				"account_id": $scope.paymentData.accountId
			};
			$scope.invokeApi(RVCompanyCardSrv.setAsPrimary, data, $scope.successSetAsPrimary, $scope.failureCallBack);
		}
	};
	$scope.deletePayment = function() {
		if (!$scope.paymentData.isFromWallet) {
			var data = {
				"id": $scope.paymentData.payment_id
			};

			$scope.invokeApi(RVPaymentSrv.deletePayment, data, $scope.successDelete, $scope.failureCallBack);
		} else {
			var data = {
				"associated_payment_method_id": $scope.paymentData.payment_id,
				"account_id": $scope.paymentData.accountId
			};

			$scope.invokeApi(RVCompanyCardSrv.deletePayment, data, $scope.successDelete, $scope.failureCallBack);
		}
	};

}]);