admin.controller('adAccountViewSetupCtrl', ['$scope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, config, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'ACCOUNTVIEW';

        $scope.state = {
            activeTab: 'SETUP'
        };

        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         *
         * @return {undefined}
         */
        $scope.toggleMappings = function() {
            $scope.state.activeTab = $scope.state.activeTab === 'SETUP' ? 'MAPPING' : 'SETUP';
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: $scope.interface
                }
            });
        };

        (function() {
            $scope.config = config;
        })();
    }
]);
