admin.controller('ADVectronSetupCtrl', [
    '$scope', 'vectronSetupValues', 'adInterfacesCommonConfigSrv', 'adVectronSetupSrv', 'ngDialog',
    function($scope, vectronSetupValues, adInterfacesCommonConfigSrv, adVectronSetupSrv, ngDialog) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'VECTRON';

        $scope.state = {
            activeTab: 'SETUP'
        };

        /**
         * when clicked on check box to enable/diable GoMomentIvy
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.closeDialog = function() {
            ngDialog.close();
        };

        $scope.onClickRegenerate = function() {
            if(!$scope.config.authentication_token) {
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
         *
         * @return {undefined}
         */
        $scope.toggleMappings = function() {
            $scope.state.activeTab = $scope.state.activeTab === 'SETUP' ? 'MAPPING' : 'SETUP';
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfSave = function() {
            $scope.goBackToPreviousState();
        };


        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: $scope.interface
                },
                successCallBack: successCallBackOfSave
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.config = vectronSetupValues;
        })();
    }]);
