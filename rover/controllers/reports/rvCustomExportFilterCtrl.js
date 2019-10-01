angular.module('sntRover').controller('RVCustomExportFilterCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    '$rootScope',
    'RVreportsSrv',
    'RVCustomExportsUtilFac',
    'sntActivity',
    function($scope, 
        RVCustomExportSrv,
        $timeout,
        $rootScope,
        reportsSrv,
        RVCustomExportsUtilFac,
        sntActivity ) {

        BaseCtrl.call(this, $scope);

        const filterTypes = {
            OPTIONS: 'OPTION',
            DURATION: 'DURATION',
            RANGE: 'RANGE'
        };

        const CUSTOM_EXPORT_FILTERS_SCROLLER = 'custom-export-filters-scroller';
        const RANGE_FILTER_OPERATORS = 3;

        // Set the scroller
        $scope.setScroller(CUSTOM_EXPORT_FILTERS_SCROLLER, {
            tap: true,
            preventDefault: false
        });

        // Refreshes the scroller
        $scope.refreshFilterScroller = () => {
            $timeout(function () {
                $scope.refreshScroller(CUSTOM_EXPORT_FILTERS_SCROLLER);
            }, 500);
        };

        var createDurationEntry = ( filterType, selectedFirstLevel, selectedSecondLevel ) => {
                var fieldsCopy = angular.copy($scope.selectedEntityDetails.processedFilters[filterType]),
                    filterFields = removeAlreadyExistsDurationFieldNames(fieldsCopy),
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
                var fieldsCopy = angular.copy($scope.selectedEntityDetails.processedFilters[filterType]),
                    filterFields = removeAlreadyExistsRangeFieldNames(fieldsCopy),
                    filterConfig = {
                        firstLevelData: filterFields,
                        secondLevelData: RVCustomExportsUtilFac.getRangeOperators(),
                        selectedFirstLevel: selectedFirstLevel || '',
                        selectedSecondLevel: selectedSecondLevel || '',
                        isRange: true,
                        rangeValue: rangeValue || ''
                    };

                return filterConfig;
            },
            createOptionEntry = ( filterType, selectedFirstLevel, selectedSecondLevel) => {
                var fieldsCopy = angular.copy($scope.selectedEntityDetails.processedFilters[filterType]),
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
                var selectedOptionsFilter = _.filter($scope.filterData.appliedFilters, { isOption: true }),
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
            },
            removeAlreadyExistsDurationFieldNames = ( fields ) => {
                var availableDurationFieldNames = [];

                _.each (fields, function (each) {                    
                    var selectedDurationFieldName = _.find($scope.filterData.appliedFilters, {
                        selectedFirstLevel: each.value
                    });

                    if (!selectedDurationFieldName) {
                        availableDurationFieldNames.push(each);
                    }

                });

                return availableDurationFieldNames;
            };

        // Creates new filter entry object
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

        // Handler for primary filter change
        $scope.changePrimaryFilter = () => {
            $scope.filterData.appliedFilters.push(createNewFilterEntry($scope.filterData.primaryFilter));
            $scope.filterData.primaryFilter = '';
            $scope.refreshFilterScroller();
        };

        // Remove a particular filter
        $scope.removeFilter = (filterPos) => {
            $scope.filterData.appliedFilters.splice(filterPos, 1);
        };

        // Handler for first level field change
        $scope.onFirstLevelFieldChange = (selectedFieldName, filterPos, selectedSecondLevel, rangeValue) => {
            var selectedFilter = $scope.filterData.appliedFilters[filterPos];

            if (selectedFilter.isOption) {
                sntActivity.start('LOAD_FILTERS');
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
                RVCustomExportsUtilFac.populateOptions(selectedFieldName, selectedFilter, selectedSecondLevel).then(function (filter) {
                    selectedFilter = filter;
                    sntActivity.stop('LOAD_FILTERS');
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
                RVCustomExportsUtilFac.populateRangeOperators(selectedFieldName, selectedFilter, $scope.filterData.appliedFilters, selectedSecondLevel, rangeValue);
            }

        };

        // Remove all the selected filters
        $scope.removeAllFilters = () => {
            $scope.filterData.appliedFilters = [];
            $scope.refreshFilterScroller();
        };

        // Process the filters which are already added and populate the dropdowns
        var processFilterSelections  = () => {
            var filterValues = $scope.selectedEntityDetails.filter_values,
                filterFields = $scope.selectedEntityDetails.filters,
                filterType,
                filter;
            
            RVCustomExportSrv.processFilterSelections(filterValues).then(function() {
                _.each(filterValues, function (value, key) {
                    key = key.toUpperCase();
                    filterType = (_.find(filterFields, { value: key })).filter_type;
                    if (filterType === filterTypes.DURATION) {
                        filter = createDurationEntry(filterType, key, value);
                        $scope.filterData.appliedFilters.push(filter);
                    } else if (filterType === filterTypes.RANGE) {
                        _.each (value, function ( each ) {
                            filter = createRangeEntry(filterType, key, each.operator, each.value);
                            $scope.filterData.appliedFilters.push(filter);
                            $scope.onFirstLevelFieldChange(key, ($scope.filterData.appliedFilters.length - 1), each.operator, each.value);
                        });
                        
                    } else if (filterType === filterTypes.OPTIONS) {
                        filter = createOptionEntry(filterType, key);
                        $scope.filterData.appliedFilters.push(filter);
                        $scope.onFirstLevelFieldChange(key, ($scope.filterData.appliedFilters.length - 1), value);
                    }

                });
            });
        };

        // Listener for the update filter selections during edit
        $scope.addListener('UPDATE_FILTER_SELECTIONS', () => {
            processFilterSelections();
        });


    }
]);