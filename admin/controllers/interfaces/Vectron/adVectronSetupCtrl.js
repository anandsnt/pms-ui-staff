admin.controller('ADVectronSetupCtrl', ['$scope', 'config', 'adInterfacesSrv', 'adVectronSetupSrv', 'ngDialog',
    function($scope, config, adInterfacesSrv, adVectronSetupSrv, ngDialog) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'VECTRON';

        $scope.state = {
            activeTab: 'SETTING'

        };

        /**
         * when clicked on check box to enable/disable Vectron
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         *
         * @return {undefined}
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        $scope.closeDialog = function() {
            ngDialog.close();
        };

        $scope.onClickRegenerate = function() {
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
         * Genearete Auth token
         * @return {void}
         */
        $scope.generateAuthToken = function() {
            $scope.callAPI(adVectronSetupSrv.resetAuthToken, {
                onSuccess: function(response) {
                    $scope.config.authentication_token = response.authentication_token;
                    $scope.closeDialog();
                }
            });
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.config = config;
        })();
    }]);
