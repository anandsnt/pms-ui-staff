admin.controller('adComtrolCtrl', ['$scope', 'config', 'adInterfacesSrv', 'ngDialog', 'adIFCSrv',
    function ($scope, config, adInterfacesSrv, ngDialog, adIFCSrv) {
        BaseCtrl.call(this, $scope);

        var resetToken = function() {
            return adIFCSrv.post('authentication', 'reset_token', {integration: 'comtrol'})
        };

        var fetchToken = function() {
            return adIFCSrv.get('authentication', 'token', {integration: 'comtrol'})
        };

        $scope.interface = 'COMTROL';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
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

        var loadToken = function () {
            $scope.callAPI(fetchToken, {
                successCallBack: function (response) {
                    $scope.authentication_token = response.authentication_token;
                }
            });
        };

        /**
         * Dialog methods
         */

        (function () {
            $scope.config = config;
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
