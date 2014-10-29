sntRover.controller('RVJournalPaymentController', ['$scope','$rootScope',function($scope, $rootScope) {
	BaseCtrl.call(this, $scope);
	$scope.setScroller('payment-content');
	$scope.$on('paymentTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('payment-content');}, 200);
    });

    $rootScope.$on('paymentDateChanged',function(){
    	console.log("paymentDateChanged"+$scope.data.paymentDate);
    });
	
}]);