admin.controller('ADChargeCodesCtrl',['$scope', 'ADChargeCodesSrv', function($scope, ADChargeCodesSrv){

	BaseCtrl.call(this, $scope);
	$scope.currentClickedElement = -1;
	$scope.data = [];
	$scope.charge_codes = [];
	$scope.new_data = [];

	$scope.isAddmode = false;
	$scope.isEditmode = false;


    /*
    * To fetch the template for chain code details add/edit screens
    */
 	$scope.getCodeTemplateUrl = function(){

 		return "/assets/partials/chargeCodes/adChargeCodeDetailsForm.html";
 	};

 	$scope.addNewClicked = function(){

 		$scope.isAddmode = true;

 	var fetchNewDetailsSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		
		$scope.new_data = data;
		console.log($scope.new_data);
	};
	$scope.invokeApi(ADChargeCodesSrv.fetchNewDetails, {},fetchNewDetailsSuccessCallback);

 		
 	}

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

