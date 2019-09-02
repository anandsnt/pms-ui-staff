angular.module('reportsModule').factory('RVCustomExportsUtilFac', [
    '$rootScope',
    'RVCustomExportFilterParamsConst',
    'RVreportsSubSrv',
    function (
        $rootScope,
        customExportFilterParamsConst,
        reportSubSrv ) {

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

        var populateBookingOrigins = (selectedFilter) => {
            reportSubSrv.fetchBookingOrigins().then(function (data) {
                selectedFilter.secondLevelData = angular.copy(data);
                selectedFilter.options = {
                    selectAll: false,
                    hasSearch: false,
                    key: 'name'
                };
                selectedFilter.isMultiSelect = true;
            });
        };

        var populateOptions = (selectedFieldName, selectedFilter) => {
            switch(selectedFieldName) {
                case customExportFilterParamsConst['BOOKING_ORIGIN_CODE']:
                     populateBookingOrigins(selectedFilter);
                     break;

            }

        };

        var factory = {
            processFilters: processFilters,
            populateOptions: populateOptions 
        };

        return factory;

}]);