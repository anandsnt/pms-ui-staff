admin.controller('adSafeaccountingCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'SAFEACCOUNTING';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.mappingTypes = ['charge_code', 'charge_code_cost_center', 'tax_code'];

        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         *
         * @return {undefined}
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        (function() {
            $scope.config = config;
        })();
    }
]);
