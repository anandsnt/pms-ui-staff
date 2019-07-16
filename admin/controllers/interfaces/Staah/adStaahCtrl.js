angular.module('admin').controller('adStaahController', ['$scope', 'config', 'adInterfacesSrv',
    function ($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'STAAH';

        $scope.state = {
            activeTab: 'SETTING'
        };

        /**
         * when clicked on check box to enable/disable Staah
         * @return {undefined}
         */
        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
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
         *
         * @return {undefined}
         * @param {string} option name of feature setting to toggle
         */
        $scope.toggleFeatureSetting = function (option) {
            $scope.config[option] = !$scope.config[option];
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
         * Initialization
         * @return {undefined}
         * @param {string} option feature setting
         * if feature setting values are undefined, initialize to false
         */
        $scope.featureSettingsInit = function (option) {
            if (angular.isUndefined($scope.config[option])) {
                $scope.config[option] = false;
            }
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function () {
            $scope.config = config;
            // initialize feature setting values
            var featureSettings = ['reservation_download', 'reservation_upload', 'ari_upload'];

            for (var i = 0; i < featureSettings.length; i++) {
                $scope.featureSettingsInit(featureSettings[i]);
            }
        })();
    }]);