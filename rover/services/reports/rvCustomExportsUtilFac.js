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

        var populateBookingOrigins = (selectedFilter, deferred) => {
                reportSubSrv.fetchBookingOrigins().then(function (data) {
                    selectedFilter.secondLevelData = angular.copy(data);
                    selectedFilter.options = {
                        selectAll: false,
                        hasSearch: false,
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;

                    deferred.resolve(selectedFilter);
                });
            },
            populateMarkets = ( selectedFilter, deferred ) => {
                reportSubSrv.fetchMarkets().then(function (data) {
                    selectedFilter.secondLevelData = angular.copy(data);
                    selectedFilter.options = {
                        selectAll: false,
                        hasSearch: false,
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateReservationStatus = ( selectedFilter, deferred ) => {
                reportSubSrv.fetchReservationStatus().then(function (data) {
                    selectedFilter.secondLevelData = angular.copy(data);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: true,
                        key: 'status',
                        defaultValue: 'Select Status'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateSource = ( selectedFilter, deferred ) => {
                reportSubSrv.fetchSources().then(function (data) {
                    selectedFilter.secondLevelData = angular.copy(data);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: true,
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateSegments = ( selectedFilter, deferred ) => {
                reportSubSrv.fetchSegments().then(function (data) {
                    selectedFilter.secondLevelData = angular.copy(data);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: true,
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateRoomTypes = ( selectedFilter, deferred ) => {
                reportSubSrv.fetchRoomTypeList().then(function (data) {
                    selectedFilter.secondLevelData = angular.copy(data);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: true,
                        key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },
            populateDualStates = ( selectedFilter, deferred ) => {
                selectedFilter.secondLevelData = angular.copy(dualStateOptions);
                selectedFilter.hasDualState = true;
                deferred.resolve(selectedFilter);
            };


        var populateOptions = (selectedFieldName, selectedFilter) => {
            var deferred = $q.defer();

            switch (selectedFieldName) {
                case customExportFilterParamsConst['BOOKING_ORIGIN_CODE']:
                    populateBookingOrigins(selectedFilter, deferred);
                    break;
                case customExportFilterParamsConst['MARKET_CODE']:
                    populateMarkets(selectedFilter, deferred);
                    break;
                case customExportFilterParamsConst['RESERVATION_STATUS']:
                    populateReservationStatus(selectedFilter, deferred);
                    break;
                case customExportFilterParamsConst['SOURCE_CODE']:
                    populateSource(selectedFilter, deferred);
                    break;
                case customExportFilterParamsConst['SEGMENT_CODE']:
                    populateSegments(selectedFilter, deferred);
                    break;
                case customExportFilterParamsConst['ROOM_TYPE']:
                    populateRoomTypes(selectedFilter, deferred);
                    break;
                case customExportFilterParamsConst['ACTIVE']:
                case customExportFilterParamsConst['DAYUSE INDICATOR']:
                    populateDualStates(selectedFilter, deferred);
                    break;
                default:

            }

            return deferred.promise;

        };

        var populateRangeOperators = (selectedFieldName, selectedFilter) => {

        };

        var factory = {
            processFilters: processFilters,
            populateOptions: populateOptions,
            populateRangeOperators: populateRangeOperators 
        };

        return factory;

}]);