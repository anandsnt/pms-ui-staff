admin.controller('ADAddnewRate', ['$scope', 'ADRatesRangeSrv', 'ADRatesSrv', '$state', '$stateParams', 'rateInitialData', 'rateDetails', '$filter', '$rootScope', 'ADOriginsSrv', 'ADRatesAddDetailsSrv', 'availableLanguages',
    function($scope, ADRatesRangeSrv, ADRatesSrv, $state, $stateParams, rateInitialData, rateDetails, $filter, $rootScope, ADOriginsSrv, ADRatesAddDetailsSrv, availableLanguages) {

        $scope.init = function() {
            BaseCtrl.call(this, $scope);

            var defaultLanguage = _.filter(availableLanguages.languages, function(language) {
                return language.is_default;
            });
            
            $scope.availableLanguagesSet = availableLanguages;

            $scope.otherData = {
                'setChanged': false,
                'activeDateRange': '',
                'activeDateRangeIndex': '',
                'rateSavePromptOpen': false,
                'isEdit': false,
                'notIsBasedOn': true
            };

            $scope.is_edit = false;
            // activate Rate Details View
            $scope.rateMenu = '';
            $scope.prevMenu = "";
            // set here so as to avoid page reloading resulting in bussinness date being accessed before its being set in rootscope.
            $scope.businessDate = rateInitialData.business_date;
            // intialize rateData dictionary - START
            $scope.rateData = {
                "id": "",
                "name": "",
                "description": "",
                "code": "",
                "based_on": {
                    "id": "",
                    "type": "",
                    "value_abs": "",
                    "value_sign": "",
                    "is_copied": false
                },
                "rate_type": {
                    "id": "",
                    "name": ""
                },
                "status": true,
                "room_type_ids": [],
                "round_type_id": '',
                "promotion_code": "",
                "date_ranges": [],
                "addOns": [],
                "end_date": "",
                "end_date_for_display": "",
                "commission_details": {},
                "basedOnRateUnselected": false,
                "is_discount_allowed_on": true, // CICO-25305 - For new rates we are enabling default,
                "selectedLanguage": {
                    "code": defaultLanguage.length ? defaultLanguage[0].code : 'en'
                }
            };
            // intialize rateData dictionary - END
            $scope.originOfBookings = [];
            $scope.allAddOns = [];
            $scope.basedonRateData = {};
            $scope.errorMessage = '';
            // Added for CICO-24988
            $scope.isOriginOfBookingEnabled = ADRatesAddDetailsSrv.addRatesDetailsData.hotel_settings.reservation_type.is_origin_of_booking_enabled;
            // webservice call to fetch rate details for edit
            // New arrays used for CICO-49136. We need to compare existing addons and 
            // selected addons on update. If both are same no need to pass that param to API
            $scope.existingAddonsIds = [];
            $scope.existingAddons = [];
            $scope.selectedAddonsIds = [];
            $scope.selectedAddons = [];
            if ($stateParams.rateId) {
                setRateDetails(rateDetails);
                $scope.is_edit = true;
                if (rateDetails.based_on && rateDetails.based_on.id) {
                    $scope.otherData.notIsBasedOn = (rateDetails.based_on.is_copied) ? false :  true;
                }
                $scope.otherData.isEdit = true;
                var existingAddonsIds = [],
                    existingAddons = [];

                angular.forEach(rateDetails.addons, function(addOn) {
                    existingAddonsIds.push(addOn.id);
                    existingAddons.push(addOn);
                });
                $scope.existingAddonsIds = existingAddonsIds;
                $scope.existingAddons = existingAddons;
            }
            else {
                setRateAdditionalDetails();
            }
        };

        // Method to invoke initial API calls when edit a list.
        var initialAPIcalls = function() {
            if ($scope.isOriginOfBookingEnabled) {
               fetchOriginOfBookings();
            }
            fetchCommissionDetails();

            // CICO-36412
            if (!!$scope.rateData.based_on.id) {
                fetchBasedOnRateDetails();
            }
        };

        var fetchCommissionDetails = function() {
            var fetchCommissionDetailsSuccess = function(data) {
                if (_.isEmpty($scope.rateData.commission_details)) {
                    $scope.rateData.commission_details = data.commission_details;
                }
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesSrv.fetchCommissionDetails, {}, fetchCommissionDetailsSuccess);
        };

        $scope.rateInitialData = rateInitialData;

        var setRateAdditionalDetails = function() {
            // add ons
            $scope.allAddOns = rateInitialData.addons;
            angular.forEach($scope.allAddOns, function(addOns) {
                addOns.isSelected = false;
                addOns.is_inclusive_in_rate = "false";
            });
            $scope.rateData.addOns = rateInitialData.addons;
            angular.forEach($scope.rateData.addOns, function(addOn) {
                addOn.shouldShow = true;
                
                if (_.indexOf(addOn.excluded_rate_ids, parseInt($stateParams.rateId)) !== -1) {
                    addOn.shouldShow = false;
                }
               
            });

            // restriction type
            $scope.restrictionDetails = rateInitialData.restrictionDetails;
            angular.forEach($scope.restrictionDetails, function(restrictionType) {
                if (restrictionType.value === 'CANCEL_PENALTIES') {
                    $scope.cancelPenaltiesActivated = (restrictionType.activated) ? true : false;
                }
                if (restrictionType.value === 'DEPOSIT_REQUESTED') {
                    $scope.depositRequiredActivated = (restrictionType.activated) ? true : false;
                }
            });

            // selected restrictions
            angular.forEach(rateInitialData.selectedRestrictions, function(selectedRestriction) {
                if (selectedRestriction.activated) {
                    if (selectedRestriction.value === 'MAX_ADV_BOOKING') {
                        $scope.maxAdvancedBookingActivated = true;
                    }
                    if (selectedRestriction.value === 'MAX_STAY_LENGTH') {
                        $scope.maxStayLengthActivated = true;
                    }
                    if (selectedRestriction.value === 'MIN_ADV_BOOKING') {
                        $scope.minAdvancedBookingActivated = true;
                    }
                    if (selectedRestriction.value === 'MIN_STAY_LENGTH') {
                        $scope.minStayLengthActivated = true;
                    }
                }
            });
        };

        /*
         * toogle different rate view
         */
        var listener = $scope.$on("changeMenu", function(e, value, initialLoad) {
            
            if ( initialLoad ) {
                setRateAdditionalDetails();
                $scope.manipulateData(rateDetails);
                return;
            }
            $scope.changeMenu(value);
            if ( value === 'Details' ) {
                initialAPIcalls();
                $scope.$broadcast('INIT_RATE_DETAILS');
            }
            else if ( value === 'Room types') {
                $scope.$broadcast('INIT_ROOM_TYPES');
            }
            else if ( value === 'Promotions') {
                $scope.$broadcast('INIT_PROMOTIONS');
            }
        });

        /*
        * Function to change the menu on the rate setup screen
        */
        $scope.changeMenu = function(value) {
            // keep track of previous menu for switching - on Cancel button click
            $scope.prevMenu = $scope.rateMenu;
            if (!isNaN(parseInt(value))) {
                value = "dateRange." + value;
            }
            $scope.rateMenu = value;
        };

        $scope.$on("errorReceived", function(e, value) {
            $scope.errorMessage = value;
            angular.element(document.querySelector('#wrapper')).scrollTop(0);
        });

        /**
         * Function ivoked from child classes when the rate details are changed.
         */
        $scope.$on("rateChangedFromDetails", function(e) {
            $scope.$broadcast('ratesChanged');
            fetchBasedOnRateDetails();
        });

        /**
         * Fetch the based on rate retails, if the rate has chosen a based on rate.
         */
        var fetchBasedOnRateDetails = function() {
            if ($scope.rateData.based_on.id === undefined || $scope.rateData.based_on.id === '') {
                return false;
            }
            var fetchBasedonSuccess = function(data) {
                // set basedon data
                $scope.basedonRateData = data;
                $scope.basedonRateData.room_type_ids = [];
                angular.forEach(data.room_types, function(room_type) {
                    $scope.basedonRateData.room_type_ids.push(room_type.id);
                });
                $scope.basedonRateData.rate_type = (data.rate_type !== null) ? data.rate_type.id : '';
                $scope.basedonRateData.based_on = (data.based_on !== null) ? data.based_on.id : '';
                // Broadcast an event to child classed to notify that the based on rates are changed.
                $scope.$broadcast('basedonRatesChanged');
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesSrv.fetchDetails, {
                rateId: $scope.rateData.based_on.id
            }, fetchBasedonSuccess);
        };
        var manipulateAdditionalDetails = function(data) {
            // hourly rate?
            $scope.rateData.is_hourly_rate = data.is_hourly_rate;
            $scope.rateData.is_public_rate = data.is_public_rate;
            $scope.rateData.is_day_use = data.is_day_use;

            // rules and restrictions
            $scope.rateData.min_advanced_booking = data.min_advanced_booking;
            $scope.rateData.max_advanced_booking = data.max_advanced_booking;
            $scope.rateData.min_stay = data.min_stay;
            $scope.rateData.max_stay = data.max_stay;
            $scope.rateData.use_rate_levels = (data.use_rate_levels) ? true : false;
            $scope.rateData.deposit_policy_id = data.deposit_policy_id;
            $scope.rateData.cancellation_policy_id = data.cancellation_policy_id;

            // Additional details
            $scope.rateData.is_suppress_rate_on = (data.is_suppress_rate_on) ? true : false;
            $scope.rateData.is_discount_allowed_on = (data.is_discount_allowed_on) ? true : false;
            $scope.rateData.is_member_rate = (data.is_member) ? true : false;
            // CICO-18614
            $scope.rateData.is_pms_only = !!data.is_pms_only;
            $scope.rateData.is_channel_only = !!data.is_channel_only;

            $scope.rateData.source_id = data.source_id;
            $scope.rateData.market_segment_id = data.market_segment_id;
            $scope.rateData.end_date = data.end_date;
            if ($scope.rateData.end_date) {
                $scope.rateData.end_date_for_display = ($scope.rateData.end_date.length > 0) ? $filter('date')(new Date($scope.rateData.end_date), $rootScope.dateFormat) : "";
            } else {
                $scope.rateData.end_date_for_display = "";
            }
            $scope.rateData.commission_details = data.commission_details;
            $scope.rateData.tasks = data.tasks;
            $scope.rateData.booking_origin_id = data.booking_origin_id;

            // addons -mark as activated for selected addons
            if ($scope.rateData.addOns.length > 0) {
                var tempData = $scope.rateData.addOns;

                $scope.rateData.addOns = [];
                angular.forEach($scope.allAddOns, function(addOns) {
                    angular.forEach(tempData, function(addOnsSelected) {
                        if (addOns.id === addOnsSelected.id) {
                            addOns.isSelected = true;
                            addOns.is_inclusive_in_rate = addOnsSelected.is_inclusive_in_rate ? 'true' : 'false';
                            if ($scope.rateData.addOns.indexOf(addOns) === -1) {
                                $scope.rateData.addOns.push(addOns);
                            }
                        }

                    });
                });
            }
            // addons mark as deactivated for selected addons
            angular.forEach($scope.allAddOns, function(addOns) {

                if ($scope.rateData.addOns.indexOf(addOns) === -1) {
                    addOns.isSelected = false;
                    addOns.is_inclusive_in_rate = 'false';
                    $scope.rateData.addOns.push(addOns);
                }

            });
        };

        $scope.showPromotionSection = function() {
            return !$scope.rateData.is_hourly_rate;
        };

        $scope.isPromoRate = function() {
            return parseInt(_.findWhere($scope.rateInitialData.rate_types, {
                name: "Specials & Promotions"
            }).id) === parseInt($scope.rateData.rate_type.id);
        };

        $scope.manipulateData = function(data) {
            if (data.id) {
                $scope.rateData.id = data.id;
            }
            if (!$scope.is_edit) {
                $scope.is_edit = true;
            }

            $scope.rateData.name = data.name;
            $scope.rateData.code = data.code;
            $scope.rateData.description = data.description;
            $scope.rateData.promotion_code = data.promotion_code;
            $scope.rateData.room_types = data.room_types;
            $scope.rateData.room_type_ids = [];
            angular.forEach(data.room_types, function(room_type) {
                $scope.rateData.room_type_ids.push(room_type.id);
            });
            $scope.rateData.date_ranges = data.date_ranges;
            $scope.rateData.rate_type.id = (data.rate_type !== null) ? data.rate_type.id : '';
            $scope.rateData.rate_type.name = (data.rate_type !== null) ? data.rate_type.name : '';
            $scope.rateData.addOns = JSON.parse(JSON.stringify(data.addons));
            $scope.rateData.charge_code_id = data.charge_code_id;
            $scope.rateData.currency_code_id = data.currency_code_id;
            $scope.rateData.fixed_it_id = data.fixed_it_id;
            $scope.rateData.tax_inclusive_or_exclusive = data.tax_inclusive_or_exclusive;
            $scope.rateData.is_global_contract = data.is_global_contract;
            $scope.rateData.round_type_id = data.round_type_id;
            $scope.rateData.min_threshold_percent = data.min_threshold_percent;
            $scope.rateData.rate_name_trl = data.rate_name_trl;
            $scope.rateData.rate_desc_trl = data.rate_desc_trl;
            
            manipulateAdditionalDetails(data);

            if (data.based_on) {
                $scope.rateData.based_on.id = data.based_on.id;
                $scope.rateData.based_on.type = data.based_on.type;
                $scope.rateData.based_on.value_abs = Math.abs(data.based_on.value);
                $scope.rateData.based_on.value_sign = data.based_on.value > 0 ? "+" : "-";
                $scope.rateData.based_on.is_copied = data.based_on.is_copied;
            } else {
                $scope.rateData.based_on = {
                    "id": "",
                    "type": "",
                    "value_abs": "",
                    "value_sign": ""
                };
            }

        };

        // Fetch details success callback for rate edit

        var setRateDetails = function(data) {
            var initialLoad = true;

            $scope.hotel_business_date = data.business_date;
            // set rate data for edit
            $scope.rateData.classification = data.rate_type.classification;
            $scope.rateData.id = $stateParams.rateId;
            // navigate to step where user last left unsaved
            if ($scope.rateData.date_ranges.length > 0) {
                activeDateRange = getActiveDateRange();
                $scope.$emit("changeMenu", activeDateRange, initialLoad );
            } else if ($scope.rateData.room_type_ids.length > 0) {
                $scope.$emit("changeMenu", 'Room types', initialLoad );
            } else {
                $scope.$emit("changeMenu", 'Details', initialLoad );
            }
            $scope.$emit('hideLoader');
            $scope.$broadcast('ratesChanged');
        };


        var getActiveDateRange = function(dateRange) {
            var beginDate = '';
            var endDate = '';
            var hotelBusinessDate = null;

            if ($scope.is_edit) {
                hotelBusinessDate = new Date($scope.hotel_business_date).getTime();
            } else {
                hotelBusinessDate = new Date($scope.businessDate).getTime();
            }
            var keepGoing = true;
            var activeDateRange = $scope.rateData.date_ranges[$scope.rateData.date_ranges.length - 1].id;

            angular.forEach($scope.rateData.date_ranges, function(dateRange, index) {
                if (keepGoing) {
                    beginDate = new Date(dateRange.begin_date).getTime();
                    endDate = new Date(dateRange.end_date).getTime();
                    if (beginDate <= hotelBusinessDate && hotelBusinessDate <= endDate) {
                        activeDateRange = "dateRange." + dateRange.id;
                        keepGoing = false;
                    }
                }
            });
            return activeDateRange;
        };


        $scope.$on('deletedAllDateRangeSets', function(e, dateRangeId) {
            angular.forEach($scope.rateData.date_ranges, function(dateRange, index) {
                if (dateRange.id === dateRangeId) {
                    $scope.rateData.date_ranges.splice(index, 1);
                }
            });
        });

        $scope.addNewDateRange = function() {
            $scope.$emit("changeMenu", 'ADD_NEW_DATE_RANGE');
            // reset calendar
            $scope.$broadcast('resetCalendar');
        };

        $scope.backToRates = function(event) {
            event.preventDefault();
            if (Object.prototype.hasOwnProperty.call($scope, 'otherData') &&
                $scope.otherData.setChanged) {
                $scope.$broadcast('backToRatesClicked', event);
            } else {
                $state.go('admin.rates');
            }
        };


        $scope.shouldShowAddNewDateRange = function() {
            if ($scope.rateMenu === 'ADD_NEW_DATE_RANGE') {
                return false;
            }
            if ($scope.rateData.based_on.is_copied && $scope.rateData.room_type_ids && $scope.rateData.room_type_ids.length > 0) {
                return true;
            }
            if ($scope.rateData.based_on.id > 1 && $scope.rateData.rate_type.name !== 'Specials & Promotions') {
                return false;
            }
            if (!$scope.rateData.id || $scope.rateData.room_type_ids.length === 0) {
                return false;
            }
            return true;
        };

        // on click Cancel button redirect to previous active msetRateDetailsenu
        $scope.cancelMenu = function() {
            $scope.$emit("changeMenu", $scope.prevMenu);
        };

        /*
        * Listener to activate the set tab while selecting the copy from option
        */
        $scope.$on("activateSetTab", function(e, value) {
            if ($scope.rateData.date_ranges.length > 0) {
                var dateRange = getActiveDateRange();

                $scope.changeMenu(dateRange);
            }
        });


        $scope.onLanguageChange = function() {
            if ($scope.rateData.id) {
                var options = {
                    params: {
                        rateId: $scope.rateData.id,
                        locale: $scope.rateData.selectedLanguage.code
                    },
                    successCallBack: $scope.manipulateData
                };

                $scope.callAPI(ADRatesSrv.fetchDetails, options);
            } else {
                return;
            }
        };
        /*
        * Fetches the list of origin of bookings available, sets only the active ones
        */
        var fetchOriginOfBookings = function() {
            var onOriginOfBookingFetchSuccess = function(data) {
                $scope.originOfBookings = _.filter(data.booking_origins, function(origin) {
                    return origin.is_active;
                });
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADOriginsSrv.fetch, {}, onOriginOfBookingFetchSuccess);
        };

        /*
         * init call
         */
        $scope.init();
        $scope.$on('$destroy', listener );
    }
]);
