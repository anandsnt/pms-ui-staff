sntRover.controller('RVJournalPaymentController', ['$scope',function($scope) {
	BaseCtrl.call(this, $scope);
	$scope.setScroller('payment-content');
	$scope.$on('paymentTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('payment-content');}, 200);
    });
	
}]);