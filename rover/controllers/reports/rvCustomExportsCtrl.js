angular.module('sntRover').controller('RVCustomExportCtrl', [
    '$scope',
    'RVCustomExportSrv',
    function($scope, RVCustomExportSrv) {
        BaseCtrl.call(this, $scope);

        const STAGES = {
            SHOW_CUSTOM_EXPORT_LIST: 'SHOW_CUSTOM_EXPORT_LIST'
        };

        $scope.shouldShowExportListOnly = () => {
            return $scope.currentStage === STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        var configureNewExport = () => {
            fetchDataSpaces();
            $scope.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        $scope.addListener('CREATE_NEW_CUSTOM_EXPORT_LISTENER', () => {
            configureNewExport();
            $scope.isAddingNew = true;
        });

        /**
         * Fetch available data spaces for custom exports
         */
        var fetchDataSpaces = () => {
            var onDataSpaceFetchSuccess = (data) => {
                    $scope.$parent.customExportDataSpaces = data;
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
            },
            onScheduledExportsFetchFailure = (error) => {
                $scope.$parent.scheduledCustomExports = [];
            };

            $scope.callAPI(RVCustomExportSrv.getScheduledCustomExports, {
                onSuccess: onScheduledExportsFetchSuccess,
                onFailure: onScheduledExportsFetchFailure
            });

        };

        var init = () => {
            $scope.isAddingNew = false;
            
            fetchScheduledCustomExports();
        };

        init();

    }
]);