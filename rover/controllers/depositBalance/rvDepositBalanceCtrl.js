sntRover.controller('RVDepositBalanceCtrl',['$scope','ngDialog', '$rootScope', 'RVDepositBalanceSrv','$stateParams', 
	function($scope, ngDialog, $rootScope, RVDepositBalanceSrv, $stateParams){
	BaseCtrl.call(this, $scope);
	
	
	$scope.init = function(){
	console.log($scope)
		var reservationId = $stateParams.id;
		var dataToSrv = {
			"reservationId": reservationId
		};
		$scope.invokeApi(RVDepositBalanceSrv.getDepositBalanceData, dataToSrv, $scope.successCallBackFetchDepositBalance);
	
	};
	$scope.init();
	$scope.successCallBackFetchDepositBalance = function(data){
		$scope.depositBalanceData = data;
	};
}]);