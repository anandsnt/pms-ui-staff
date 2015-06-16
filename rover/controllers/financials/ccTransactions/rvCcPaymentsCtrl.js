sntRover.controller('RVccPaymentsController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVccTransactionsSrv','$timeout',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout) {
		
	BaseCtrl.call(this, $scope);	
	
	$scope.setScroller('payment_content', {});
    var refreshPaymentScroll = function(){
        setTimeout(function(){$scope.refreshScroller('payment_content');}, 500);
    };
    refreshPaymentScroll();

	var initPaymentData = function(){
		var successCallBackFetchPaymentData = function(data){
			$scope.data.paymentData = {};
			$scope.data.paymentData = data;
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
            refreshPaymentScroll();
		};
		$scope.invokeApi(RVccTransactionsSrv.fetchPayments, { "date": $scope.data.transactionDate }, successCallBackFetchPaymentData);
	};
	
	initPaymentData();

	// Handle change transaction date
    $rootScope.$on('transactionDateChanged',function(){
        initPaymentData();
    });

    // Handle error message from parent
    $scope.$on('showErrorMessage',function(event,data){
        $scope.errorMessage = data;
    });

	$scope.clickedApprovedTab = function(){
		$scope.data.paymentData.approved.active = !$scope.data.paymentData.approved.active;
		refreshPaymentScroll();
	};

	$scope.clickedDeclinedTab = function(){
		$scope.data.paymentData.declined.active = !$scope.data.paymentData.declined.active;
		refreshPaymentScroll();
	};

	$scope.clickedApprovedTransactionItem = function(item){
		item.active = !item.active;
		refreshPaymentScroll();
	};

	$scope.clickedDeclinedTransactionItem = function(item){
		item.active = !item.active;
		refreshPaymentScroll();
	};
    
}]);