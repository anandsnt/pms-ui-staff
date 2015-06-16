sntRover.controller('RVccPaymentsController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVccTransactionsSrv','$timeout',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout) {
		
	BaseCtrl.call(this, $scope);	
	
	var initPaymentData = function(){
		var successCallBackFetchPaymentData = function(data){
			$scope.data.paymentData = {};
			$scope.data.paymentData = data;
            $scope.errorMessage = "";
            console.log($scope.data.paymentData);
		};
		$scope.invokeApi(RVccTransactionsSrv.fetchPayments, { "date": $scope.data.transactionDate }, successCallBackFetchPaymentData);
	};
	
	initPaymentData();
    
}]);