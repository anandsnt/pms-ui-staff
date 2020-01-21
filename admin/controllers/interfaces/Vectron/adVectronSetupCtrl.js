admin.controller('ADVectronSetupCtrl', [
    '$scope', 'config', 'chargeCodes', 'adInterfacesSrv', 'adIFCSrv', 'ngDialog',
    function ($scope, config, chargeCodes, adInterfacesSrv, adIFCSrv, ngDialog) {
        BaseCtrl.call(this, $scope);
        $scope.interface = 'VECTRON';
        $scope.state = {
            activeTab: 'SETTING'

        };

        var resetToken = function () {
            return adIFCSrv.post('authentication', 'reset_token', {
                integration: $scope.interface.toLowerCase()
            });
        };

        var fetchToken = function () {
            return adIFCSrv.get('authentication', 'token', {
                integration: $scope.interface.toLowerCase()
            });
        };

        /**
         * when clicked on check box to enable/disable Vectron
         * @return {undefined}
         */
        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         * @param {string} name "tab name"
         * @return {undefined}
         */
        $scope.changeTab = function (name) {
            $scope.state.activeTab = name;
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };

        $scope.onClickRegenerate = function () {
            if (!$scope.config.authentication_token) {
                $scope.generateAuthToken();
            } else {
                ngDialog.open({
                    template: '/assets/partials/interfaces/Vectron/adVectronGenerateTokenPopup.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            }

        };

        /**
         * Generate Auth token
         * @return {void}
         */
        $scope.generateAuthToken = function () {
            $scope.callAPI(resetToken, {
                successCallBack: function (response) {
                    $scope.config.authentication_token = response.authentication_token;
                    $scope.closeDialog();
                }
            });
        };

        var loadToken = function () {
            $scope.callAPI(fetchToken, {
                successCallBack: function (response) {
                    $scope.config.authentication_token = response.authentication_token;
                }
            });
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
         * Initialization stuffs
         * @return {undefined}
         */
        (function () {
            loadToken();
            $scope.config = config;
            $scope.chargeCodes = chargeCodes.charge_codes;
        })();
    }
]);
