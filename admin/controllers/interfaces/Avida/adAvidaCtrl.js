admin.controller('adAvidaCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function ($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'AVIDA';

        $scope.state = {
            activeTab: 'SETTING'
        };
        
        $scope.historicalDataSyncItems = [];

        /**
         * when clicked on check box to enable/disable Avida
         * @return {undefined}
         */
        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

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
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function () {
                    $scope.errorMessge = '';
                    $scope.successMessage = "SUCCESS: Settings Updated!";
                }
            });            
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function () {
            $scope.config = config;
        })();
    }]);
