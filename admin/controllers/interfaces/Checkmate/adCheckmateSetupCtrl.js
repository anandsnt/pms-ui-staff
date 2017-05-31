admin.controller('adCheckmateSetupCtrl', ['$scope', 'checkmateSetupValues', 'adInterfacesCommonConfigSrv',
    function($scope, checkmateSetupValues, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interfaceIdentifier = 'CHECKMATE';

        /**
         * when clicked on check box to enable/disable GoMomentIvy
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfCheckmateSetup = function() {
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
                successCallBack: successCallBackOfCheckmateSetup
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.config = checkmateSetupValues;
        })();
    }]);