sntRover.controller('RVJournalPaymentController', ['$scope','$rootScope','RVJournalSrv',function($scope, $rootScope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
	$scope.setScroller('payment-content');
	$scope.$on('paymentTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('payment-content');}, 200);
    });

	$scope.initPaymentData = function(){
		var successCallBackFetchPaymentData = function(data){
			console.log(data);
			$scope.data.paymentData = {};
			$scope.data.paymentData = data;
			$scope.$emit('hideLoader');
			setTimeout(function(){$scope.refreshScroller('payment-content');}, 200);
		};
		$scope.invokeApi(RVJournalSrv.fetchPaymentData, { "date":$scope.data.paymentDate }, successCallBackFetchPaymentData);
	};
	$scope.initPaymentData();

    $rootScope.$on('paymentDateChanged',function(){
    	console.log("paymentDateChanged"+$scope.data.paymentDate);
    	$scope.initPaymentData();
    });

    /** Handle Expand/Collapse on each payments level items **/
    $scope.clickedFirstLevel = function(index){
    	console.log("clickedFirstLevel"+index);
    };
    $scope.clickedSecondLevel = function(index){
    	console.log("clickedSecondLevel"+index);
    };
    $scope.clickedThirdLevel = function(index){
    	console.log("clickedThirdLevel"+index);
    };
	
}]);