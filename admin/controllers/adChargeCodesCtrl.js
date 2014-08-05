admin.controller('ADChargeCodesCtrl', ['$scope', 'ADChargeCodesSrv', 'ngTableParams', '$filter', '$timeout', '$state',
function($scope, ADChargeCodesSrv, ngTableParams, $filter, $timeout, $state) {

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.currentClickedElement = -1;
	$scope.currentClickedTaxElement = -1;
	$scope.isAdd = false;
	$scope.isAddTax = false;
	$scope.isEditTax = false;
	$scope.isEdit = false;
	$scope.successMessage = "";
	
	/*
	 * To fetch charge code list
	 */
	$scope.fetchChargeCodes = function() {
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;

			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
			$scope.tableParams = new ngTableParams({
				page : 1, // show first page
				count : 10000, // count per page - Need to change when on pagination implemntation
				sorting : {
					name : 'asc' // initial sorting
				}
			}, {
				total : $scope.data.charge_codes.length, // length of data
				getData : function($defer, params) {
					// use build-in angular filter
					var orderedData = params.sorting() ? $filter('orderBy')($scope.data.charge_codes, params.orderBy()) : $scope.data.charge_codes;
					$scope.orderedData = orderedData;
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		};
		$scope.invokeApi(ADChargeCodesSrv.fetch, {}, fetchSuccessCallback);
	};
	$scope.fetchChargeCodes();
	/*
	 * To fetch the charge code details for add screen.
	 */
	$scope.addNewClicked = function() {

		$scope.isAdd = true;
		$scope.isAddTax = false;
		var fetchNewDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.prefetchData = {};
			$scope.prefetchData = data;
			$scope.getPrefetchData(data);
		};
		$scope.invokeApi(ADChargeCodesSrv.fetchAddData, {}, fetchNewDetailsSuccessCallback);
	};
	
	$scope.getPrefetchData = function(data){
		// TODO : To be removed static data , after API integartion.
			$scope.prefetchData = {

				"value" : data.value,
				"code" : data.code,
				"description" : data.description,
				"selected_charge_group" : data.selected_charge_group,
				"selected_charge_code_type" : data.selected_charge_code_type,
				"selected_link_with" : data.selected_link_with,
				"charge_groups" : data.charge_groups,
				"charge_code_types" : data.charge_code_types,

				"selected_amount_sign" : "+",
				"selected_amount_symbol" : "$",
				"amount" : "100",
				"amount_types" : [
					{
						"value" : "1",
						"name" : "PerAdult"
					}, 
					{
						"value" : "2",
						"name" : "PerChild"
					}, 
					{
						"value" : "3",
						"name" : "Per Person"
					}, 
					{
						"value" : "4",
						"name" : "Flat"
					}
				],
				"selected_amount_type" : "1",
				"post_types" : [
					{
						"value" : "1",
						"name" : "PerNight"
					},
					{
						"value" : "2",
						"name" : "PerStay"
					}
				],
				"selected_post_type" : "2",
				
				 "tax_codes": [
			            {
			                "value": "1",
			                "name": "8300"
			            },
			            {
			                "value": "2",
			                "name": "8310"
			            },
			            {
			                "value": "13",
			                "name": "9055"
			            }
			        ],
			        "linked_charge_codes": [
			            {
			                "charge_code_id": "1",
			                "is_inclusive": false,
			                "calculation_rules": []
			            },
			            {
			                "charge_code_id": "13",
			                "is_inclusive": false,
			                "calculation_rules": [1]
			            },
			            {
			                "charge_code_id": "13",
			                "is_inclusive": false,
			                "calculation_rules": [1,2]
			            }
			        ]
			};
			
			angular.forEach($scope.prefetchData.linked_charge_codes,function(item, index) {
				item.calculation_rule_list = $scope.generateCalculationRule(item.calculation_rules.length);
				
	       	});
			
			console.log($scope.prefetchData);
		
	};
	/*
	 * To fetch the charge code details for edit screen.
	 */
	$scope.editSelected = function(index, value) {
		$scope.isAddTax = false;
		$scope.currentClickedElement = index;
		$scope.editId = value;
		var data = {
			'editId' : value
		}

		var editSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.prefetchData = {};
			$scope.prefetchData = data;
			$scope.isEdit = true;
			$scope.isAdd = false;
		
			//$scope.getPrefetchData(data);
			// Generating calculation rules list.
			angular.forEach($scope.prefetchData.linked_charge_codes,function(item, index) {
				item.calculation_rule_list = $scope.generateCalculationRule(item.calculation_rules.length);
				
	       	});
	       	
			// Generating link-with array to show charge code Link with - for non-standalone hotels
			$scope.prefetchData.link_with = [];
			angular.forEach($scope.prefetchData.tax_codes,function(item1, index1) {
				var obj = { "value" : item1.value, "name" : item1.name };
				obj.is_checked = 'false';
				angular.forEach($scope.prefetchData.linked_charge_codes,function(item2, index2) {
		       		if (item2.charge_code_id == item1.value) {
		       			obj.is_checked = 'true';
				 	}
		       	});
		       	$scope.prefetchData.link_with.push(obj);
	       	});
			console.log($scope.prefetchData);
		};
		$scope.invokeApi(ADChargeCodesSrv.fetchEditData, data, editSuccessCallback);
	};
	/*
	 * To fetch the template for charge code details add/edit screens
	 */
	$scope.getTemplateUrl = function() {

		return "/assets/partials/chargeCodes/adChargeCodeDetailsForm.html";
	};
	/*
	 * To handle delete button click.
	 */
	$scope.deleteItem = function(value) {
		var deleteSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			angular.forEach($scope.data.charge_codes, function(item, index) {
				if (item.value == value) {
					$scope.data.charge_codes.splice(index, 1);
				}
			});
			$scope.tableParams.reload();
		};
		var data = {
			'value' : value
		};
		$scope.invokeApi(ADChargeCodesSrv.deleteItem, data, deleteSuccessCallback);
	};
	/*
	 * To handle save button click.
	 */
	$scope.clickedSave = function() {
		var saveSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			if($scope.isEdit){
				$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code = data.charge_code;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].description = data.description;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].charge_group = data.charge_group;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code_type = data.charge_code_type;
	    		$scope.orderedData[parseInt($scope.currentClickedElement)].link_with = data.link_with;
			} else {
				$scope.data.charge_codes.push(data);
				$scope.tableParams.reload();
			}

			$scope.currentClickedElement = -1;
			if ($scope.isAdd)
				$scope.isAdd = false;
			if ($scope.isEdit)
				$scope.isEdit = false;
		};
		// To create Charge code Link with list frm scope.
		var selected_link_with = [];
		angular.forEach($scope.prefetchData.link_with, function(item, index) {
			if (item.is_checked == 'true') {
				selected_link_with.push(item.value);
			}
		});
		//var unwantedKeys = ["charge_code_types", "charge_groups", "link_with"];
		var unwantedKeys = ["charge_code_types", "charge_groups", "link_with", "amount_types", "tax_codes", "post_types"];
		var postData = dclone($scope.prefetchData, unwantedKeys);
		//Include Charge code Link with List when selected_charge_code_type is not "TAX".
		if ($scope.prefetchData.selected_charge_code_type != "1") {
			postData.selected_link_with = selected_link_with;
		}
		$scope.invokeApi(ADChargeCodesSrv.save, postData, saveSuccessCallback);
		
		console.log(postData);
	};
	/*
	 * To handle cancel button click.
	 */
	$scope.clickedCancel = function() {
		if ($scope.isAdd)
			$scope.isAdd = false;
		if ($scope.isEdit)
			$scope.isEdit = false;
	};
	/*
	 * To handle import from PMS button click.
	 */
	$scope.importFromPmsClicked = function(event) {
		event.stopPropagation();
		$scope.successMessage = "Collecting charge codes data from PMS and adding to Rover...";
		var importSuccessCallback = function() {
			$scope.$emit('hideLoader');
			$scope.successMessage = "Completed!";
			$timeout(function() {
				$scope.successMessage = "";
			}, 1000);
			$scope.fetchChargeCodes();
		};
		$scope.invokeApi(ADChargeCodesSrv.importData, {}, importSuccessCallback);
	};
	
	$scope.generateCalculationRule = function(taxCount){
		var calculation_rule_list = [];
		if (taxCount === 0) {
			calculation_rule_list = [];
		} else if (taxCount === 1) {
			
				calculation_rule_list = [{
					"value" : 0,
					"name" : "ChargeCodeBaseAmount",
					"ids" :[]
				}, {
					"value" : 1,
					"name" : "ChargeCodeplusTax 1",
					"ids" : [$scope.prefetchData.linked_charge_codes[0].charge_code_id]
				}];
			
		} else if (taxCount > 1) {
			calculation_rule_list = [{
					"value" : 0,
					"name" : "ChargeCodeBaseAmount",
					"ids" :[]
				}, {
					"value" : 1,
					"name" : "ChargeCodeplusTax 1",
					"ids" : [$scope.prefetchData.linked_charge_codes[0].charge_code_id]
			}];
			/*
			 * Generating 3rd calculation rule manually in UI.
			 */
			var name = "ChargeCodeplusTax 1";
			var idList = [$scope.prefetchData.linked_charge_codes[0].charge_code_id];
			for (var i = 2; i <= taxCount; i++) {
				var name = name + " & " + i;
				idList.push($scope.prefetchData.linked_charge_codes[i-1].charge_code_id);
			}
			var obj = {
				"value" : 2,
				"name" : name,
				"ids": idList
			};
			calculation_rule_list.push(obj);
		}
		
		return calculation_rule_list;
		
	};
	/*
	 * To fetch the tax details for add screen.
	 */
	$scope.addTaxClicked = function() {
		$scope.isAddTax = true;
		$scope.isEditTax = false;
		// To find the count of prefetched tax details already there in UI.
		var taxCount = $scope.prefetchData.linked_charge_codes.length;
		if (taxCount === 0) {
			$scope.addData = {
				"id" : 1,
				"is_inclusive" : true,
				"calculation_rule_list" : [],
			};
		} else if (taxCount === 1) {
			$scope.addData = {
				"id" : 2,
				"is_inclusive" : true,
				"calculation_rule_list" : $scope.generateCalculationRule(1)
			};
		} else if (taxCount > 1) {
			$scope.addData = {
				"id" : taxCount + 1,
				"is_inclusive" : true,
				"calculation_rule_list" : $scope.generateCalculationRule(taxCount)
			};
		}
	};
	/*
	 * To handle cancel button click on tax creation.
	 */
	$scope.clickedCancelAddNewTax = function() {
		$scope.isAddTax = false;
	};
	/*
	 * To handle click on tax list to show inline edit screen.
	 */
	var tempEditData = []; 
	$scope.editSelectedTax = function(index) {
		$scope.isEditTax = true;
		$scope.isAddTax = false;
		$scope.currentClickedTaxElement = index;
		// Taking a deep copy edit data , need when we cancel out edit screen.
		tempEditData = dclone($scope.prefetchData.linked_charge_codes[index],[]);
	};
	/*
	 * To handle save button click on tax creation while edit.
	 */
	$scope.clickedUpdateTax = function(index) {
		$scope.isEditTax = false;
	};
	/*
	 * To handle cancel button click on tax creation while edit.
	 */
	$scope.clickedCancelEditTax = function(index) {
		$scope.isEditTax = false;
		// Restore edit data.
		$scope.prefetchData.linked_charge_codes[index] = tempEditData; 
	};
	/*
	 * To handle save button click on tax creation while add new.
	 */
	$scope.clickedSaveAddNewTax = function() {
		$scope.prefetchData.linked_charge_codes.push($scope.addData);
		$scope.addData = {};
		$scope.isAddTax = false;
	};
	/*
	 * To handle inclusive/exclusive radio button click.
	 */
	$scope.toggleExclusive = function(index,value) {
		if($scope.isAddTax){
			$scope.addData.is_inclusive = value;
		}
		else if($scope.isEditTax){
			$scope.prefetchData.linked_charge_codes[index].is_inclusive = value;
		}
	};
}]);

