angular.module('reportsModule').factory('RVCustomExportsUtilFac', [
    '$rootScope',
    'RVCustomExportFilterParamsConst',
    'RVreportsSubSrv',
    '$q',
    function (
        $rootScope,
        customExportFilterParamsConst,
        reportSubSrv,
        $q ) {

        var dualStateOptions = [
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
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
                        key: 'name'
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
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateReservationStatus = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchReservationStatus().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'status',
                        defaultValue: 'Select Status'
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
                        key: 'name'
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
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateRoomTypes = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchRoomTypeList().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateDualStates = ( selectedFilter, selectedValues, deferred ) => {
                selectedFilter.secondLevelData = angular.copy(dualStateOptions);
                selectedFilter.hasDualState = true;
                selectedFilter.selectedSecondLevel = selectedValues || '';
                deferred.resolve(selectedFilter);
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
                    populateRoomTypes(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ACTIVE']:
                case customExportFilterParamsConst['DAYUSE INDICATOR']:
                    populateDualStates(selectedFilter, selectedValues, deferred);
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