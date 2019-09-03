admin.controller('ADaddRatesDetailCtrl', ['$scope', '$state', '$rootScope', 'ADRatesAddDetailsSrv', 'ngDialog', 'ADReservationToolsSrv',
    function($scope, $state, $rootScope, ADRatesAddDetailsSrv, ngDialog, ADReservationToolsSrv) {

        var initialRateData = {};

        $scope.init = function() {
            BaseCtrl.call(this, $scope);
            $scope.rateTypesDetails = {};
            $scope.defaultWorkTypeTasks = [];
            setRateInitialData();
            getTasksForDefaultWorkType();
            $scope.detailsMenu = '';
            $scope.isStandAlone = $rootScope.isStandAlone;
            $scope.disableDayUseToggle = false;
        };
        $scope.getSubtask = function(task) {
            var subtask = [];

            subtask = _.filter(task, function(item) {
                        return item.is_default == true;
                    });
          return subtask;
        };
        var getTasksForDefaultWorkType = function() {
            var succesCallBack = function(data) {
                $scope.defaultWorkTypeTasks = data.results;
                $scope.selectedWorkTypeTask = {};
                _.each(data.results, function(workType) {
                    var selectedTaskIds = _.pluck($scope.rateData.tasks, "id"),
                        currentSelection = _.find(workType.tasks, function(task) {
                        return _.indexOf(selectedTaskIds, task.id) > -1;
                    });

                    var defaultTask = null;

                    if (!currentSelection && !$scope.is_edit) {
                        defaultTask = _.find(workType.tasks, {
                            is_default: true
                        });
                    }

                    $scope.selectedWorkTypeTask[workType.value] = (currentSelection && currentSelection.id) ||
                        (defaultTask && defaultTask.id) || "";
                });

                $scope.updateSelectedTaskslist();
                $scope.$emit('hideLoader');
           };
            var failureCallBack = function(error) {
                $scope.errorMessage = error;
            };
            var params = {
                work_type_id: $scope.rateTypesDetails.hotel_settings.default_work_type.id
            };

            // $scope.invokeApi(ADRatesAddDetailsSrv.fetTasksForDefaultWorkType, params, succesCallBack, failureCallBack);

            $scope.invokeApi(ADRatesAddDetailsSrv.fetchWorkTypesValues, params, succesCallBack, failureCallBack);
        };

        /*
         * change detials sub menu selection
         */
        $scope.changeDetailsMenu = function(selectedMenu) {
            $scope.detailsMenu = selectedMenu;
        };

        $scope.shouldShowMemberRates = function() {
            return !$rootScope.isHourlyRatesEnabled && (!!$rootScope.isFFPActive || !!$rootScope.isHLPActive);
        };

        $scope.shouldShowPeriodicity = function() {
            return $rootScope.isHourlyRatesEnabled || $rootScope.hourlyRatesForDayUseEnabled;
        };
        
        $scope.shouldShowBasedOnAndCopy = function() {
            return !$scope.rateData.is_hourly_rate;
        };

        $scope.shouldDisableBasedOnAndCopy = function() {
            var basedOnData = $scope.rateData.based_on;

            return $scope.is_edit && (basedOnData.id === '' || basedOnData.is_copied);
        };

        $scope.shouldShowMinThreshold = function() {
            var basedOnData = $scope.rateData.based_on;

            return basedOnData.id === '' || basedOnData.id === null;
        };

        $scope.isHourlyRatesEnabled = function () {
            return !!$rootScope.isHourlyRatesEnabled;
        };

        $scope.isPromotional = function() {
            var ispromo = false, classification = '';

            if ($scope.rateTypesDetails) {
                angular.forEach($scope.rateTypesDetails.rate_types, function(rate_type) {
                    if ($scope.rateData.rate_type.id === rate_type.id) {
                        if ($scope.rateData.classification) {
                            classification = $scope.rateData.classification.toLowerCase();
                        } else {
                            classification = '';
                        }

                        if (classification === 'specials') {
                            ispromo = true;
                        } else {
                            ispromo = false;
                        }
                    }
                });
            }
            return ispromo;
        };

        /*
         * Validate Rate Details Form
         */

        $scope.isFormValid = function() {
            if (!$scope.rateData.name || !$scope.rateData.description || !$scope.rateData.rate_type.id || !$scope.rateData.charge_code_id) {
                return false;
            }
            if (($scope.rateData.name.length <= 0) || ($scope.rateData.description.length <= 0) || ($scope.rateData.rate_type.id.length <= 0)) {
                return false;
            }
            return true;
        };


        /*
         * Fetch Details
         */

        var setRateInitialData = function() {
            $scope.rateTypesDetails = $scope.rateInitialData;
            /**
             * CICO-9289 - This switch will only show if the Reservation Setting 'Hourly Rates' has been switched on (see CICO-9435) and then default to 'Hourly'
             * If parameter is switched off, do not show the switch (but default setup to Daily).
             */
            if (!$scope.rateData.id) {
                $scope.rateData.is_hourly_rate = $rootScope.isHourlyRatesEnabled;
            }
            initialRateData = angular.copy($scope.rateData);

            $scope.rateTypesDetails.markets = $scope.rateTypesDetails.is_use_markets ? $scope.rateTypesDetails.markets : [];
            $scope.rateTypesDetails.sources = $scope.rateTypesDetails.is_use_sources ? $scope.rateTypesDetails.sources : [];

            /*
             * manipulate data to display inside dropdown
             */
            angular.forEach($scope.rateTypesDetails.depositPolicies, function(depositPolicy) {
                var symbol = (depositPolicy.amount_type === "amount") ? '$' : '%';

                if (symbol === '%') {
                    depositPolicy.displayData = depositPolicy.name + "   " + "(" + depositPolicy.amount + symbol + ")";
                } else {
                    depositPolicy.displayData = depositPolicy.name + "   " + "(" + symbol + depositPolicy.amount + ")";
                }
            });
            angular.forEach($scope.rateTypesDetails.cancelationPenalties, function(cancelationPenalty) {
                var symbol = (cancelationPenalty.amount_type === "amount") ? '$' : '%';

                if (cancelationPenalty.amount_type === "amount") {
                	symbol = "$";
                } else if (cancelationPenalty.amount_type === "day") {
                	symbol = "Night(s)";
                } else {
                	symbol = "%";
                }

                if (symbol === '%') {
                    cancelationPenalty.displayData = cancelationPenalty.name + "   " + "(" + cancelationPenalty.amount + symbol + ")";
                } else if (symbol === 'Night(s)') {
                	cancelationPenalty.displayData = cancelationPenalty.name + "   " + "(" + cancelationPenalty.amount + ' ' + symbol + ")";
                } else {
                    cancelationPenalty.displayData = cancelationPenalty.name + "   " + "(" + symbol + cancelationPenalty.amount + ")";
                }
            });
            /*
             * empty the list if not activated
             */

            $scope.rateTypesDetails.depositPolicies = $scope.depositRequiredActivated ? $scope.rateTypesDetails.depositPolicies : [];
            $scope.rateTypesDetails.cancelationPenalties = $scope.cancelPenaltiesActivated ? $scope.rateTypesDetails.cancelationPenalties : [];

            $scope.rateData.last_sync_status = null;
            $scope.rateData.last_sync_at = null;
            $scope.showRoundingOptions();
        };
        /*
         * Set commission data
         */
        var setupCommissionData = function() {
            if (typeof $scope.rateData.commission_details !== 'undefined') {
                var chargeCodes = $scope.rateData.commission_details.charge_codes,
                    selectedChargeCodes = [];

                if ( typeof chargeCodes !== 'undefined' && chargeCodes.length > 0 ) {
                    angular.forEach( chargeCodes, function( item, index) {
                        if ( item.is_checked ) {
                            selectedChargeCodes.push(item.id);
                        }
                    });
                }

                var commissionData = dclone($scope.rateData.commission_details, ["charge_codes"]);

                commissionData.selected_commission_charge_code_ids = selectedChargeCodes;
            }
            return commissionData;
        };
        /*
         * Set add on data
         */
        var setUpAddOnData = function() {
            var addOnsArray = [],
                selectedAddons = [];

            angular.forEach($scope.rateData.addOns, function(addOns) {
                if (addOns.isSelected) {
                    var data = {};

                    data.is_inclusive_in_rate = addOns.is_inclusive_in_rate;
                    data.addon_id = addOns.id;
                    addOnsArray.push(data);
                    selectedAddons.push(addOns.id);
                }
            });
            // CICO-49136. We need to compare existing addons and 
            // selected addons on update. If both are same no need to pass that param to API
            $scope.selectedAddonsIds = selectedAddons;
            $scope.selectedAddons = addOnsArray;
            return addOnsArray;
        };

        // Method to check whether based on rate is changed before saving.
        var checkBasedOnRateChanged = function() {
            var isBasedOnRateChanged = false;

            if (initialRateData.based_on.id !== $scope.rateData.based_on.id) {
                isBasedOnRateChanged = true;
            }

            return isBasedOnRateChanged;
        };

        $scope.startSave = function() {
            var amount = parseFloat($scope.rateData.based_on.value_sign + $scope.rateData.based_on.value_abs);
            var addOns = setUpAddOnData();
            var commissions = setupCommissionData();

            angular.forEach($scope.rateData.tasks, function(rateTasks) {
                if (rateTasks.id !== undefined) {
                    rateTasks.task_id = rateTasks.id;
                }
                // API throws erros if these keys are passed - so deleting - CICO-30780
                delete rateTasks["id"];
                delete rateTasks["name"];
            });
            var data = {
                'name': $scope.rateData.name,
                'description': $scope.rateData.description,
                'rate_type_id': $scope.rateData.rate_type.id,
                'based_on_rate_id': $scope.rateData.based_on.id,
                'based_on_type': $scope.rateData.based_on.id === null ? null : $scope.rateData.based_on.type,
                'based_on_value': $scope.rateData.based_on.id === null ? null : amount,
                'promotion_code': $scope.rateData.promotion_code,
                'charge_code_id': $scope.rateData.charge_code_id,
                'fixed_it_id': $scope.rateData.fixed_it_id,
                'currency_code_id': $scope.rateData.currency_code_id,
                'min_advanced_booking': $scope.rateData.min_advanced_booking,
                'max_advanced_booking': $scope.rateData.max_advanced_booking,
                'min_stay': $scope.rateData.min_stay,
                'max_stay': $scope.rateData.max_stay,
                'use_rate_levels': $scope.rateData.use_rate_levels,
                'is_suppress_rate_on': $scope.rateData.is_suppress_rate_on,
                'is_discount_allowed_on': $scope.rateData.is_discount_allowed_on,
                'source_id': $scope.rateData.source_id,
                'market_segment_id': $scope.rateData.market_segment_id,
                'cancellation_policy_id': $scope.rateData.cancellation_policy_id,
                'deposit_policy_id': $scope.rateData.deposit_policy_id,
                'end_date': $scope.rateData.end_date,
                'is_hourly_rate': $scope.rateData.is_hourly_rate,
                'commission_details': commissions,
                'is_member': $scope.rateData.is_member_rate ? $scope.rateData.is_member_rate : false,
                'is_public_rate': $scope.rateData.is_public_rate,
                'is_pms_only': $scope.rateData.is_pms_only,
                'is_channel_only': $scope.rateData.is_channel_only,
                'code': $scope.rateData.code,
                'task_id': $scope.rateData.task_id,
                'is_copied': ($scope.rateData.based_on.is_copied == undefined) ? false : $scope.rateData.based_on.is_copied,
                'booking_origin_id': $scope.rateData.booking_origin_id,
                'tasks': $scope.rateData.tasks,
                'is_day_use': $scope.rateData.is_day_use,
                'round_type_id': $scope.rateData.round_type_id,
                'min_threshold_percent': ($scope.rateData.based_on.id === null || $scope.rateData.based_on.id === "") ? $scope.rateData.min_threshold_percent : null
            };

            // Save Rate Success Callback
            var saveSuccessCallback = function(data) {
                // CICO-55171: If Based on rate is changed while editing, go and refresh page..
                if ($scope.is_edit && checkBasedOnRateChanged()) {
                    $scope.$emit('hideLoader');
                    $state.go('admin.rates');
                }
                $scope.manipulateData(data);
                $scope.detailsMenu = "";
                $('#activityLogArea').scope().detailsMenu = '';
                $scope.$emit('hideLoader');
                
                if ($scope.rateData.based_on && $scope.rateData.based_on.is_copied == true) {
                    $scope.$emit("activateSetTab");
                } 
                else {
                    $scope.$emit("changeMenu", 'Room types');
                }
                $scope.$emit("rateChangedFromDetails");
            };

            var saveFailureCallback = function(data) {
                $scope.$emit('hideLoader');
                $scope.$emit("errorReceived", data);
            };

            if (!$scope.rateData.id) {
                data.addons = addOns;
                $scope.invokeApi(ADRatesAddDetailsSrv.createNewRate, data, saveSuccessCallback, saveFailureCallback);
            } 
            else {
                // CICO-49136. We need to compare existing addons and 
                // selected addons on update. If both are same no need to pass that param to API
                var addonsDifferenceCount = 0;

                if ( $scope.existingAddonsIds.length > 0 ) {
                    if ($scope.existingAddonsIds.length >= $scope.selectedAddonsIds.length) {
                        addonsDifferenceCount = (_.difference($scope.existingAddonsIds, $scope.selectedAddonsIds)).length;
                    } else {
                        addonsDifferenceCount = (_.difference($scope.selectedAddonsIds, $scope.existingAddonsIds)).length;
                    }                    
                } else {
                    addonsDifferenceCount = $scope.selectedAddonsIds.length;
                }
                
                
                if (addonsDifferenceCount > 0) {
                    data.addons = addOns;
                } else {
                    var changedDataCount = 0;

                    angular.forEach($scope.existingAddons, function(addOn) {
                        var currentItem = _.find($scope.selectedAddons, function(item) {
                            return item.addon_id === addOn.id;
                        });

                        if (typeof currentItem !== 'undefined') {
                            if (currentItem.is_inclusive_in_rate !== addOn.is_inclusive_in_rate.toString()) {
                                changedDataCount++;
                            }
                        }
                            
                    });

                    if (changedDataCount > 0) {
                        data.addons = addOns;
                    }
                }
                $scope.existingAddonsIds = $scope.selectedAddonsIds;

                var updatedData = {
                    'updatedData': data,
                    'rateId': $scope.rateData.id
                };

                $scope.invokeApi(ADRatesAddDetailsSrv.updateNewRate, updatedData, saveSuccessCallback, saveFailureCallback);
            }
        };


        $scope.endDateValidationPopup = function() {
            ngDialog.open({
                template: '/assets/partials/rates/adRatesEndDateValidationPopup.html',
                controller: 'adRatesEndDateValidationPopupController',
                className: 'ngdialog-theme-default single-calendar-modal',
                scope: $scope,
                closeByDocument: true
            });
        };

        /*
         * Save Rate Details
         */

        $scope.saveRateDetails = function() {
            var validateEndDateSuccessCallback = function(data) {

                $scope.$emit('hideLoader');
                if (data.status) {
                    $scope.startSave();
                }
                else {
                    $scope.endDateValidationPopup();
                }
            };

            var validateEndDateFailureCallback = function(data) {
                $scope.$emit('hideLoader');

            };

            if ($scope.rateData.end_date) {
                if ($scope.rateData.id) {
                    var data = {
                        "id": $scope.rateData.id,
                        "end_date": $scope.rateData.end_date
                    };

                    $scope.invokeApi(ADRatesAddDetailsSrv.validateEndDate, data, validateEndDateSuccessCallback, validateEndDateFailureCallback);
                } else {
                    $scope.startSave();
                }
            } else {
                $scope.startSave();
            }
        };

        $scope.isEmpty = function (obj) {
            return _.isEmpty(obj);
        };

        $scope.deleteEndDate = function() {
            $scope.rateData.end_date = "";
            $scope.rateData.end_date_for_display = "";
        };

        $scope.popupCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/rates/adRatesAdditionalDetailsPicker.html',
                controller: 'adEndDatePickerController',
                className: 'ngdialog-theme-default single-calendar-modal',
                scope: $scope,
                closeByDocument: true
            });
        };

        $scope.toggleHourlyRate = function(value) {
            if ($scope.rateData.date_ranges.length < 1) {
                $scope.rateData.is_hourly_rate = value;
            }
            // While Switching to Hourly - Reset Day use flag to false.
            if (value) {
                $scope.rateData.is_day_use = false;
            }
        };

        $scope.togglePMSOnly = function() {
            if (!!$scope.rateData.is_channel_only && !!$scope.rateData.is_pms_only) {
                $scope.rateData.is_channel_only = false;
            }

        };

        $scope.toggleChannelOnly = function() {
            if (!!$scope.rateData.is_channel_only && !!$scope.rateData.is_pms_only) {
                $scope.rateData.is_pms_only = false;
            }
        };

        // CICO-24645 -  Show Tax Incl / Excl indicator on changing Charge code.
        $scope.onChangeChargeCode = function() {

            var selectedObj = _.find( $scope.rateTypesDetails.charge_codes, function(obj) {
                                    return obj.id === $scope.rateData.charge_code_id;
                                });

            $scope.rateData.tax_inclusive_or_exclusive = selectedObj.tax_inclusive_or_exclusive;
            // CICO-56637 - For new rates show the commission charge codes when selecting charge code
            $scope.rateData.commission_details.charge_codes = selectedObj.taxes;
            $scope.rateData.commission_details.charge_codes.push({ id: selectedObj.id, name: selectedObj.description, code: selectedObj.name });
        };

        $scope.updateSelectedTaskslist = function () {
            $scope.rateData.tasks = [];
            _.each($scope.selectedWorkTypeTask, function (value, taskType) {
                var taskType = _.find($scope.defaultWorkTypeTasks, {
                    value: taskType
                });

                var selectedTask = _.find(taskType.tasks, {id: parseInt(value)});

                if (!!selectedTask) {
                    $scope.rateData.tasks.push({
                        task_id: selectedTask.id
                    });
                }
            });
        };

        /*  
         *  Handle Sync button click.
         */
        $scope.clickedSyncButton = function() {
            var successCallback = function(data) {
                $scope.rateData.last_sync_status = data.last_sync_status;
                $scope.rateData.last_sync_at = data.last_sync_at;
            },
            failureCallback = function(errorMessage) {
                $scope.errorMessage = errorMessage;
            },
            data = {
                id: $scope.rateData.id
            },
            options = {
                params: data,
                successCallBack: successCallback,
                failureCallBack: failureCallback
            };

            $scope.callAPI(ADReservationToolsSrv.reSyncRates, options);
        };
        // Handle based on rate change
        $scope.basedOnRateChanged = function() {
            if ($scope.rateData.based_on.id) {
                var fullRateList = $scope.rateTypesDetails.based_on.results,
                    selectedRate = _.find(fullRateList, function(item) { return item.id === $scope.rateData.based_on.id; });

                $scope.rateData.is_day_use = selectedRate.is_day_use;
                $scope.disableDayUseToggle = true;
                $scope.rateData.basedOnRateUnselected = false;
            }
            else {
                $scope.rateData.round_type_id = null;
                // not selecting any rate.
                $scope.disableDayUseToggle = false;
                $scope.rateData.basedOnRateUnselected = true;
            }
        };

        /**
         * check to see if round_types drop-down should be shown
         */
        $scope.showRoundingOptions = function() {
            var enableRoundingOptions =
                $scope.rateData.based_on.id &&
                $scope.rateData.based_on.value_sign &&
                $scope.rateData.based_on.value_abs &&
                $scope.rateData.based_on.type;

            return enableRoundingOptions;
        };

        // CICO-56662
        var listener = $scope.$on('INIT_RATE_DETAILS', function() {
            $scope.init();
        });

        $scope.$on('$destroy', listener );
    }
]);
