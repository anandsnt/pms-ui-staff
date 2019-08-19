angular.module('sntRover').controller('RVCustomExportCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    function($scope, RVCustomExportSrv, $timeout) {
        BaseCtrl.call(this, $scope);

        const STAGES = {
            SHOW_CUSTOM_EXPORT_LIST: 'SHOW_CUSTOM_EXPORT_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS'
        };

        const REPORT_COLS_SCROLLER = 'report-cols-scroller';
        const REPORT_SELECTED_COLS_SCROLLER = 'report-selected-cols-scroller';
        const SCROLL_REFRESH_DELAY = 100;

        var initializeScrollers = () => {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_COLS_SCROLLER, scrollerOptions);
            $scope.setScroller(REPORT_SELECTED_COLS_SCROLLER, scrollerOptions);
        };

        var refreshScroll = function(name, reset) {

            //$timeout(function () {
                $scope.refreshScroller(name);
            //}, SCROLL_REFRESH_DELAY);
            

            if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
                $scope.myScroll[name].scrollTo(0, 0, SCROLL_REFRESH_DELAY);
            }
        };

        $scope.shouldShowExportListOnly = () => {
            return $scope.currentStage === STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        var configureNewExport = () => {
            fetchDataSpaces();
            $scope.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        $scope.addListener('CREATE_NEW_CUSTOM_EXPORT_LISTENER', function () {
            configureNewExport();
            $scope.isAddingNew = true;
            $scope.updateView($scope.reportViewActions.SHOW_CUSTOM_NEW_EXPORT);
            $scope.updateViewCol($scope.viewColsActions.ONE);
        });

        /**
         * Fetch available data spaces for custom exports
         */
        var fetchDataSpaces = () => {
            var onDataSpaceFetchSuccess = (data) => {
                    
                    _.each(data, function (dataSpace) {
                        $scope.$parent.$parent.customExportDataSpaces.push({
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
                onDataSpaceFetchFailure = (error) => {
                    $scope.$parent.$parent.customExportDataSpaces = [];
                };

            $scope.callAPI(RVCustomExportSrv.getAvailableDataSpaces, {
                onSuccess: onDataSpaceFetchSuccess,
                onFailure: onDataSpaceFetchSuccess
            });
        };

        var fetchScheduledCustomExports = () => {
            var onScheduledExportsFetchSuccess = (data) => {
                $scope.$parent.$parent.scheduledCustomExports = data;

                _.each ($scope.$parent.$parent.scheduledCustomExports, function (schedule) {
                    schedule.filteredOut = false;
                });

                $scope.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
            },
            onScheduledExportsFetchFailure = (error) => {
                $scope.$parent.$parent.scheduledCustomExports = [];
            };

            $scope.callAPI(RVCustomExportSrv.getScheduledCustomExports, {
                onSuccess: onScheduledExportsFetchSuccess,
                onFailure: onScheduledExportsFetchFailure
            });

        };

        $scope.clickDataSpace = ( selectedDataSpace ) => {
            var onSuccess = ( payload ) => {

                    $scope.selectedEntityDetails = selectedDataSpace;
                    $scope.selectedEntityDetails.columns = payload.columns;
                    $scope.selectedEntityDetails.active = true;
                    $scope.currentStage = STAGES.SHOW_PARAMETERS;
                    $scope.updateViewCol($scope.viewColsActions.FOUR);
                    $scope.$parent.$parent.exportFormats = payload.exportFormats;
                    $scope.$parent.$parent.deliveryTypes = payload.deliveryTypes;

                    refreshScroll(REPORT_COLS_SCROLLER);

                },
                onFailure = (  ) => {

                };
                
            $scope.callAPI(RVCustomExportSrv.getRequestData, {
                onSuccess: onSuccess,
                onFailure: onFailure,
                params: {
                    reportId: selectedDataSpace.id
                }
            });
            
        };

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

        var init = () => {
            $scope.isAddingNew = false;
            
            fetchScheduledCustomExports();
            $scope.selectedColumns = [];
            $scope.$parent.$parent.scheduledCustomExports = [];
            $scope.$parent.$parent.customExportDataSpaces = [];
            $scope.$parent.$parent.exportFormats = [];
            $scope.$parent.$parent.deliveryTypes = [];
            initializeScrollers();
        };

        init();

    }
]);