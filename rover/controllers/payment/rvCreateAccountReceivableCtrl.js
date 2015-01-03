sntRover.controller('RVCreateAccountReceivableCtrl',['$rootScope', '$scope', '$state', 'RVCompanyCardSrv','ngDialog', function($rootScope, $scope, $state, RVCompanyCardSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.ar_number = "";
	
	$scope.successCreate = function(data){
		$scope.$emit("hideLoader");
		ngDialog.close();
		$rootScope.$emit('AR_ACCOUNT_CREATED');
	};
	$scope.failureCreate = function(errorMessage){

		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
	};

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