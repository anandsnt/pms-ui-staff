angular.module('sntRover').controller('RVCustomExportCtrl', [
    '$scope',
    'RVCustomExportSrv',
    function($scope, RVCustomExportSrv) {
        BaseCtrl.call(this, $scope);

        const STAGES = {
            SHOW_CUSTOM_EXPORT_LIST: 'SHOW_CUSTOM_EXPORT_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS'
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
                    $scope.$parent.customExportDataSpaces = data;
                    $scope.$parent.customExportDataSpaces = $scope.$parent.customExportDataSpaces.map(dataSpace => {
                                                                dataSpace.active = false;
                                                                return dataSpace;
                                                            });
                },
                onDataSpaceFetchFailure = (error) => {
                    $scope.$parent.customExportDataSpaces = [];
                };

            $scope.callAPI(RVCustomExportSrv.getAvailableDataSpaces, {
                onSuccess: onDataSpaceFetchSuccess,
                onFailure: onDataSpaceFetchSuccess
            });
        };

        var fetchScheduledCustomExports = () => {
            var onScheduledExportsFetchSuccess = (data) => {
                $scope.$parent.scheduledCustomExports = data;
                $scope.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
            },
            onScheduledExportsFetchFailure = (error) => {
                $scope.$parent.scheduledCustomExports = [];
            };

            $scope.callAPI(RVCustomExportSrv.getScheduledCustomExports, {
                onSuccess: onScheduledExportsFetchSuccess,
                onFailure: onScheduledExportsFetchFailure
            });

        };

        

        $scope.clickDataSpace = ( selectedDataSpace ) => {
            var onDataSpaceColumnFetchSuccess = ( columnData ) => {
                    $scope.selectedEntityDetails = selectedDataSpace;
                    $scope.selectedEntityDetails.columns = columnData;
                    $scope.selectedEntityDetails.active = true;
                    $scope.currentStage = STAGES.SHOW_PARAMETERS;
                    $scope.updateViewCol($scope.viewColsActions.FOUR);

                },
                onDataSpaceColumFetchFailure = ( error ) => {

                };
                
            $scope.callAPI(RVCustomExportSrv.getDataSpaceColumns, {
                onSuccess: onDataSpaceColumnFetchSuccess,
                onFailure: onDataSpaceColumFetchFailure,
                params: {
                    reportId: selectedDataSpace.id
                }
            });
            
        };

        $scope.selectColumn = (column) => {
            if (column.selected) {
                $scope.selectedColumns.push(column) ;
            } else {
                $scope.selectedColumns = _.reject($scope.selectedColumns, (col) => {
                                            return col.name === column.name;

                                        });
            }

        };

        var init = () => {
            $scope.isAddingNew = false;
            
            fetchScheduledCustomExports();
            $scope.selectedColumns = [];
        };

        init();

    }
]);