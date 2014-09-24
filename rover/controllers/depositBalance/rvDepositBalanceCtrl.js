sntRover.controller('RVDepositBalanceCtrl',['$scope','ngDialog', '$rootScope', 'RVDepositBalanceSrv','$stateParams', 
	function($scope, ngDialog, $rootScope, RVDepositBalanceSrv, $stateParams){
	BaseCtrl.call(this, $scope);

	//$scope.depositBalanceData = $scope.
	$scope.depositBalanceNewCardData = {};
	$scope.clickedMakePayment = function(){
		
	};
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