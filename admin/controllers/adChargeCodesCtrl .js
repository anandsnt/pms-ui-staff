admin.controller('ADChargeCodesCtrl',['$scope', 'ADChargeCodesSrv','ngTableParams', '$filter', function($scope, ADChargeCodesSrv, ngTableParams, $filter){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.currentClickedElement = -1;
	$scope.isAdd = false;
	$scope.isEdit = false;
	
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
		            $scope.orderedData =  orderedData;
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
			// delete data from scope
			angular.forEach($scope.data.charge_codes,function(item, index) {
	 			if (item.value == value) {
	 				$scope.data.charge_codes.splice(index, 1);
	 			}
 			});
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
			if($scope.isEdit){
				$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code = data.charge_code;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].description = data.description;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].charge_group = data.charge_group;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code_type = data.charge_code_type;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].link_with = data.link_with;
			} else {
				$scope.fetchChargeCodes();
				// $scope.orderedData.push(data);
			}
			
    		$scope.currentClickedElement = -1;
			if($scope.isAdd) $scope.isAdd = false;
 			if($scope.isEdit) $scope.isEdit = false;
		};
		// To create Charge code Link with list frm scope.
		var selected_link_with = [];
		angular.forEach($scope.prefetchData.link_with,function(item, index) {
 			if (item.is_checked == 'true') {
 				selected_link_with.push(item.value);
 			}
		});
		var unwantedKeys = ["charge_code_types", "charge_groups", "link_with"];
		var postData = dclone($scope.prefetchData, unwantedKeys);
		//Include Charge code Link with List when selected_charge_code_type is not "TAX".
		if($scope.prefetchData.selected_charge_code_type != "1"){
			postData.selected_link_with = selected_link_with;
		}
		$scope.invokeApi(ADChargeCodesSrv.save, postData, saveSuccessCallback);
 	};
 	/*
    * To handle cancel button click.
    */
 	$scope.clickedCancel = function(){
 		if($scope.isAdd) $scope.isAdd = false;
 		if($scope.isEdit) $scope.isEdit = false;
 	};
 	/*
    * To handle import from PMS button click.
    */
 	$scope.importFromPmsClicked = function(){
 		var importSuccessCallback = function() {
			$scope.$emit('hideLoader');
			$scope.fetchChargeCodes();
		};
		$scope.invokeApi(ADChargeCodesSrv.importData, {}, importSuccessCallback);
 	};
   
}]);

