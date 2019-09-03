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
        const RANGE_FILTER_OPERATORS = 3;

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
                var fieldsCopy = angular.copy($scope.selectedEntityDetails.filters[filterType]),
                    filterFields = removeAlreadyExistsRangeFieldNames(fieldsCopy),
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
                var fieldsCopy = angular.copy($scope.selectedEntityDetails.filters[filterType]),
                    filterFields = removeAlreadyExistsOptionFieldNames(fieldsCopy),
                    filterConfig = {
                        firstLevelData: filterFields,
                        secondLevelData: [],
                        selectedFirstLevel: selectedFirstLevel || '',
                        selectedSecondLevel: selectedSecondLevel || '',
                        options: [],
                        isOption: true                       
                    };

                return filterConfig;
            },
            removeAlreadyExistsOptionFieldNames = ( fields ) => {
                var selectedOptionsFilter = _.filter($scope.filterData.appliedFilters, { isOption : true }),
                    selectedOptionsName = _.pluck(selectedOptionsFilter, 'selectedFirstLevel'),
                    availableFields = [];

                availableFields = _.filter(fields, function (each) {
                    return selectedOptionsName.indexOf(each.value) === -1;
                });

                return availableFields;
            },
            removeAlreadyExistsRangeFieldNames = ( fields ) => {
                var availableRangeFieldNames = [];

                _.each (fields, function (each) {
                    var selectedRangeFieldNames = _.filter($scope.filterData.appliedFilters, { 
                                                    isRange: true, 
                                                    selectedFirstLevel: each.value 
                                                });

                    if (selectedRangeFieldNames.length !== RANGE_FILTER_OPERATORS) {
                        availableRangeFieldNames.push(each);
                    }

                });

                return availableRangeFieldNames;
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
                removeKeysFromObj(selectedFilter, [
                    'isRange',
                    'isDuration',
                    'secondLevelData',
                    'selectedSecondLevel',
                    'options',
                    'rangeValue',
                    'isMultiSelect',
                    'hasDualState'
                ]);
                RVCustomExportsUtilFac.populateOptions(selectedFieldName, selectedFilter).then(function (filter) {
                    selectedFilter = filter;
                });
            } else if (selectedFilter.isRange) {
                removeKeysFromObj(selectedFilter, [
                    'isOption',
                    'isDuration',
                    'secondLevelData',
                    'selectedSecondLevel',
                    'options',
                    'rangeValue',
                    'isMultiSelect',
                    'hasDualState'
                ]);
            }

        };


    }
]);