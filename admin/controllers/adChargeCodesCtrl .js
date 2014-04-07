admin.controller('ADChargeCodesCtrl',['$scope', 'ADChargeCodesSrv', function($scope, ADChargeCodesSrv){

	BaseCtrl.call(this, $scope);
	$scope.currentClickedElement = -1;
	$scope.data = [];
	$scope.charge_codes = [];
    /*
    * To fetch charge groups list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.charge_codes = $scope.data.charge_codes;
	};
	$scope.invokeApi(ADChargeCodesSrv.fetch, {},fetchSuccessCallback);
	
 
	
}]);

