sntRover.controller('rvRoutesAddPaymentCtrl',['$scope','$rootScope','$filter', 'ngDialog', function($scope, $rootScope,$filter, ngDialog){
	BaseCtrl.call(this, $scope);
	
		$scope.cancelClicked = function(){
			$scope.isAddPayment = false;
		};
	
}]);