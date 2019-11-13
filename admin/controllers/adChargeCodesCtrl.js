admin.controller('ADChargeCodesCtrl', ['$scope', 'ADChargeCodesSrv', 'ngTableParams', '$filter', '$timeout', '$state', '$rootScope', '$location', '$anchorScroll', 'ngDialog', 'ADRatesAddonsSrv', 'availableLanguages', 'ADRoomTypesSrv',
    function($scope, ADChargeCodesSrv, ngTableParams, $filter, $timeout, $state, $rootScope, $location, $anchorScroll, ngDialog, ADRatesAddonsSrv, availableLanguages, ADRoomTypesSrv) {

		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		$scope.$emit("changedSelectedMenu", 5);
		$scope.currentClickedElement = -1;
		$scope.currentClickedTaxElement = -1;
		$scope.isAdd = false;
		$scope.isAddTax = false;
		$scope.isEditTax = false;
		$scope.isEdit = false;
		$scope.disableChargeCodeType = false;
		$scope.disableViennaTax = false;
		$scope.successMessage = "";
		$scope.warningMessage = "";

		$scope.selected_payment_type = {};
		$scope.selected_payment_type.id = -1;
		$scope.prefetchData = {};

        $scope.stateAttributes = {
            selectedPaymentType: ''
        };

        var customTaxRuleObject = {
				"amount": 0.00,
				"shouldHideDateRange": true,
				"shouldHideNightRange": true,
				"shouldHideRoomRateRange": true,
				"shouldHideRoomType": true
			};

		var customTaxParameter = [{id: 1, value: "DATE_RANGE", description: "Date Range"},
								 {id: 2, value: "ROOM_RATE_RANGE", description: "Room Rate Range"},
								 {id: 3, value: "NIGHTS_RANGE", description: "Nights Range"},
								 {id: 4, value: "ROOM_TYPES", description: "Room Types"}];

        $scope.fetchRoomTypes = function() {
        	var successCallbackFetchRooms = function(response) {
        			$scope.roomTypes = response.room_types;
        // 			$scope.roomTypes.map(function(group) {
				    //   // if(excludedGroupIds.indexOf(group.id) > -1) {
				    //     // group.ticked = true;
				    //   // }
				    // });
	        	}, options = {
					params: {},
					successCallBack: successCallbackFetchRooms
				};

        	$scope.callAPI(ADRoomTypesSrv.fetch, options);
        };        

        $scope.fetchRoomTypes();

        $scope.availableLanguagesSet = availableLanguages;
		var defaultLanguage = _.filter(availableLanguages.languages, function(language) {
			return language.is_default;
		});
		var setDefaultLanguage = function() {
			$scope.selectedLanguage = {
				code: defaultLanguage.length ? defaultLanguage[0].code : 'en'
			};
		};
	    
	    setDefaultLanguage();

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

		var isEmptyValue = function(value) {
			var returnValue = true;

			if (value !== '' && value !== null) {
				returnValue = false;
			}
			return returnValue;
		};

		$scope.showDatePickerChargeCode = function(index, whichDate) {
			$scope.currentTaxIndex = index;
			$scope.whichDate = whichDate;
	        ngDialog.open({
                template: '/assets/partials/chargeCodes/adChargeCodeDatepicker.html',
                controller: 'ADchargeCodeDatepickerCtrl',
                className: 'ngdialog-theme-default single-calendar-modal',
                scope: $scope,
                closeByDocument: true
            });
		};

		$scope.onSelectRule = function(index) {
			if ($scope.prefetchData.custom_tax_rules[index].selectedTaxRule === "DATE_RANGE") {
				$scope.prefetchData.custom_tax_rules[index].from_date = '';
				$scope.prefetchData.custom_tax_rules[index].to_date = '';
				$scope.prefetchData.custom_tax_rules[index].shouldHideDateRange = false;

			} else if ($scope.prefetchData.custom_tax_rules[index].selectedTaxRule === "NIGHTS_RANGE") {
				$scope.prefetchData.custom_tax_rules[index].from_night_count = '';
				$scope.prefetchData.custom_tax_rules[index].to_night_count = '';
				$scope.prefetchData.custom_tax_rules[index].shouldHideNightRange = false;
			} else if ($scope.prefetchData.custom_tax_rules[index].selectedTaxRule === "ROOM_RATE_RANGE") {
				$scope.prefetchData.custom_tax_rules[index].from_night_count = '';
				$scope.prefetchData.custom_tax_rules[index].to_night_count = '';
				$scope.prefetchData.custom_tax_rules[index].shouldHideRoomRateRange = false;
			} else if ($scope.prefetchData.custom_tax_rules[index].selectedTaxRule === "ROOM_TYPES") {
				$scope.prefetchData.custom_tax_rules[index].from_night_count = '';
				$scope.prefetchData.custom_tax_rules[index].to_night_count = '';
				$scope.prefetchData.custom_tax_rules[index].shouldHideRoomType = false;
			}

			$scope.prefetchData.custom_tax_rules[index].remainingCustomTaxParameter = _.reject($scope.prefetchData.custom_tax_rules[index].remainingCustomTaxParameter, function(item) {
				return item.value === $scope.prefetchData.custom_tax_rules[index].selectedTaxRule;
			});
			
		};

		$scope.addNewTaxRule = function() {
			customTaxRuleObject.remainingCustomTaxParameter = customTaxParameter;
			customTaxRuleObject.allRoomTypes = $scope.roomTypes;
			$scope.prefetchData.custom_tax_rules.push(dclone(customTaxRuleObject));
			$scope.$digest();
		}


		var setUpCustomTaxRulesData = function(customTaxRules, customTaxParameter) {
			angular.forEach(customTaxRules, function(item, index) {
				item.allRoomTypes = $scope.roomTypes;
				item.remainingCustomTaxParameter = angular.copy(customTaxParameter);
				// TO DO: REmove each rules based on config
				if (item.from_date && !isEmptyValue(item.from_date) && item.to_date && !isEmptyValue(item.to_date)) {
					item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
						return item.value === "DATE_RANGE";
					});
				}
				if (item.from_night_count && !isEmptyValue(item.from_night_count) && item.to_night_count && !isEmptyValue(item.to_night_count)) {
				
					item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
						return item.value === "NIGHTS_RANGE";
					});
				}

				if (item.from_rate && !isEmptyValue(item.from_rate) && item.to_rate && !isEmptyValue(item.to_rate)) {

				
					item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
						return item.value === "ROOM_RATE_RANGE";
					});
				}

				if (item.room_types && item.room_types.length > 0) {
					item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
						return item.value === "ROOM_TYPES";
					});
				}

				if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "DATE_RANGE") !== -1) {
					item.shouldHideDateRange = true;
				}
				if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "NIGHTS_RANGE") !== -1) {
					item.shouldHideNightRange = true;
				}
				if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "ROOM_RATE_RANGE") !== -1) {
					item.shouldHideRoomRateRange = true;
				}
				if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "ROOM_TYPES") !== -1) {
					item.shouldHideRoomType = true;
				}

			});
			return customTaxRules;
		};

		$scope.deleteTaxRule = function(indexToBeDeleted) {
			$scope.prefetchData.custom_tax_rules = $scope.prefetchData.custom_tax_rules.splice(indexToBeDeleted);
		};

		$scope.deleteDateRange = function(indexToBeDeleted) {
			$scope.prefetchData.custom_tax_rules[indexToBeDeleted].shouldHideDateRange = true;
		};

		$scope.deleteRateRange = function(indexToBeDeleted) {
			$scope.prefetchData.custom_tax_rules[indexToBeDeleted].shouldHideRoomRateRange = true;
		};

		$scope.deleteNightsRange = function(indexToBeDeleted) {
			$scope.prefetchData.custom_tax_rules[indexToBeDeleted].shouldHideNightRange = true;
		};

		$scope.deleteRoomTypes = function(indexToBeDeleted) {
			$scope.prefetchData.custom_tax_rules[indexToBeDeleted].shouldHideRoomType = true;
		};

		/*
		 * To fetch charge code list
		 */

		/*
		 * To fetch the charge code details for add screen.
		 */
		$scope.addNewClicked = function() {
			$scope.editId = "";
			setDefaultLanguage();
			$scope.disableChargeCodeType = false;
			$scope.disableAddTax = false;
			$scope.viennaTaxCounter = 0;
			$scope.currentClickedElement = -1;
			$scope.isAddTax = false;
			$timeout(function() {
	            $location.hash('new-form-holder');
	            $anchorScroll();
        	});
			var fetchNewDetailsSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.isAdd = true;
				$scope.selected_payment_type.id = -1;







				data.custom_tax_parameters = customTaxParameter;
				
				data.custom_tax_rules = [];
				data.custom_tax_rules.push(dclone(customTaxRuleObject));

				data.custom_tax_rules = setUpCustomTaxRulesData(data.custom_tax_rules, data.custom_tax_parameters);



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

				$scope.prefetchData.overage_charge_code_id = "";
				$scope.prefetchData.spillage_charge_code_id = "";
				// Add New is at the top of the content window, scroll up for the user
				scrollTop();
			};

			$scope.invokeApi(ADChargeCodesSrv.fetchAddData, {}, fetchNewDetailsSuccessCallback);
		};

		var fetchChargeCodesForAllowance = function() {
			var chargeCodesSuccessCallback = function(data) {
                $scope.chargeCodes = data.results;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchChargeCodes, {}, chargeCodesSuccessCallback, '', 'NONE');
		};

		$scope.isAllowanceType = function(allowanceType) {
			var allowanceChargeCodeType = _.find($scope.prefetchData.charge_code_types, {
				name: "ALLOWANCE"
	        });
	        
	        return allowanceChargeCodeType.value === allowanceType;
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
				$scope.warningMessage = 'The recommended naming convention for Deposit VAT Charge codes is DEP001, DEP002, DEP003, etc.';
			} else if ($scope.isAllowanceType(selectedType)) {
				if (_.isUndefined($scope.chargeCodes)) {
					fetchChargeCodesForAllowance();
				}				
				var allowanceChargeGroup = _.find($scope.prefetchData.charge_groups, {
	                name: "Allowance"
	            });

				$scope.prefetchData.selected_charge_group = allowanceChargeGroup.value;
			} else if (selectedType === '12') {
				$scope.warningMessage = 'The recommended naming convention for Deposit Charge codes is DEP001, DEP002, DEP003, etc.';
			} else {
				$scope.warningMessage = '';
			}
		};

		$scope.clearWarningMessage = function () {
			$scope.warningMessage = '';
		};

		$scope.onChangeChargeGroup = function (chargeGroupID) {
			var chargeGroupp = _.find($scope.prefetchData.charge_groups, {
	            value: chargeGroupID
	        });
	        
			if (chargeGroupp.name === "Allowance") {
				if (_.isUndefined($scope.chargeCodes)) {
					fetchChargeCodesForAllowance();
				}

				$scope.prefetchData.selected_charge_code_type = _.find($scope.prefetchData.charge_code_types, {
					name: "ALLOWANCE"
		        }).value;
			}
		};

		/*
		 * To fetch the charge code details for edit screen.
		 */
		$scope.editSelected = function(index, value) {
			$scope.disableChargeCodeType = false;
			$scope.warningMessage = "";
			$scope.isAddTax = false;
			$scope.isAdd = false;
			$scope.disableAddTax = false;
			$scope.editId = value;
			$scope.currentClickedElement = index;
			var data = {
				'editId': value,
				'locale': $scope.selectedLanguage.code
			};			

			var editSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.prefetchData = {};
				$scope.selected_payment_type.id = -1;
				data.custom_tax_parameters = [{id: 1, value: "DATE_RANGE", description: "Date Range"},
 {id: 2, value: "ROOM_RATE_RANGE", description: "Room Rate Range"},
 {id: 3, value: "NIGHTS_RANGE", description: "Nights Range"},
 {id: 4, value: "ROOM_TYPES", description: "Room Types"}];
				
				data.custom_tax_rules = [
				    {
						"from_date": "10-12-2019",
						"to_date": "22-12-2019",
						"from_night_count": 1,
						"to_night_count": 10,
						"from_rate": 1,
						"to_rate": 25,
						"amount": 12.50,
						"room_types": [201, 202]
					},
				 	{
						"from_night_count": 11,
						"to_night_count": 21,
						"from_rate": 10,
						"to_rate": 250,
						"amount": 25.00,
						"room_types": [201, 205]
					},
					{
						"from_date": "10-12-2019",
						"to_date": "22-12-2019",
						"from_rate": 1,
						"to_rate": 25,
						"amount": 12.50,
						"room_types": []
					}];

			
				angular.forEach(data.custom_tax_rules, function(item, index) {
					item.remainingCustomTaxParameter = angular.copy(data.custom_tax_parameters);
					// TO DO: REmove each rules based on config
					if (item.from_date && !isEmptyValue(item.from_date) && item.to_date && !isEmptyValue(item.to_date)) {
						item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
							return item.value === "DATE_RANGE";
						});
					}
					if (item.from_night_count && !isEmptyValue(item.from_night_count) && item.to_night_count && !isEmptyValue(item.to_night_count)) {
					
						item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
							return item.value === "NIGHTS_RANGE";
						});
					}

					if (item.from_rate && !isEmptyValue(item.from_rate) && item.to_rate && !isEmptyValue(item.to_rate)) {

					
						item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
							return item.value === "ROOM_RATE_RANGE";
						});
					}

					if (item.room_types.length > 0) {
						item.remainingCustomTaxParameter = _.reject(item.remainingCustomTaxParameter, function(item) {
							return item.value === "ROOM_TYPES";
						});
					}

					if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "DATE_RANGE") !== -1) {
						item.shouldHideDateRange = true;
					}
					if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "NIGHTS_RANGE") !== -1) {
						item.shouldHideNightRange = true;
					}
					if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "ROOM_RATE_RANGE") !== -1) {
						item.shouldHideRoomRateRange = true;
					}
					if (_.indexOf(_.pluck(item.remainingCustomTaxParameter, 'value'), "ROOM_TYPES") !== -1) {
						item.shouldHideRoomType = true;
					}

				});

				$scope.prefetchData = data;
				$scope.prefetchData.allow_manual_posting = angular.isUndefined(data.allow_manual_posting) ? false : data.allow_manual_posting;
				$scope.prefetchData.selected_fees_code = $scope.prefetchData.selected_fees_code || '';
				$scope.prefetchData.linked_deposit_charge_code_id = $scope.prefetchData.linked_deposit_charge_code_id || '';
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
				if ($scope.prefetchData.selected_charge_code_type === "12") {
					$scope.disableChargeCodeType = true;
				}

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
				if ($scope.prefetchData.selected_charge_code_type) {
					fetchChargeCodesForAllowance();
				}
			};

			$scope.invokeApi(ADChargeCodesSrv.fetchEditData, data, editSuccessCallback);
		};

		$scope.onLanguageChange = function() {
			if ($scope.editId) {
				$scope.editSelected($scope.currentClickedElement, $scope.editId);
			} else {
				return;
			}
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
				setDefaultLanguage();
				$scope.$emit('hideLoader');
				if ($scope.isEdit) {
						$scope.data[parseInt($scope.currentClickedElement)].charge_code = data.charge_code;
						$scope.data[parseInt($scope.currentClickedElement)].description = data.description;
						$scope.data[parseInt($scope.currentClickedElement)].charge_group = data.charge_group;
						$scope.data[parseInt($scope.currentClickedElement)].charge_code_type = data.charge_code_type;
						$scope.data[parseInt($scope.currentClickedElement)].link_with = data.link_with;
				} 
				else {
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

			var failureCallback = function(error) {
				$scope.prefetchData.custom_tax_rules = currentCustomTaxRules;
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
					item.calculation_rules = item.calculation_rule_list[parseInt(item.selected_calculation_rule, 10)].charge_code_id_list;
				} // Tax 2 of Vienna Tax needs Charge code id of Tax 1 in Calculation rule array
				else if ($scope.prefetchData.linked_charge_codes[0].is_vienna_tax) {
					$scope.prefetchData.is_vienna_tax = true;
					if ($scope.prefetchData.linked_charge_codes[1]) {
						$scope.prefetchData.linked_charge_codes[1].calculation_rules = $scope.prefetchData.linked_charge_codes[1].calculation_rule_list[1].charge_code_id_list;
					}
				}
			});
			var customTaxRulesToApi = [],

				currentCustomTaxRules = angular.copy($scope.prefetchData.custom_tax_rules); // Used if the API fails need to show the same in UI

			angular.forEach($scope.prefetchData.custom_tax_rules, function(item, index) {
				item.room_types = [];
				angular.forEach(item.allRoomTypes, function(roomItem, roomIndex) {
					if (roomItem.ticked) {
						item.room_types.push(parseInt(roomItem.id));
					}
				});

				var unwantedKeys = ["allRoomTypes", "remainingCustomTaxParameter", "selectedTaxRule", "shouldHideDateRange", "shouldHideNightRange", "shouldHideRoomRateRange", "shouldHideRoomType"];
				 item = dclone(item, unwantedKeys);
				 customTaxRulesToApi.push(item)
			});


			$scope.prefetchData.custom_tax_rules = customTaxRulesToApi;

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
            postData.locale = $scope.selectedLanguage.code;

			$scope.invokeApi(ADChargeCodesSrv.save, postData, saveSuccessCallback, failureCallback);
		};
		/*
		 * To handle cancel button click.
		 */
		$scope.clickedCancel = function() {
			setDefaultLanguage();
			if ($scope.isAdd) {
				$scope.isAdd = false;
			}
			if ($scope.isEdit) {
				$scope.isEdit = false;
			}
			$scope.currentClickedElement = -1;
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
			var taxCount = $scope.prefetchData.linked_charge_codes.length,
				i = taxCount,
				isNotVienna = false;

			$scope.isAddTax = true;
			$scope.isEditTax = false;
			$scope.viennaTaxCounter = 0;
			$scope.disableViennaTax = false;
			// To find the count of prefetched tax details already there in UI.
			$scope.addData = {
				"id": taxCount + 1,
				"is_inclusive": false,
				"is_vienna_tax": false,
				"calculation_rule_list": $scope.generateCalculationRule(taxCount)
			};
			if (taxCount === 1 && $scope.prefetchData.linked_charge_codes[0].is_vienna_tax) {
				$scope.addData.is_inclusive = true;
				$scope.addData.is_vienna_tax = true;
				$scope.disableViennaTax = true;
			}
			while (i--) {
				if (!$scope.prefetchData.linked_charge_codes[i].is_vienna_tax) {
					isNotVienna = true;
				}
			}
			if (isNotVienna) {
				$scope.disableViennaTax = true;
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
			var taxCount = $scope.prefetchData.linked_charge_codes.length,
				i = taxCount,
				isNotVienna = false;

			$scope.isEditTax = true;
			$scope.isAddTax = false;
			while (i--) {
				if (!$scope.prefetchData.linked_charge_codes[i].is_vienna_tax) {
					isNotVienna = true;
				}
			}
			if (isNotVienna || !$scope.prefetchData.is_vienna_tax_enabled) {
				$scope.disableViennaTax = true;
			}
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
			var taxCount = $scope.prefetchData.linked_charge_codes.length,
				i = taxCount;

			while (i--) {
				if ($scope.prefetchData.linked_charge_codes[i].is_vienna_tax) {
					$scope.viennaTaxCounter += 1;
					if ($scope.viennaTaxCounter === 2) {
						$scope.disableAddTax = true;
					}
				}
			}
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
		 * To handle inclusive/exclusive radio button click.
		 */
		$scope.toggleViennaTax = function(index) {
			if ($scope.isAddTax) {
				$scope.addData.is_inclusive = true;
			} else if ($scope.isEditTax) {
				$scope.prefetchData.linked_charge_codes[index].is_inclusive = true;
				$scope.prefetchData.linked_charge_codes[index].is_vienna_tax = $scope.addData.is_vienna_tax;
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
			$scope.disableAddTax = false;
			$scope.viennaTaxCounter = 0;
			var taxCount = $scope.prefetchData.linked_charge_codes.length,
				i = taxCount;

			while (i--) {
				if ($scope.prefetchData.linked_charge_codes[i].is_vienna_tax) {
					$scope.viennaTaxCounter += 1;
					if ($scope.viennaTaxCounter === 2) {
						$scope.disableAddTax = true;
					}
				}
			}
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
            return $scope.isPmsConfigured || $scope.isTaxSelected() || $scope.isPaymentSelected() || $scope.isTouristTaxSelected();
        };

        $scope.isTaxSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('TAX');
        };

        $scope.isPaymentSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('PAYMENT');
        };

        $scope.isTouristTaxSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('TOURIST TAX');
        };

        $scope.isFeesSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('FEES');
		};
		
        $scope.isDepositSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('DEPOSIT');
		};
		
        $scope.isArManualBalanceSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('AR MANUAL BALANCE');
        };
		
        $scope.isArManualCreditSelected = function () {
            return parseInt($scope.prefetchData.selected_charge_code_type, 10) === ADChargeCodesSrv.getChargeCodeTypeValue('AR MANUAL CREDIT');
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
		
		$scope.filterViennaTaxCodes = function (editData) {
            return function (item) {
                if ($scope.isEditTax && editData.is_vienna_tax) {
                    return item.vienna_applicable;
                }

                if ($scope.isAddTax && $scope.addData.is_vienna_tax) {
                    return item.vienna_applicable;
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

	$scope.showListPageItems = function() {
		return $scope.currentClickedElement === -1 && (!$scope.isEdit || !$scope.isAdd);
	};

	}
]);
