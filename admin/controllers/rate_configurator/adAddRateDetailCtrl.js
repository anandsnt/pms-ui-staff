admin.controller('ADaddRatesDetailCtrl', ['$scope', '$rootScope', 'ADRatesAddDetailsSrv', 'ngDialog',
    function($scope, $rootScope, ADRatesAddDetailsSrv, ngDialog) {

        $scope.init = function() {
            BaseCtrl.call(this, $scope);
            $scope.rateTypesDetails = {};
            $scope.defaultWorkTypeTasks = [];
            setRateInitialData();
            getTasksForDefaultWorkType();
            $scope.detailsMenu = '';
            $scope.isStandAlone = $rootScope.isStandAlone;
        };

        var getTasksForDefaultWorkType = function() {
            var succesCallBack = function(data) {
                $scope.defaultWorkTypeTasks = data.results;
                if (!$scope.rateData.task_id){
                    var defaultTask = _.findWhere(data.results, {
                        is_default: true
                    });

                    if (defaultTask) {
                        $scope.rateData.task_id = defaultTask.id;
                    }
                }
            };
            var failureCallBack = function(error) {
                $scope.errorMessage = error;
            };
            var params = {
                work_type_id: $scope.rateTypesDetails.hotel_settings.default_work_type.id
            };

            $scope.invokeApi(ADRatesAddDetailsSrv.fetTasksForDefaultWorkType, params, succesCallBack, failureCallBack);
        };

        /*
         * change detials sub menu selection
         */
        $scope.changeDetailsMenu = function(selectedMenu) {
            $scope.detailsMenu = selectedMenu;
        };

        $scope.shouldShowMemberRates = function(){
            return !$rootScope.isHourlyRatesEnabled && (!!$rootScope.isFFPActive || !!$rootScope.isHLPActive);
        };

        $scope.isHourlyRatesEnabled = function () {
            return !!$rootScope.isHourlyRatesEnabled;
        };

        $scope.isPromotional = function() {
            var ispromo = false, classification = '';
            if ($scope.rateTypesDetails) {
                angular.forEach($scope.rateTypesDetails.rate_types, function(rate_type) {
                    if ($scope.rateData.rate_type.id === rate_type.id) {
                        if ($scope.rateData.classification){
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
                if(cancelationPenalty.amount_type === "amount") {
                	symbol = "$";
                } else if(cancelationPenalty.amount_type === "day") {
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
            $scope.rateData.currency_code_id = $scope.rateTypesDetails.hotel_settings.currency.id;
        };
        /*
         * Set commission data
         */
        var setupCommissionData = function(){
            if(typeof $scope.rateData.commission_details !== 'undefined'){
                var chargeCodes = $scope.rateData.commission_details.charge_codes,
                    selectedChargeCodes = [];

                if( typeof chargeCodes !== 'undefined' && chargeCodes.length >0 ){
                    angular.forEach( chargeCodes ,function( item, index) {
                        if( item.is_checked ){
                            selectedChargeCodes.push(item.id);
                        }
                    });
                }

                var commissionData = dclone($scope.rateData.commission_details,["charge_codes"]);
                commissionData.selected_commission_charge_code_ids = selectedChargeCodes;
            }
            return commissionData;
        };
        /*
         * Set add on data
         */
        var setUpAddOnData = function() {
            var addOnsArray = [];
            angular.forEach($scope.rateData.addOns, function(addOns) {
                if (addOns.isSelected) {
                    var data = {};
                    data.is_inclusive_in_rate = addOns.is_inclusive_in_rate;
                    data.addon_id = addOns.id;
                    addOnsArray.push(data);
                }
            });
            return addOnsArray;
        };

        $scope.startSave = function() {
            var amount = parseInt($scope.rateData.based_on.value_sign + $scope.rateData.based_on.value_abs);
            var addOns = setUpAddOnData();
            var commissions = setupCommissionData();
            var data = {
                'name': $scope.rateData.name,
                'description': $scope.rateData.description,
                'rate_type_id': $scope.rateData.rate_type.id,
                'based_on_rate_id': $scope.rateData.based_on.id,
                'based_on_type': $scope.rateData.based_on.type,
                'based_on_value': amount,
                'promotion_code': $scope.rateData.promotion_code,
                'addons': addOns,
                'charge_code_id': $scope.rateData.charge_code_id,
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
                'commission_details':commissions,
                'is_member': $scope.rateData.is_member_rate,
                'is_pms_only' : $scope.rateData.is_pms_only,
                'is_channel_only' : $scope.rateData.is_channel_only,
                'code':$scope.rateData.code,
                'task_id': $scope.rateData.task_id,
                'is_copied' : $scope.rateData.is_copied,
                'booking_origin_id' : $scope.rateData.booking_origin_id
            };

            // Save Rate Success Callback
            var saveSuccessCallback = function(data) {
                $scope.manipulateData(data);
                $scope.detailsMenu = "";
                $('#activityLogArea').scope().detailsMenu = '';
                $scope.$emit('hideLoader');
                $scope.$emit("changeMenu", 'Room types');
                $scope.$emit("rateChangedFromDetails");

            };
            var saveFailureCallback = function(data) {
                $scope.$emit('hideLoader');
                $scope.$emit("errorReceived", data);
            };

            if (!$scope.rateData.id) {
                $scope.invokeApi(ADRatesAddDetailsSrv.createNewRate, data, saveSuccessCallback, saveFailureCallback);
            } else {
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
        };

        $scope.togglePMSOnly = function(){
            if(!!$scope.rateData.is_channel_only && !!$scope.rateData.is_pms_only){
                $scope.rateData.is_channel_only = false;
            }

        };

        $scope.toggleChannelOnly = function(){
            if(!!$scope.rateData.is_channel_only && !!$scope.rateData.is_pms_only){
                $scope.rateData.is_pms_only = false;
            }
        };

        // CICO-24645 -  Show Tax Incl / Excl indicator on changing Charge code.
        $scope.onChangeChargeCode = function(){

            var selectedObj = _.find( $scope.rateTypesDetails.charge_codes, function(obj){
                                    return obj.id === $scope.rateData.charge_code_id;
                                });
            $scope.rateData.tax_inclusive_or_exclusive = selectedObj.tax_inclusive_or_exclusive;
        };

        $scope.init();
    }
]);