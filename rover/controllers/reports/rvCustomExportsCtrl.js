angular.module('sntRover').controller('RVCustomExportCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    '$rootScope',
    'RVreportsSrv',
    function($scope, RVCustomExportSrv, $timeout, $rootScope, reportsSrv) {
        BaseCtrl.call(this, $scope);

        const STAGES = {
            SHOW_CUSTOM_EXPORT_LIST: 'SHOW_CUSTOM_EXPORT_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS'
        };

        const REPORT_COLS_SCROLLER = 'report-cols-scroller';
        const REPORT_SELECTED_COLS_SCROLLER = 'report-selected-cols-scroller';
        const SCROLL_REFRESH_DELAY = 100;

        // Initialize the scrollers
        var initializeScrollers = () => {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_COLS_SCROLLER, scrollerOptions);
            $scope.setScroller(REPORT_SELECTED_COLS_SCROLLER, scrollerOptions);
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
            return $scope.currentStage === STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        // Create new export
        var configureNewExport = () => {
            fetchDataSpaces();
            $scope.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        // Listener for creating new custom export
        $scope.addListener('CREATE_NEW_CUSTOM_EXPORT', function () {
            configureNewExport();
            $scope.customExportsData.isNewExport = true;
            $scope.updateView($scope.reportViewActions.SHOW_CUSTOM_NEW_EXPORT);
            $scope.updateViewCol($scope.viewColsActions.ONE);
        });

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
                            filteredOut: false
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

                    $scope.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
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
        var loadReqData = (reportId) => {
            var onSuccess = ( payload ) => {
                    $scope.selectedEntityDetails.columns = payload.columns;
                    $scope.selectedEntityDetails.active = true;
                    $scope.currentStage = STAGES.SHOW_PARAMETERS;
                    $scope.customExportsData.exportFormats = payload.exportFormats;
                    $scope.customExportsData.deliveryTypes = payload.deliveryTypes;

                    if (!$scope.customExportsData.isNewExport) {
                        applySelectedFormatAndDeliveryTypes(); 
                        updateSelectedColumns();
                    }
                    $scope.updateViewCol($scope.viewColsActions.FOUR);
                    refreshScroll(REPORT_COLS_SCROLLER);

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
            $scope.selectedEntityDetails = selectedDataSpace;
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
                    $scope.addingStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
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
            loadReqData(selectedSchedule.report.id);
        };

        // Save the given schedule
        var saveSchedule = () => {
            var requestParams = getScheduleParams($scope.selectedEntityDetails.report.id),
                onScheduleSaveSuccess = () => {
                    $scope.errorMessage = '';
                    $scope.updateViewCol($scope.viewColsActions.ONE);
                    $scope.addingStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                    $scope.customExportsData.isNewExport = false;
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
                $scope.addingStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
            });
    
            $scope.addListener('CREATE_NEW_CUSTOM_EXPORT_SCHEDULE', () => {
                createSchedule();
            });
        };
        
        // Initialize the controller
        var init = () => {
            $scope.customExportsData.isNewExport = false;
            
            fetchScheduledCustomExports();
            $scope.selectedColumns = [];
            $scope.customExportsData.scheduledCustomExports = [];
            $scope.customExportsData.customExportDataSpaces = [];
            $scope.customExportsData.exportFormats = [];
            $scope.customExportsData.deliveryTypes = [];
            initializeScrollers();
            setUpListeners();
            
        };

        init();

    }
]);