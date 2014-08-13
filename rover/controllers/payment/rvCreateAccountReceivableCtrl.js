sntRover.controller('RVCreateAccountReceivableCtrl',['$rootScope', '$scope', '$state', 'RVAccountReceivableSrv','ngDialog', function($rootScope, $scope, $state, RVAccountReceivableSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.account_no = "";
	$scope.successCreate = function(){
		$scope.$emit("hideLoader");
		ngDialog.close();
	};
	$scope.failureCreate = function(errorMessage){

		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
	};
	$scope.createAccountReceivable = function(){
		var data = {
			"id": "",
			"account_no": $scope.account_no
		};
		$scope.invokeApi(RVAccountReceivableSrv.create, data, $scope.successCreate, $scope.failureCreate);
	};

	$scope.closeDialog = function(){
		ngDialog.close();
	}
	
}]);