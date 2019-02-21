admin.controller('ADChargeCodesCtrl', ['$scope', 'ADChargeCodesSrv', 'ngTableParams', '$filter', '$timeout', '$state', '$rootScope', '$location', '$anchorScroll', 'ngDialog',
    function($scope, ADChargeCodesSrv, ngTableParams, $filter, $timeout, $state, $rootScope, $location, $anchorScroll, ngDialog) {

        var CHARGE_CODE_TYPE_TAX = 1;
        var CHARGE_CODE_TYPE_PAYMENT = 2;
        var CHARGE_CODE_TYPE_FEES = 6;
        var CHARGE_CODE_TYPE_TOURIST = 8;

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

        $scope.stateAttributes = {
            selectedPaymentType: ''
        };

        /**
         * Method to generate a unique key from value and is_cc_type for the paymentType
         * @param {Object} paymentType
         * @return {string} composite id which would be unique for each payment type
         */
        function getPaymentTypeCompositeID(paymentType) {
            if (paymentType.value) {
                return (paymentType.is_cc_type ? 'CC' : 'NON_CC') + '_' + paymentType.value;
            }
            return '';
        }

		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params);
			var fetchSuccessOfItemList = function(data) {
				$scope.$emit('hideLoader');
				// No expanded rate view
				$scope.currentClickedElement = -1;
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
				$scope.data = data.charge_codes;
				$scope.is_connected_to_pms = data.is_connected_to_pms;
				$scope.currentPage = params.page();
	        	params.total(data.total_count);
	            $defer.resolve($scope.data);
			};

			$scope.invokeApi(ADChargeCodesSrv.fetch, getParams, fetchSuccessOfItemList);
		};


		$scope.loadTable = function() {
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


		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};
		
		var scrollTop = function() {
			$(".content-scroll").scrollTop(0);
			$scope.$emit('hideLoader');
			runDigestCycle();
		};
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
				$scope.prefetchData.allow_manual_posting = false;
				$scope.addIDForPaymentTypes();
                $scope.stateAttributes.selectedPaymentType = "";
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
				$scope.prefetchData.selected_amount_symbol = 'amount';
				// Add New is at the top of the content window, scroll up for the user
				scrollTop();
			};

			$scope.invokeApi(ADChargeCodesSrv.fetchAddData, {}, fetchNewDetailsSuccessCallback);
		};

		/**
		 * Callback for charge code type dropdown
		 * See comments in CICO-33997
		 * @param {Number} selectedType charge code type selected
		 * @return {Undefined} none
		 */
		$scope.onChangeChargeCodeType = function (selectedType) {
			/* if charge code type TAX(value 1) is selected
			 * reset sign and symbol to +ve
			 */
			if (selectedType === '1') {
				$scope.prefetchData.selected_amount_sign = '+';
				$scope.prefetchData.selected_amount_symbol = 'amount';
			}
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
				$scope.prefetchData.allow_manual_posting = (typeof data.allow_manual_posting === "undefined") ? false : data.allow_manual_posting;
				$scope.prefetchData.selected_fees_code = $scope.prefetchData.selected_fees_code || '';
				$scope.addIDForPaymentTypes();
                $scope.stateAttributes.selectedPaymentType = getPaymentTypeCompositeID({
                    value: $scope.prefetchData.selected_payment_type,
                    is_cc_type: $scope.prefetchData.is_cc_type
                });
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
		 * NOTE: The payment types obtained in the response DO NOT have a unique identifier
		 * Hence, this method assigns a unique identifier to each payment type, based on the value and is_cc_type fields
		 * Kindly refer CICO-40304 and CICO-31508 to identify why such an error occurs
		 */
        $scope.addIDForPaymentTypes = function() {
            _.each($scope.prefetchData.payment_types, function(paymentType) {
                paymentType['composite_id'] = getPaymentTypeCompositeID(paymentType);
            });
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

                                    if ($scope.orderedData) {
                                    if ($scope.orderedData[p]) {
					$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code = data.charge_code;
					$scope.orderedData[parseInt($scope.currentClickedElement)].description = data.description;
					$scope.orderedData[parseInt($scope.currentClickedElement)].charge_group = data.charge_group;
					$scope.orderedData[parseInt($scope.currentClickedElement)].charge_code_type = data.charge_code_type;
					$scope.orderedData[parseInt($scope.currentClickedElement)].link_with = data.link_with;
                                    }
                                    }

				} else {
					$scope.data.push(data);
					$scope.tableParams.reload();
				}

				$scope.currentClickedElement = -1;
				if ($scope.isAdd) {
					$scope.isAdd = false;
				}
				if ($scope.isEdit) {
					$scope.isEdit = false;
				}
				$scope.successMessage = 'Success!';
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
            
			var unwantedKeys = ["charge_code_types", "payment_types", "charge_groups", "link_with", "amount_types", "tax_codes", "post_types", "symbolList"];
			var postData = dclone($scope.prefetchData, unwantedKeys);

			// Include Charge code Link with List when selected_charge_code_type is not "TAX".
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

                        if ($scope.isStandAlone && !$scope.prefetchData.selected_charge_group) {
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
            var selectedPaymentType = _.find($scope.prefetchData.payment_types, {
                composite_id: $scope.stateAttributes.selectedPaymentType
            });

            $scope.prefetchData.is_cc_type = selectedPaymentType && selectedPaymentType.is_cc_type;
            $scope.prefetchData.selected_payment_type = selectedPaymentType && selectedPaymentType.value;
        };

		$scope.deleteTaxFromCaluculationPolicy = function(index) {
			/**
			 * 1. Make a DELETE request
			 * 		Remove the tax from the list in the repeater
			 * 2. Redo the calucation policy filter on all of them
			 * 		Get clarified with Product Team on how to handle the same
			 * 3. Make a SAVE requset IFF REQUIRED [ Might need to check how to work on the a dependent tax deletion! ]
			 */

			// 1.
			$scope.prefetchData.linked_charge_codes.splice(index, 1);

			// 2.
			// https://stayntouch.atlassian.net/browse/CICO-9576?focusedCommentId=52342&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-52342
			_.each($scope.prefetchData.linked_charge_codes, function(tax) {
				tax.selected_calculation_rule = 0;
			});

			// 3.
			// NA as there is a save changes button

		};

        /**
         * CICO-40001 hide add tax for Tax, Tourist tax and Payment
         * @return {Boolean} hide or not
         */
        $scope.shouldHideAddTaxOption = function () {
            var selectedType = parseInt($scope.prefetchData.selected_charge_code_type, 10);
            var isTaxSelected = selectedType === CHARGE_CODE_TYPE_TAX;
            var isPaymentSelected = selectedType === CHARGE_CODE_TYPE_PAYMENT;
            var isTouristSelected = selectedType === CHARGE_CODE_TYPE_TOURIST;

            return $scope.isPmsConfigured || isTaxSelected || isPaymentSelected || isTouristSelected;
        };

        $scope.isTaxSelected = function () {
            var selectedType = parseInt($scope.prefetchData.selected_charge_code_type, 10);

            return selectedType === CHARGE_CODE_TYPE_TAX;
        };

        $scope.isPaymentSelected = function () {
            var selectedType = parseInt($scope.prefetchData.selected_charge_code_type, 10);
            
            return selectedType === CHARGE_CODE_TYPE_PAYMENT;
        };

        $scope.isTouristTaxSelected = function () {
            var selectedType = parseInt($scope.prefetchData.selected_charge_code_type, 10);
            
            return selectedType === CHARGE_CODE_TYPE_TOURIST;
        };

        $scope.isFeesSelected = function () {
            var selectedType = parseInt($scope.prefetchData.selected_charge_code_type, 10);
            
            return selectedType === CHARGE_CODE_TYPE_FEES;
        };

        /**
         * CICO-40001
         * Filter charge codes in add tax form based on exclusive_only flag
         * @param  {Object} editData data when in edit mode
         * @return {Boolean} show or not
         */
        $scope.filterTaxCodes = function (editData) {
            return function (item) {
                if ($scope.isEditTax && editData.is_inclusive) {
                    return !item.exclusive_only;
                }

                if ($scope.isAddTax && $scope.addData.is_inclusive) {
                    return !item.exclusive_only;
                }

                return true;
            };
        };

	$scope.openCsvUploadPopup = function() {
		$scope.csvData = {
			'csv_file': ''
		};
		ngDialog.open({
			template: '/assets/partials/popups/adCsvUploadPopUp.html',
			className: 'ngdialog-theme-default1 modal-theme1',
			closeByDocument: true,
			scope: $scope
		});
	};

	$scope.uploadCSVFile = function() {
		var uploadCSVFileSuccess = function() {
			$scope.successMessage = $filter('translate')('IMPORT_IS_IN_PROGRESS');
			ngDialog.close();
			$timeout(function() {
				$scope.successMessage = "";
			}, 10000);
		};
		var options = {
			params: $scope.csvData,
			onSuccess: uploadCSVFileSuccess,
			onFailure: function(err) {
				ngDialog.close();
				$scope.errorMessage = err;
			}
		};

		$scope.callAPI(ADChargeCodesSrv.uploadCSVFile, options);
	};

	}
]);
