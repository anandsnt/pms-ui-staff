angular.module('sntRover').controller('RVCustomExportFilterCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    '$rootScope',
    'RVreportsSrv',
    'RVCustomExportsUtilFac',
    'RVreportsSubSrv',
    'RVCustomExportFilterParamsConst',
    function($scope, 
        RVCustomExportSrv,
        $timeout,
        $rootScope,
        reportsSrv,
        RVCustomExportsUtilFac,
        reportSubSrv,
        customExportFilterParamsConst) {

        BaseCtrl.call(this, $scope);

        const filterTypes = {
            'OPTIONS' : 'option',
            'DURATION': 'duration',
            'RANGE': 'range'
        };

        const CUSTOM_EXPORT_FILTERS_SCROLLER = 'custom-export-filters-scroller';

        const rangeOperators = [
            { label: 'Greater than', value: 'greater_than'},
            { label: 'Equal to', value: 'equal_to'},
            { label: 'Less than', value: 'less_than'}
        ];

        $scope.setScroller(CUSTOM_EXPORT_FILTERS_SCROLLER, {
            tap: true,
            preventDefault: false
        });

        $scope.refreshFilterScroller = () => {
            $timeout(function () {
                $scope.refreshScroller(CUSTOM_EXPORT_FILTERS_SCROLLER);
            }, 500);
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
            },
            createRangeEntry = ( filterType, selectedFirstLevel, selectedSecondLevel, rangeValue ) => {
                var filterFields = $scope.selectedEntityDetails.filters[filterType],
                    filterConfig = {
                        firstLevelData: filterFields,
                        secondLevelData: rangeOperators,
                        selectedFirstLevel: selectedFirstLevel || '',
                        selectedSecondLevel: selectedSecondLevel || '',
                        isRange: true,
                        rangeValue: rangeValue || ''
                    };

                return filterConfig;
            },
            createOptionEntry = ( filterType, selectedFirstLevel, selectedSecondLevel) => {
                var filterFields = $scope.selectedEntityDetails.filters[filterType],
                    filterConfig = {
                        firstLevelData: filterFields,
                        secondLevelData: [],
                        selectedFirstLevel: selectedFirstLevel || '',
                        selectedSecondLevel: selectedSecondLevel || '',
                        options: [],
                        isOption: true                       
                    };

                return filterConfig;
            };


        var createNewFilterEntry = ( filterType ) => {
            var filter;

            if (filterTypes.DURATION === filterType) {
                filter = createDurationEntry(filterType);
            } else if (filterTypes.RANGE === filterType) {
                filter = createRangeEntry(filterType);
            } else if (filterTypes.OPTIONS === filterType) {
                filter = createOptionEntry(filterType);
            }

            return filter;
        };

        $scope.changePrimaryFilter = () => {
            $scope.filterData.appliedFilters.push(createNewFilterEntry($scope.filterData.primaryFilter));
            $scope.filterData.primaryFilter = '';
            $scope.refreshFilterScroller();
        };

        $scope.removeFilter = (filterPos) => {
            $scope.filterData.appliedFilters.splice(filterPos, 1);
        };

        $scope.onOptionFieldChange = (selectedFieldName, filterPos) => {
            var selectedFilter = $scope.filterData.appliedFilters[filterPos];

            if (selectedFilter.isOption) {
                RVCustomExportsUtilFac.populateOptions(selectedFieldName, selectedFilter);
            }

        };


    }
]);