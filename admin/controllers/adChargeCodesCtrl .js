admin.controller('ADChargeCodesCtrl',['$scope', 'ADChargeCodesSrv', function($scope, ADChargeCodesSrv){

	BaseCtrl.call(this, $scope);
	$scope.currentClickedElement = -1;
	$scope.charge_codes = [];
	

	$scope.isAddmode = false;
	$scope.isEditmode = false;
	$scope.isTaxSelected = false;
	
	
	/*
    * To fetch charge code list
    */
    $scope.fetchChargeCodes = function(){
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.charge_codes = $scope.data.charge_codes;
		};
		$scope.invokeApi(ADChargeCodesSrv.fetch, {},fetchSuccessCallback);
	};
	$scope.fetchChargeCodes();
	/*
    * To fetch the data for charge code details for add screen.
    */
 	$scope.addNewClicked = function(){

 		$scope.isAddmode = true;

	 	var fetchNewDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.prefetchData = data;
		};
		$scope.invokeApi(ADChargeCodesSrv.fetchNewDetails, {},fetchNewDetailsSuccessCallback);
 	};
    /*
    * To fetch the template for charge code details add/edit screens
    */
 	$scope.getCodeTemplateUrl = function(){
 		return "/assets/partials/chargeCodes/adChargeCodeDetailsForm.html";
 	};
 	/*
    * To handle delete button click.
    */
 	$scope.deleteItem = function(value){
 		var deleteSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.fetchChargeCodes();
		
		};
		var data = {'value' : value};
		$scope.invokeApi(ADChargeCodesSrv.deleteItem, data,deleteSuccessCallback);
 	};
 	
 	/*
    * Function to handle data change in 'Mapping type'.
    * Data is injected to sntValues based on 'Mapping type' values.
    */
   
   //data.selected_charge_code_type
	$scope.$watch('data.selected_charge_code_type', function() {
       if($scope.data.selected_charge_code_type == 'tax') alert("sASDAS");
   	});
	
}]);

