admin.controller('adBaswareCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function ($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'BASWARE';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.historicalDataSyncItems = ['invoice'];
        /**
         *
         * @return {undefined}
         * @param {name} name name of active tab
         */
        $scope.changeTab = function (name) {
            $scope.state.activeTab = name;
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function () {
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'password');

            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: params,
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
            $scope.setDefaultDisplayPassword($scope.config, 'password');
        })();
    }
]);
