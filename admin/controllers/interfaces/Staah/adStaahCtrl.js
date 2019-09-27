admin.controller('adStaahController', ['$scope', 'config', 'adInterfacesSrv', 'ngDialog', 'adIFCSrv',
    function ($scope, config, adInterfacesSrv, ngDialog, adIFCSrv) {
        BaseCtrl.call(this, $scope);

        var resetToken = function() {
            return adIFCSrv.post('authentication', 'reset_token', {integration: 'staah'});
        };

        var fetchToken = function() {
            return adIFCSrv.get('authentication', 'token', {integration: 'staah'});
        };

        var loadToken = function () {
            $scope.callAPI(fetchToken, {
                successCallBack: function (response) {
                    $scope.authentication_token = response.authentication_token;
                }
            });
        };

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
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'password');
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
         * Dialog methods for generate IFC user auth token.
         * Button to open popup
         * Buttons in popup close and generate
         */
        $scope.onClickRegenerate = function () {
            ngDialog.open({
                template: '/assets/partials/interfaces/staah/adStaahTokenWarning.html',
                scope: $scope,
                closeByDocument: true
            });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };

        $scope.regenerateAuth = function () {
            $scope.callAPI(resetToken, {
                successCallBack: function (response) {
                    $scope.authentication_token = response.authentication_token;
                    $scope.closeDialog();
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
            $scope.setDefaultDisplayPassword($scope.config, 'password');

            loadToken();

            // initialize feature setting values
            var featureSettings = ['reservation_download', 'ari_upload'];

            for (var i = 0; i < featureSettings.length; i++) {
                $scope.featureSettingsInit(featureSettings[i]);
            }
        })();
    }
]);
