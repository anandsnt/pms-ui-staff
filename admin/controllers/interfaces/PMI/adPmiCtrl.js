admin.controller('adPmiCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function ($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'PMI';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.realTimeDataSyncItems = ['trial_balance', 'restat', 'resfct', 'ad_v001'];
        $scope.historicalDataSyncItems = ['trial_balance', 'restat', 'resfct', 'ad_v001'];

        /**
         * when clicked on check box to enable/disable PMI
         * @return {undefined}
         */
        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.toggleInfants = function () {
            $scope.config.add_infants_to_guest_count = !$scope.config.add_infants_to_guest_count;
        };

        /**
         *
         * @return {undefined}
         * @param {name} name name of current active Tab
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

            $scope.deletePropertyIfRequired(params, 'ftp_password');

            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: params,
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
            $scope.setDefaultDisplayPassword($scope.config, 'ftp_password');
        })();
    }]);
