angular.module('reportsModule').factory('RVCustomExportsUtilFac', [
    '$rootScope',
    'RVCustomExportFilterParamsConst',
    'RVreportsSubSrv',
    '$q',
    'RVCustomExportSrv',
    function (
        $rootScope,
        customExportFilterParamsConst,
        reportSubSrv,
        $q,
        rvCustomExportSrv ) {

        var boolStateOptions = [
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ];

        var dayNightUseIndicator = [
            {
                label: 'D',
                value: 'D'
            },
            {
                label: 'N',
                value: 'N'
            } 
        ];


        const rangeOperators = [
            { label: 'Greater than', value: 'greater_than'},
            { label: 'Equal to', value: 'equal_to'},
            { label: 'Less than', value: 'less_than'}
        ];

        var processFilters = (filters) => {
             var filterOptions = {};

            _.each(filters, (filter) => {
                if (!filterOptions[filter.filter_type]) {
                    filterOptions[filter.filter_type] = [];
                } 

                filterOptions[filter.filter_type].push({
                    label: filter.description,
                    value: filter.value
                }); 
            
            });

            return filterOptions;
        };

        var markAsSelected = (list, selectedValues, key) => {
            key = key || 'value';
            if (!selectedValues || selectedValues.length === 0 ) {
                return list;
            }
            _.each (list, function ( each ) {
                if (selectedValues.indexOf(each[key]) !== -1) {
                    each.selected = true;
                }
            });

            return list;
        }

        var populateBookingOrigins = (selectedFilter, selectedValues, deferred) => {
                reportSubSrv.fetchBookingOrigins().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        selectAll: false,
                        hasSearch: false,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;

                    deferred.resolve(selectedFilter);
                });
            },
            populateMarkets = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchMarkets().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        selectAll: false,
                        hasSearch: false,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateReservationStatus = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchReservationStatus().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'status',
                        defaultValue: 'Select Status',
                        value_key: 'id'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateSource = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchSources().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateSegments = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchSegments().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateRoomTypes = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchRoomTypeList().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'code');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'code'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateDualStates = (stateOptions, selectedFilter, selectedValues, deferred ) => {
                selectedFilter.secondLevelData = angular.copy(stateOptions);
                selectedFilter.hasDualState = true;
                selectedFilter.selectedSecondLevel = selectedValues || '';
                deferred.resolve(selectedFilter);
            },
            populateRoomNos = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getRoomNos().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'id'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateRateList = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getRateList().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'id'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateCICOAgents = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getCICOAgents().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: true,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'full_name',
                        value_key: 'id',
                        altKey: 'email'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateCICOApplications = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getCICOApplications().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'id',
                        altKey: 'description'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateCountryOrNationality = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getCountries().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: true,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'id'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateLanguage = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getGuestLanguages().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'id');
                    selectedFilter.options = {
                        hasSearch: true,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'id'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populatePaymentMethods = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getPaymentMethods().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'description');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'description',
                        value_key: 'description'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateMemberships = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getMemberShips().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'value');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'desc',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateMembershipLevels = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getMemberShips().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'value');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            };


        var populateOptions = (selectedFieldName, selectedFilter, selectedValues) => {
            var deferred = $q.defer();

            switch (selectedFieldName) {
                case customExportFilterParamsConst['BOOKING_ORIGIN_CODE']:
                    populateBookingOrigins(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['MARKET_CODE']:
                    populateMarkets(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['RESERVATION_STATUS']:
                    populateReservationStatus(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['SOURCE_CODE']:
                    populateSource(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['SEGMENT_CODE']:
                    populateSegments(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ROOM_TYPE']:
                case customExportFilterParamsConst['ARRIVAL_ROOM_TYPE']:
                case customExportFilterParamsConst['DEPARTURE_ROOM_TYPE']:
                    populateRoomTypes(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ACTIVE']:
                case customExportFilterParamsConst['VIP']:
                    populateDualStates(boolStateOptions, selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ROOM_NO']:
                    populateRoomNos(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ARRIVAL_RATE_CODE']:
                    populateRateList(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['CI_AGENT']:
                case customExportFilterParamsConst['CO_AGENT']:
                    populateCICOAgents(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['CI_APPLICATION']:
                case customExportFilterParamsConst['CO_APPLICATION']:
                    populateCICOApplications(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['COUNTRY']:
                case customExportFilterParamsConst['NATIONALITY']:
                    populateCountryOrNationality(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['LANGUAGE']:
                    populateLanguage(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['PRIMARY_PAYMENT_METHOD']:
                    populatePaymentMethods(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['MEMBERSHIP']:
                    populateMemberships(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['MEMBERSHIP_LEVEL']:
                    populateMembershipLevels(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['DAYUSE INDICATOR']:
                case customExportFilterParamsConst['STAY_TYPE']:
                    populateDualStates(dayNightUseIndicator, selectedFilter, selectedValues, deferred);
                    break;
                default:

            }

            return deferred.promise;

        };

        var populateRangeOperators = (selectedFieldName, selectedFilter, appliedFilters, selectedSecondLevel, rangeValue) => {
            var appliedRangeOperators = _.filter(appliedFilters, function ( each ) {
                    return each.selectedFirstLevel === selectedFieldName;
                }),
                appliedRangeOperatorNames = _.pluck(appliedRangeOperators, 'selectedSecondLevel');

            var availableOperators = _.filter(getRangeOperators(), function (each) {
                return appliedRangeOperatorNames.indexOf(each.value) === -1;
            });
            
            selectedFilter.secondLevelData = availableOperators;
            selectedFilter.selectedSecondLevel = selectedSecondLevel;
            selectedFilter.rangeValue = rangeValue;

        };

        var getRangeOperators = () => {
            return rangeOperators;
        };


        var factory = {
            processFilters: processFilters,
            populateOptions: populateOptions,
            getRangeOperators: getRangeOperators,
            populateRangeOperators: populateRangeOperators
        };

        return factory;

}]);