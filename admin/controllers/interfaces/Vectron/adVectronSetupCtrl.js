admin.controller('ADVectronSetupCtrl', [
    '$scope', 'vectronSetupValues', 'adInterfacesCommonConfigSrv', 'adVectronSetupSrv', '$window',
    function($scope, vectronSetupValues, adInterfacesCommonConfigSrv, adVectronSetupSrv, $window) {
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

        $scope.onClickRegenerate = function() {
            //generate New token
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
