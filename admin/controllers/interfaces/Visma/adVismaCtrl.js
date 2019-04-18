admin.controller('adVismaCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function ($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'VISMA';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.historicalDataSyncItems = ['accounting_exports'];

        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         *
         * @return {undefined}
         * @param {name} name name of current active Tab
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        }

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function () {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function () {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        (function () {
            $scope.config = config;
        })();
    }
]);
