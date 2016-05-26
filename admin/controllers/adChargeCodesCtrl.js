admin.controller('ADChargeCodesCtrl', ['$scope', 'ADChargeCodesSrv', 'ngTableParams', '$filter', '$timeout', '$state', '$rootScope', '$location', '$anchorScroll',
	function($scope, ADChargeCodesSrv, ngTableParams, $filter, $timeout, $state, $rootScope, $location, $anchorScroll) {

		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		$scope.$emit("changedSelectedMenu", 5);
		$scope.currentClickedElement = -1;
		$scope.currentClickedTaxElement = -1;
		$scope.isAdd = false;
		$scope.isAddTax = false;
		$scope.isEditTax = false;
		$scope.isEdit = false;
		$scope.successMessage = "";

		$scope.selected_payment_type = {};
		$scope.selected_payment_type.id = -1;
		$scope.prefetchData = {};



		$scope.fetchTableData = function($defer, params){
			var getParams = $scope.calculateGetParams(params);
			var fetchSuccessOfItemList = function(data){
				$scope.$emit('hideLoader');
				//No expanded rate view
				$scope.currentClickedElement = -1;
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
				$scope.data = data.charge_codes;
				$scope.is_connected_to_pms = data.is_connected_to_pms;
				$scope.currentPage = params.page();
	        	params.total(data.total_count);
	            $defer.resolve($scope.data);
			};
			$scope.invokeApi(ADChargeCodesSrv.fetch, getParams, fetchSuccessOfItemList);
		};


		$scope.loadTable = function(){
			$scope.tableParams = new ngTableParams({
			        page: 1,  // show first page
			        count: $scope.displyCount, // count per page
			        sorting: {
			            charge_code: 'asc' // initial sorting
			        }
			    }, {
			        total: 0, // length of data
			        getData: $scope.fetchTableData
			    }
			);
		};

		$scope.loadTable();

		/*
		 * To fetch charge code list
		 */

		/*
		 * To fetch the charge code details for add screen.
		 */
		$scope.addNewClicked = function() {


			$scope.currentClickedElement = -1;
			$scope.isAddTax = false;
			$timeout(function() {
	            $location.hash('new-form-holder');
	            $anchorScroll();
        	});
			var fetchNewDetailsSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.isAdd = true;
				$scope.prefetchData = {};
				$scope.selected_payment_type.id = -1;
				$scope.prefetchData = data;
				$scope.addIDForPaymentTypes();
				$scope.prefetchData.linked_charge_codes = [];
				$scope.prefetchData.symbolList = [{
					value: "%",
					name: "percent"
				}, {
					value: $rootScope.currencySymbol,
					name: "amount"
				}];
				// Default amount sign for FEES and TAXES to be positive
				$scope.prefetchData.selected_amount_sign = '+';
			};

			$scope.invokeApi(ADChargeCodesSrv.fetchAddData, {}, fetchNewDetailsSuccessCallback);
		};

		/*
		 * To fetch the charge code details for edit screen.
		 */
		$scope.editSelected = function(index, value) {
			$scope.isAddTax = false;
			$scope.isAdd = false;
			$scope.editId = value;
			var data = {
				'editId': value
			};

			var editSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.currentClickedElement = index;
				$scope.prefetchData = {};
				$scope.selected_payment_type.id = -1;
				$scope.prefetchData = data;
				$scope.addIDForPaymentTypes();
				$scope.isEdit = true;
				$scope.isAdd = false;
				$scope.prefetchData.symbolList = [{
					value: "%",
					name: "percent"
				}, {
					value: $rootScope.currencySymbol,
					name: "amount"
				}];

				// Generating calculation rules list.
				angular.forEach($scope.prefetchData.linked_charge_codes, function(item, index) {
					item.calculation_rule_list = $scope.generateCalculationRule(index);
					if (item.calculation_rules.length < 3) {
						item.selected_calculation_rule = item.calculation_rules.length;
					} else {
						item.selected_calculation_rule = 2;
					}
				});

				// Generating link-with array to show charge code Link with - for non-standalone hotels
				$scope.prefetchData.link_with = [];
				angular.forEach($scope.prefetchData.tax_codes, function(item1, index1) {
					var obj = {
						"value": item1.value,
						"name": item1.name
					};
					obj.is_checked = 'false';
					angular.forEach($scope.prefetchData.linked_charge_codes, function(item2, index2) {
						if (item2.charge_code_id === item1.value) {
							obj.is_checked = 'true';
						}
					});
					$scope.prefetchData.link_with.push(obj);
				});
			};
			$scope.invokeApi(ADChargeCodesSrv.fetchEditData, data, editSuccessCallback);
		};
		/*
		 * To add unique ids to the payment type list
		 */
		$scope.addIDForPaymentTypes = function() {

			for (var i = 0; i < $scope.prefetchData.payment_types.length; i++) {
				$scope.prefetchData.payment_types[i].id = i;
			}
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
					if (item.value === value) {
						$scope.data.charge_codes.splice(index, 1);
					}
				});
				$scope.tableParams.reload();
			};
			var data = {
				'value': value
			};
			$scope.invokeApi(ADChargeCodesSrv.deleteItem, data, deleteSuccessCallback);
		};
		/*
		 * To handle save button click.
		 */
		$scope.clickedSave = function() {
			var saveSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				if ($scope.isEdit) {
                                    var p = parseInt($scope.currentClickedElement);
                                    if ($scope.orderedData){
                                    if ($scope.orderedData[p]){
					$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code = data.charge_code;
					$scope.orderedData[parseInt($scope.currentClickedElement)].description = data.description;
					$scope.orderedData[parseInt($scope.currentClickedElement)].charge_group = data.charge_group;
					$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code_type = data.charge_code_type;
					$scope.orderedData[parseInt($scope.currentClickedElement)].link_with = data.link_with;
                                    }
                                    }

				} else {
					$scope.data.charge_codes.push(data);
					$scope.tableParams.reload();
				}

				$scope.currentClickedElement = -1;
				if ($scope.isAdd) {
					$scope.isAdd = false;
				}
				if ($scope.isEdit) {
					$scope.isEdit = false;
				}
			};
			// To create Charge code Link with list frm scope.
			var selected_link_with = [];
			angular.forEach($scope.prefetchData.link_with, function(item, index) {
				if (item.is_checked === 'true') {
					selected_link_with.push(item.value);
				}
			});

			// Updating calculation rules list.
			angular.forEach($scope.prefetchData.linked_charge_codes, function(item, index) {
				item.calculation_rule_list = $scope.generateCalculationRule(index);
				item.calculation_rules = [];
				if (item.calculation_rule_list.length !== 0 && item.selected_calculation_rule) {
					item.calculation_rules = item.calculation_rule_list[parseInt(item.selected_calculation_rule)].charge_code_id_list;
				}
			});
			if($scope.prefetchData.selected_fees_code ===""){
				$scope.prefetchData.selected_fees_code = null;
			};

			var unwantedKeys = ["charge_code_types", "payment_types", "charge_groups", "link_with", "amount_types", "tax_codes", "post_types", "symbolList"];
			var postData = dclone($scope.prefetchData, unwantedKeys);

			//Include Charge code Link with List when selected_charge_code_type is not "TAX".
			if ($scope.prefetchData.selected_charge_code_type !== "1") {
				postData.selected_link_with = selected_link_with;
			}
			// Removing unwanted params from linked_charge_codes list.
			angular.forEach(postData.linked_charge_codes, function(item, index) {
				delete item["calculation_rule_list"];
				delete item["selected_calculation_rule"];
				if (item["id"]) {
					delete item["id"];
				}
			});

                        if ($scope.isStandAlone && !$scope.prefetchData.selected_charge_group){
                            $scope.errorMessage = 'Group Charge Code Required';
                            $scope.validForm = false;
                            return;
                        }


			$scope.invokeApi(ADChargeCodesSrv.save, postData, saveSuccessCallback);
		};
		/*
		 * To handle cancel button click.
		 */
		$scope.clickedCancel = function() {
			if ($scope.isAdd) {
				$scope.isAdd = false;
			}
			if ($scope.isEdit) {
				$scope.isEdit = false;
			}
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
		/*
		 * Method to generate calculation rules list as per tax count.
		 * 'charge_code_id_list' - will be array of all charge code ids associated with that calculation rule.
		 */
		$scope.generateCalculationRule = function(taxCount) {
			var calculation_rule_list = [];

			if (taxCount === 1) {

				calculation_rule_list = [{
					"value": 0,
					"name": "ChargeCodeBaseAmount",
					"charge_code_id_list": []
				}, {
					"value": 1,
					"name": "ChargeCodeplusTax 1",
					"charge_code_id_list": [$scope.prefetchData.linked_charge_codes[0].charge_code_id]
				}];
			} else if (taxCount > 1) {
				calculation_rule_list = [{
					"value": 0,
					"name": "ChargeCodeBaseAmount",
					"charge_code_id_list": []
				}, {
					"value": 1,
					"name": "ChargeCodeplusTax 1",
					"charge_code_id_list": [$scope.prefetchData.linked_charge_codes[0].charge_code_id]
				}];
				/*
				 * Generating 3rd calculation rule manually in UI.
				 */
				var name = "ChargeCodeplusTax 1";
				var idList = [$scope.prefetchData.linked_charge_codes[0].charge_code_id];
				for (var i = 2; i <= taxCount; i++) {
					var name = name + " & " + i;
					idList.push($scope.prefetchData.linked_charge_codes[i - 1].charge_code_id);
				}
				var obj = {
					"value": 2,
					"name": name,
					"charge_code_id_list": idList
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

			$scope.addData = {
				"id": taxCount + 1,
				"is_inclusive": false,
				"calculation_rule_list": $scope.generateCalculationRule(taxCount)
			};
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
			tempEditData = dclone($scope.prefetchData.linked_charge_codes[index], []);
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
		$scope.toggleExclusive = function(index, value) {
			if ($scope.isAddTax) {
				$scope.addData.is_inclusive = value;
			} else if ($scope.isEditTax) {
				$scope.prefetchData.linked_charge_codes[index].is_inclusive = value;
			}
		};

		/*
		 * To set the selected payment type based on the id and cc_type from the dropdown.
		 */
		$scope.changeSelectedPaymentType = function() {
			if($scope.selected_payment_type.id !== ""){
				$scope.prefetchData.selected_payment_type = $scope.prefetchData.payment_types[$scope.selected_payment_type.id].value;
				$scope.prefetchData.is_cc_type = $scope.prefetchData.payment_types[$scope.selected_payment_type.id].is_cc_type;
			}
		};

		$scope.deleteTaxFromCaluculationPolicy = function(index) {
			/**
			 * 1. Make a DELETE request
			 * 		Remove the tax from the list in the repeater
			 * 2. Redo the calucation policy filter on all of them
			 * 		Get clarified with Product Team on how to handle the same
			 * 3. Make a SAVE requset IFF REQUIRED [ Might need to check how to work on the a dependent tax deletion! ]
			 */

			//1.
			$scope.prefetchData.linked_charge_codes.splice(index, 1);

			//2.
			// https://stayntouch.atlassian.net/browse/CICO-9576?focusedCommentId=52342&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-52342
			_.each($scope.prefetchData.linked_charge_codes, function(tax) {
				tax.selected_calculation_rule = 0;
			});

			//3.
			//NA as there is a save changes button

		};

	}
]);