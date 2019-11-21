admin.controller('adDelphiCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'DELPHI';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.mappingTypes = ['charge_code', 'group_hold_status', 'market_segment', 'source_code'];

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.realTimeDataSyncItems = ['link', 'group', 'inventory'];

        /**
         * when button clicked to switch between mappings/settings
         * @return {undefined}
         * @param {name} name tab name to toggle.
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        $scope.saveSetup = function() {
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'password');
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: params,
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
            $scope.setDefaultDisplayPassword($scope.config, 'password');
        })();
    }
]);
