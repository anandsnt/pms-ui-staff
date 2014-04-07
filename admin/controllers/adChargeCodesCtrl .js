admin.controller('ADChargeCodesCtrl',['$scope', 'ADChargeCodesSrv', function($scope, ADChargeCodesSrv){

	BaseCtrl.call(this, $scope);
	$scope.currentClickedElement = -1;
	$scope.data = [];
	$scope.charge_codes = [];
    /*
    * To fetch charge groups list
    */

    $scope.fetchChargeCodes = function(){ 
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.charge_codes = $scope.data.charge_codes;
	};
	$scope.invokeApi(ADChargeCodesSrv.fetch, {},fetchSuccessCallback);
	}
	$scope.fetchChargeCodes();
	
 
 	$scope.deleteItem = function(value){

 		var deleteSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.fetchChargeCodes();
		
	};
	var data = {'value' : value}
	$scope.invokeApi(ADChargeCodesSrv.deleteItem, data,deleteSuccessCallback);
	


 	}
	
}]);

