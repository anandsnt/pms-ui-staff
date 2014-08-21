sntRover.controller('RVCreateAccountReceivableCtrl',['$rootScope', '$scope', '$state', 'RVAccountReceivableSrv','ngDialog', function($rootScope, $scope, $state, RVAccountReceivableSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.ar_number = "";
	$scope.successCreate = function(){
		$scope.$emit("hideLoader");
		$scope.reservationBillData.ar_number = $scope.ar_number;
		ngDialog.close();
	};
	$scope.failureCreate = function(errorMessage){

		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
	};
	$scope.createAccountReceivable = function(){
		
		var data = {
			"account_id": $scope.account_id,
			"ar_number": $scope.ar_number
		};
		$scope.invokeApi(RVAccountReceivableSrv.create, data, $scope.successCreate, $scope.failureCreate);
	};

	$scope.closeDialog = function(){
		ngDialog.close();
	}
	
}]);