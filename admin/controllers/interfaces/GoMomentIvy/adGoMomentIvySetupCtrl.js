admin.controller('adGoMomentIvySetupCtrl', ['$scope', 'goMomentIvySetupValues', 'adInterfacesCommonConfigSrv',
    function($scope, goMomentIvySetupValues, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interfaceIdentifier = 'GOMOMENTIVY';

        /**
         * when clicked on check box to enable/diable GoMomentIvy
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfSave = function() {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: $scope.interfaceIdentifier
                },
                successCallBack: successCallBackOfSave
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.config = goMomentIvySetupValues;
        })();
    }]);