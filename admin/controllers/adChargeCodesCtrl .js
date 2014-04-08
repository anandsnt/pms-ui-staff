admin.controller('ADChargeCodesCtrl',['$scope', 'ADChargeCodesSrv','ngTableParams', '$filter', function($scope, ADChargeCodesSrv, ngTableParams, $filter){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.currentClickedElement = -1;
	$scope.isAdd = false;
	$scope.isEdit = false;
	$scope.isTaxSelected = false;
	
	/*
    * To fetch charge code list
    */
    $scope.fetchChargeCodes = function(){
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.charge_codes.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.charge_codes.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.charge_codes, params.orderBy()) :
		                                $scope.data.charge_codes;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
		};
		$scope.invokeApi(ADChargeCodesSrv.fetch, {},fetchSuccessCallback);
	};
	$scope.fetchChargeCodes();
	/*
    * To fetch the charge code details for add screen.
    */
 	$scope.addNewClicked = function(){

 		$scope.isAdd = true;

	 	var fetchNewDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.prefetchData = {};
			$scope.prefetchData = data;
		};
		$scope.invokeApi(ADChargeCodesSrv.fetchAddData, {},fetchNewDetailsSuccessCallback);
 	};
 	/*
    * To fetch the charge code details for edit screen.
    */
 	$scope.editSelected = function(index,value){
 		
		$scope.currentClickedElement = index;
		$scope.editId = value;
		var data = { 'editId' : value }

		var editSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.prefetchData = {};
			$scope.prefetchData = data;
			$scope.isEdit = true;
			$scope.isAdd = false;
		};
		$scope.invokeApi(ADChargeCodesSrv.fetchEditData, data, editSuccessCallback );
 	};
    /*
    * To fetch the template for charge code details add/edit screens
    */
 	$scope.getTemplateUrl = function(){
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
		$scope.invokeApi(ADChargeCodesSrv.deleteItem, data, deleteSuccessCallback);
 	};
 	/*
    * To handle save button click.
    */
 	$scope.clickedSave = function(){
 		var saveSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			if($scope.isAdd) $scope.isAdd = false;
 			if($scope.isEdit) $scope.isEdit = false;
		};
		var unwantedKeys = ["charge_code_types", "charge_groups", "selected_link_with"];
		var data = dclone($scope.prefetchData, unwantedKeys);
		$scope.invokeApi(ADChargeCodesSrv.save, data, saveSuccessCallback);
 	};
 	/*
    * To handle cancel button click.
    */
 	$scope.clickedCancel = function(){
 		if($scope.isAdd) $scope.isAdd = false;
 		if($scope.isEdit) $scope.isEdit = false;
 	};
 	/*
    * Function to handle data change in 'Mapping type'.
    * Data is injected to sntValues based on 'Mapping type' values.
    */
   
   	/*
	$scope.$watch('prefetchData.selected_charge_code_type', function() {
       if($scope.prefetchData.selected_charge_code_type == 'tax') alert("sASDAS");
   	});
	*/
}]);

