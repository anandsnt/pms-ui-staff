angular.module('reportsModule').factory('RVCustomExportsUtilFac', [
    '$rootScope',
    function ($rootScope) {

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

        var factory = {
            processFilters: processFilters 
        };

        return factory;

}]);