sntRover.controller('rvRouteDetailsCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isBillingGroup = true;
	$scope.isAddPayment = false;

	$scope.showPaymentList = function(){
		$scope.isAddPayment = false;
	}

	$scope.showAddPayment = function(){
		$scope.isAddPayment = true;
	}		
	
}]);