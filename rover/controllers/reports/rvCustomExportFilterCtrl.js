angular.module('sntRover').controller('RVCustomExportFilterCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    'RVCustomExportsUtilFac',
    'sntActivity',
    function($scope, 
        RVCustomExportSrv,
        $timeout,
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
        const SCROLL_REFRESH_DELAY = 100;
        const RANGE_SUB_FILTERS_COUNT = 3;

        // Set the scroller
        $scope.setScroller(CUSTOM_EXPORT_FILTERS_SCROLLER, {
            tap: true,
            preventDefault: false
        });

        // Refreshes the scroller
        $scope.refreshFilterScroller = (reset) => {
            $timeout(function () {
                $scope.refreshScroller(CUSTOM_EXPORT_FILTERS_SCROLLER);
            }, 100);

            if ( !! reset && $scope.myScroll.hasOwnProperty(CUSTOM_EXPORT_FILTERS_SCROLLER) ) {
                $scope.myScroll[CUSTOM_EXPORT_FILTERS_SCROLLER].scrollTo(0, 0, SCROLL_REFRESH_DELAY);
            }
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

            if (!selectedFieldName && selectedFilter) {
                selectedFilter.options = {};
                selectedFilter.secondLevelData = [];
                selectedFilter.selectedFirstLevel = selectedFieldName;
                selectedFilter.isMultiSelect = false;
                selectedFilter.hasDualState = false;
                return;
            }

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
                $timeout( function () {
                    $scope.refreshFilterScroller(true);
                }, 200);
                
            });
        };

        // Listener for the update filter selections during edit
        $scope.addListener('UPDATE_FILTER_SELECTIONS', () => {
            processFilterSelections();
        });

        // Hide condition for option filter
        $scope.shouldHideOptionFilter = () => {
            var appliedOptionFilters = _.filter($scope.filterData.appliedFilters, (filter) => {
                    return filter.isOption;
                }),
                availableOptionsFilters = $scope.selectedEntityDetails &&
                    $scope.selectedEntityDetails.processedFilters &&
                    $scope.selectedEntityDetails.processedFilters['OPTION'];

            return !availableOptionsFilters ||
                (availableOptionsFilters && (availableOptionsFilters.length === appliedOptionFilters.length));
        };

        // Hide condition for range filter
        $scope.shouldHideRangeFilter = () => {
            var appliedRangeFilters = _.filter($scope.filterData.appliedFilters, (filter) => {
                    return filter.isRange;
                }),
                availableRangeFilters = $scope.selectedEntityDetails &&
                    $scope.selectedEntityDetails.processedFilters &&
                    $scope.selectedEntityDetails.processedFilters['RANGE'];

            // We can choose 3 operators for each of the field, and hence the 3 in the condition below
            return !availableRangeFilters ||
                (availableRangeFilters && ( (availableRangeFilters.length * RANGE_SUB_FILTERS_COUNT) === appliedRangeFilters.length));
        };

        // Hide condition for duration filter
        $scope.shouldHideDurationFilter = () => {
            var appliedDurationFilters = _.filter($scope.filterData.appliedFilters, (filter) => {
                    return filter.isDuration;
                }),
                availableDurationFilters = $scope.selectedEntityDetails &&
                    $scope.selectedEntityDetails.processedFilters &&
                    $scope.selectedEntityDetails.processedFilters['DURATION'];

            return !availableDurationFilters ||
                (availableDurationFilters && (availableDurationFilters.length === appliedDurationFilters.length));
        };

        // Hide condition for add filter btn
        $scope.shouldHideAddFilter = () => {
            var optionFilterCount = ($scope.selectedEntityDetails &&
                $scope.selectedEntityDetails.processedFilters &&
                $scope.selectedEntityDetails.processedFilters['OPTION'] &&
                $scope.selectedEntityDetails.processedFilters['OPTION'].length) || 0,

                durationFilterCount = ($scope.selectedEntityDetails &&
                    $scope.selectedEntityDetails.processedFilters &&
                    $scope.selectedEntityDetails.processedFilters['DURATION'] && 
                    $scope.selectedEntityDetails.processedFilters['DURATION'].length ) || 0,

                rangeFiltersCount = ($scope.selectedEntityDetails &&
                    $scope.selectedEntityDetails.processedFilters &&
                    $scope.selectedEntityDetails.processedFilters['RANGE'] && 
                    ($scope.selectedEntityDetails.processedFilters['RANGE'].length * RANGE_SUB_FILTERS_COUNT)) || 0;

            return $scope.filterData.appliedFilters.length === (optionFilterCount + durationFilterCount + rangeFiltersCount);
        };


    }
]);