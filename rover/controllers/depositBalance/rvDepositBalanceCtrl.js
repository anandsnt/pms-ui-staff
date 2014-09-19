sntRover.controller('RVDepositBalanceCtrl',['$scope','ngDialog', '$rootScope', 'RVDepositBalanceSrv','$stateParams', 
	function($scope, ngDialog, $rootScope, RVDepositBalanceSrv, $stateParams){
	BaseCtrl.call(this, $scope);
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
	console.log($scope);
	
	// $scope.init = function(){
// 	
		// var reservationId = $stateParams.id;
		// var dataToSrv = {
			// "reservationId": reservationId
		// };
		// $scope.invokeApi(RVDepositBalanceSrv.getDepositBalanceData, dataToSrv, $scope.successCallBackFetchDepositBalance);
// 	
	// };
	// $scope.init();
	// $scope.successCallBackFetchDepositBalance = function(data){
		// console.log("reached here")
		// $scope.depositBalanceData = data;
	// };
}]);