sntRover.controller('RVCreateAccountReceivableCtrl',['$rootScope', '$scope', '$state', 'RVCompanyCardSrv','ngDialog', function($rootScope, $scope, $state, RVCompanyCardSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.ar_number = "";

	$scope.createAccountReceivable = function(){

		var data = {
			"id": $scope.account_id,
			"ar_number": $scope.ar_number
		};
		$scope.invokeApi(RVCompanyCardSrv.saveARDetails, data, $scope.successCreate, $scope.failureCreate);
	};

	$scope.closeDialog = function(){
		ngDialog.close();
	}

}]);