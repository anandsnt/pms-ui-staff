admin.controller('adComtrolCtrl', ['$scope', 'config', 'adInterfacesSrv', 'ngDialog', 'adIFCSrv',
    function ($scope, config, adInterfacesSrv, ngDialog, adIFCSrv) {
        BaseCtrl.call(this, $scope);

        var resetToken = function() {
            return adIFCSrv.post('authentication', 'reset_token', {integration: 'comtrol'});
        };

        var fetchToken = function() {
            return adIFCSrv.get('authentication', 'token', {integration: 'comtrol'});
        };

        var fetchHotelSetting = function() {
            return adInterfacesSrv.hotelSettings();
        };

        var dataSwap = function() {
            return adIFCSrv.post('comtrol', 'data_swap', {})
        };

        $scope.interface = 'COMTROL';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.toggleMealPeriodMappings = function() {
            $scope.config.meal_period_mappings_enabled = !$scope.config.meal_period_mappings_enabled;
        };

        /**
         *
         * @return {undefined}
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

            $scope.callAPI(adInterfacesSrv.updateLocalSettings, {
                params: {
                    comtrol_oracode_enabled: $scope.config.enabled && $scope.comtrol_oracode_enabled
                }
            });
        };

        /**
         * Dialog methods
         */
        $scope.onClickRegenerate = function () {
            ngDialog.open({
                template: '/assets/partials/interfaces/comtrol/adComtrolTokenWarning.html',
                scope: $scope,
                closeByDocument: true
            });
        };

        $scope.onClickDataSwap = function () {
            ngDialog.open({
                template: '/assets/partials/interfaces/comtrol/adComtrolDataSwapWarning.html',
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

        $scope.initiateDataSwap = function () {
            $scope.callAPI(dataSwap, {
                successCallBack: function(response) {
                    $scope.dataSwapInitMessage = response.data;
                    $scope.closeDialog();
                }
            });
        };

        $scope.toggleOracodeEnabled = function() {
            $scope.comtrol_oracode_enabled = !$scope.comtrol_oracode_enabled;
        };

        var loadToken = function () {
            $scope.callAPI(fetchToken, {
                successCallBack: function (response) {
                    $scope.authentication_token = response.authentication_token;
                }
            });
        };

        var loadOracodeSetting = function () {
            $scope.callAPI(fetchHotelSetting, {
                successCallBack: function (response) {
                    $scope.comtrol_oracode_enabled = response.comtrol_oracode_enabled;
                }
            });
        };

        /**
         * Dialog methods
         */

        (function () {
            if (config.meal_period_mappings_enabled === null) {
                config.meal_period_mappings_enabled = false;
            }
            $scope.config = config;
            $scope.setDefaultDisplayPassword($scope.config, 'password');
            loadOracodeSetting();
            loadToken();
            $scope.languages = [
                {id: "0", name: "English"},
                {id: "1", name: "Spanish"},
                {id: "2", name: "French"},
                {id: "3", name: "Italian"},
                {id: "4", name: "Japanese"},
                {id: "5", name: "Slovenian"},
                {id: "6", name: "German"},
                {id: "7", name: "Russian"}
            ];
        })();
    }
]);
