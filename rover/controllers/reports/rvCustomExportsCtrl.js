angular.module('sntRover').controller('RVCustomExportCtrl', [
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

        const STAGES = {
            SHOW_CUSTOM_EXPORT_LIST: 'SHOW_CUSTOM_EXPORT_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS'
        };

        const REPORT_COLS_SCROLLER = 'report-cols-scroller';
        const REPORT_SELECTED_COLS_SCROLLER = 'report-selected-cols-scroller';
        const EXPORT_LIST_SCROLLER = 'exports-list-scroller';
        const SCROLL_REFRESH_DELAY = 100;

        // Initialize the scrollers
        var initializeScrollers = () => {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_COLS_SCROLLER, scrollerOptions);
            $scope.setScroller(REPORT_SELECTED_COLS_SCROLLER, scrollerOptions);
            $scope.setScroller(EXPORT_LIST_SCROLLER, scrollerOptions);
        };

        // Refresh the given scroller
        var refreshScroll = function(name, reset) {

            $scope.refreshScroller(name);

            if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
                $scope.myScroll[name].scrollTo(0, 0, SCROLL_REFRESH_DELAY);
            }
        };

        // Should show the export list
        $scope.shouldShowExportListOnly = () => {
            return $scope.viewState.currentStage === STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        // Create new export
        var configureNewExport = () => {
            fetchDataSpaces();
            $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        /**
         * Fetch available data spaces for custom exports
         */
        var fetchDataSpaces = () => {
            var onDataSpaceFetchSuccess = (data) => {
                    
                    _.each(data, function (dataSpace) {
                        $scope.customExportsData.customExportDataSpaces.push({
                            id: dataSpace.id,
                            report: {
                                id: dataSpace.id,
                                title: dataSpace.title,
                                description: dataSpace.description
                            },
                            active: false,
                            filteredOut: false,
                            filters: dataSpace.filters
                        });
                    });                                       
                },
                onDataSpaceFetchFailure = () => {
                    $scope.customExportsData.customExportDataSpaces = [];
                };

            $scope.callAPI(RVCustomExportSrv.getAvailableDataSpaces, {
                onSuccess: onDataSpaceFetchSuccess,
                onFailure: onDataSpaceFetchFailure
            });
        };

        // Fetch scheduled custom exports
        var fetchScheduledCustomExports = () => {
            var onScheduledExportsFetchSuccess = (data) => {
                    $scope.customExportsData.scheduledCustomExports = data;

                    _.each($scope.customExportsData.scheduledCustomExports, function (schedule) {
                        schedule.filteredOut = false;
                        schedule.report.description = schedule.name;
                    });

                    $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                },
                onScheduledExportsFetchFailure = () => {
                    $scope.customExportsData.scheduledCustomExports = [];
                };

            $scope.callAPI(RVCustomExportSrv.getScheduledCustomExports, {
                onSuccess: onScheduledExportsFetchSuccess,
                onFailure: onScheduledExportsFetchFailure
            });

        };
        
        // Populate the selected value for delivery type and format for already saved schedule
        var applySelectedFormatAndDeliveryTypes = () => {
                $scope.customExportsScheduleParams.format = $scope.selectedEntityDetails.format && $scope.selectedEntityDetails.format.id;
                $scope.customExportsScheduleParams.deliveryType = $scope.selectedEntityDetails.delivery_type && $scope.selectedEntityDetails.delivery_type.id;
            },
            // mark the selected columns
            updateSelectedColumns = () => {
                
                _.each ($scope.selectedEntityDetails.mapped_name, (value) => {
                    var selectedColumn = _.find($scope.selectedEntityDetails.columns, {
                                            name: value.field_name 
                                        }),
                        columnPos = parseInt(value.sequence_order) - 1;
                    
                        selectedColumn.selected = true;
                        selectedColumn.customColLabel = value.mapped_name;

                    $scope.selectedColumns[columnPos] = selectedColumn;

                });
            };
            
        /**
         * Loads all the data required for the exports
         * @param {Number} reportId - id of the report
         * @return {void}
         */
        var loadReqData = (reportId, isSavedSchedule ) => {
            var onSuccess = ( payload ) => {
                    $scope.selectedEntityDetails.columns = angular.copy(payload.columns);
                    $scope.selectedEntityDetails.active = true;
                    $scope.viewState.currentStage = STAGES.SHOW_PARAMETERS;
                    $scope.customExportsData.exportFormats = angular.copy(payload.exportFormats);
                    $scope.customExportsData.deliveryTypes = angular.copy(payload.deliveryTypes);
                    $scope.customExportsData.durations = angular.copy(payload.durations);

                    if (!$scope.customExportsData.isNewExport) {
                        applySelectedFormatAndDeliveryTypes(); 
                        updateSelectedColumns();
                    }
                    $scope.updateViewCol($scope.viewColsActions.FOUR);
                    refreshScroll(REPORT_COLS_SCROLLER);

                    var reportFilters = angular.copy($scope.selectedEntityDetails.filters);

                    $scope.selectedEntityDetails.processedFilters = RVCustomExportsUtilFac.processFilters(reportFilters);
                    if (isSavedSchedule) {
                        $scope.$broadcast('UPDATE_FILTER_SELECTIONS');
                    }

                },
                onFailure = (error) => {
                    $scope.errorMessage = error;
                };
            
            $scope.callAPI(RVCustomExportSrv.getRequestData, {
                onSuccess: onSuccess,
                onFailure: onFailure,
                params: {
                    reportId: reportId
                }
            });
        };

        // Click handler for the given data space
        $scope.clickDataSpace = ( selectedDataSpace ) => {
            // Set the previous data space as non-active
            if ($scope.selectedEntityDetails) {
                $scope.selectedEntityDetails.active = false;
            }
            $scope.selectedEntityDetails = selectedDataSpace;
            $scope.filterData.appliedFilters = [];
            loadReqData(selectedDataSpace.id);
        };

        // Handle the selection of fields belonging to the data space
        $scope.selectColumn = (column) => {
            if (column.selected) {
                $scope.selectedColumns.push(column);
            } else {
                $scope.selectedColumns = _.reject($scope.selectedColumns, (col) => {
                    return col.name === column.name;

                });
            }

            $timeout(function () {
                refreshScroll(REPORT_SELECTED_COLS_SCROLLER);
            }, 100);

        };

        /**
         * Get selected item values for multi select option
         * @param {Array} items - array of items
         * @param {String} key -the key to used as value
         * @return {Array} selectedIds - array of selected ids
         */
        var getSelectedItemValues = (items, key) => {
            key = key || 'value';
            var selectedItems = _.where(items, { selected: true }),
                selectedIds = _.pluck(selectedItems, key);

            return selectedIds;
        };

        /**
         * Construct the request params required while saving the export
         * @param {Number} reportId - id of the report
         * @return {Object} params - holding the request parameters
         */
        var getScheduleParams = (reportId) => {
            var params = {
                report_id: reportId,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                format_id: $scope.customExportsScheduleParams.format,
                delivery_type_id: $scope.customExportsScheduleParams.deliveryType,
                name: $scope.customExportsScheduleParams.exportName,
                time_period_id: 4,
                emails: 'ragesh@stayntouch.com',
                frequency_id: 3,
                export_date: "2019-03-17T18:30:00.000Z",
                repeats_every: 0,
                starts_on: "2019/03/18"

            };

            var fieldMappings = [],
                selectedField;

            _.each ($scope.selectedColumns, (column, index) => {
                selectedField = {
                    field_name: column.name,
                    mapped_name: column.customColLabel,
                    sequence_order: index + 1
                };
                fieldMappings.push(selectedField);
            });

            params.mapped_names = fieldMappings;

            // Process the applied filters
            var filterValues = {},
                paramKey;

            _.each($scope.filterData.appliedFilters, function (filter) {
                paramKey = (filter.selectedFirstLevel).toLowerCase();
                if (filter.isDuration) {
                    filterValues[paramKey] = filter.selectedSecondLevel;
                } else if (filter.isOption) {
                    if (filter.hasDualState) {
                        filterValues[paramKey] = filter.selectedSecondLevel;
                    } else if (filter.isMultiSelect) {
                        filterValues[paramKey] = getSelectedItemValues(filter.secondLevelData);
                    }
                } else if (filter.isRange) {
                    if (!filterValues[paramKey]) {
                        filterValues[paramKey] = [];
                    }
                    filterValues[paramKey].push({
                        operator: filter.selectedSecondLevel,
                        value: filter.rangeValue
                    });
                }

            });

            params.filter_values = filterValues;

            return params;
        };

        /**
         * Create a new schedule
         */
        var createSchedule = () => {
            var requestParams = getScheduleParams($scope.selectedEntityDetails.id),
                onScheduleCreateSuccess = () => {
                    $scope.errorMessage = '';
                    $scope.updateViewCol($scope.viewColsActions.ONE);
                    $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                    $scope.customExportsData.isNewExport = false;
                    fetchScheduledCustomExports();
                },
                onScheduleCreateFailure = (error) => {
                    $scope.errorMessage = error;
                };

            $scope.callAPI(reportsSrv.createSchedule, {
                params: requestParams,
                onSuccess: onScheduleCreateSuccess,
                onFailure: onScheduleCreateFailure
            });
            
        };

        /**
         * Select a particular schedule
         * @param {Object} selectedSchedule - selected schedule
         * @return {void}
         */
        $scope.pickSchedule = (selectedSchedule) => {
            $scope.selectedEntityDetails = selectedSchedule;
            $scope.customExportsData.isNewExport = false;
            $scope.selectedColumns = [];
            $scope.filterData.appliedFilters = [];
            $scope.customExportsScheduleParams.exportName = selectedSchedule.name;
            selectedSchedule.active = true;
            loadReqData(selectedSchedule.report.id, true);
        };

        // Save the given schedule
        var saveSchedule = () => {
            var requestParams = getScheduleParams($scope.selectedEntityDetails.report.id),
                onScheduleSaveSuccess = () => {
                    $scope.errorMessage = '';
                    $scope.updateViewCol($scope.viewColsActions.ONE);
                    $scope.customExportsData.isNewExport = false;
                    $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                    fetchScheduledCustomExports();
                },
                onScheduleSaveFailure = (error) => {
                    $scope.errorMessage = error;
                };

            requestParams.id = $scope.selectedEntityDetails.id;

            $scope.callAPI(reportsSrv.updateSchedule, {
                params: requestParams,
                onSuccess: onScheduleSaveSuccess,
                onFailure: onScheduleSaveFailure
            });
        };

        // Set up all the listeners here
        var setUpListeners = () => {
            $scope.addListener('UPDATE_CUSTOM_EXPORT_SCHEDULE', () => {
                saveSchedule();
            });
    
            $scope.addListener('SHOW_EXPORT_LISTING', () => {
                $scope.updateViewCol($scope.viewColsActions.ONE);
                $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                $scope.selectedEntityDetails.active = false;
                
            });
    
            $scope.addListener('CREATE_NEW_CUSTOM_EXPORT_SCHEDULE', () => {
                createSchedule();
            });

            // Listener for creating new custom export
            $scope.addListener('CREATE_NEW_CUSTOM_EXPORT', function () {
                initializeData();
                configureNewExport();
                $scope.customExportsData.isNewExport = true;
                $scope.updateView($scope.reportViewActions.SHOW_CUSTOM_NEW_EXPORT);
                $scope.updateViewCol($scope.viewColsActions.ONE);
            });
        };

        // Initialize the data
        var initializeData = () => {
            $scope.customExportsScheduleParams.format = '';
            $scope.customExportsScheduleParams.exportName = '';
            $scope.selectedColumns = [];
            $scope.customExportsData.scheduledCustomExports = [];
            $scope.customExportsData.customExportDataSpaces = [];
            $scope.customExportsData.exportFormats = [];
            $scope.customExportsData.deliveryTypes = [];
            $scope.customExportsData.durations = [];
            $scope.filterData = {
                appliedFilters: [],
                primaryFilter: ''
            };
            $scope.viewState = {
                currentStage: STAGES.SHOW_CUSTOM_EXPORT_LIST
            };
        };
        
        // Initialize the controller
        var init = () => {
            $scope.customExportsData.isNewExport = false;
            initializeData();
            fetchScheduledCustomExports();
            initializeScrollers();
            setUpListeners();
            
        };

        init();

    }
]);