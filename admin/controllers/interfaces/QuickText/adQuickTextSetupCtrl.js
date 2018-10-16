admin.controller('adQuickTextSetupCtrl', ['$scope', 'quicktextSetupValues', 'adInterfacesCommonConfigSrv',
    function($scope, quicktextSetupValues, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interfaceIdentifier = 'quicktext';

        /**
         * when clicked on check box to enable/disable QuickText
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfQuickTextSetup = function() {
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
                successCallBack: successCallBackOfQuickTextSetup
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.config = quicktextSetupValues;
        })();
    }]);
