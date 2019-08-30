angular.module('sntRover').controller('RVCustomExportFilterCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    '$rootScope',
    'RVreportsSrv',
    'RVCustomExportsUtilFac',
    function($scope, 
        RVCustomExportSrv,
        $timeout,
        $rootScope,
        reportsSrv,
        RVCustomExportsUtilFac) {

        BaseCtrl.call(this, $scope);

        const filterTypes = {
            'OPTIONS' : 'options',
            'DURATION': 'duration',
            'RANGE': 'range'
        };

        var createDurationEntry = ( filterType, selectedFirstLevel, selectedSecondLevel ) => {
            var filterFields = $scope.selectedEntityDetails.filters[filterType],
                filterConfig = {
                    firstLevelData: filterFields,
                    secondLevelData: $scope.customExportsData.durations,
                    selectedFirstLevel: selectedFirstLevel || '',
                    selectedSecondLevel: selectedSecondLevel || '',
                    isDuration: true
                };

            return filterConfig;
        };

        var createNewFilterEntry = ( filterType ) => {
            var filter;

            if (filterTypes.DURATION === filterType) {
                filter = createDurationEntry(filterType);
            }

            return filter;
        };

        $scope.changePrimaryFilter = () => {
            $scope.filterData.appliedFilters.push(createNewFilterEntry($scope.filterData.primaryFilter));
            $scope.filterData.primaryFilter = '';
        };

        $scope.removeFilter = (filterPos) => {
            $scope.filterData.appliedFilters.splice(filterPos, 1);
        };


    }
]);