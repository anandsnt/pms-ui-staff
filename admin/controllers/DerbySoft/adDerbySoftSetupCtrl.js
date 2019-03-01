admin.controller('ADDerbySoftSetupCtrl', [
    '$scope', 'derbysoftSetupValues', 'adInterfacesCommonConfigSrv', 'adIFCInterfaceMappingSrv', 'ngDialog',
    function($scope, derbysoftSetupValues, adInterfacesCommonConfigSrv, adIFCInterfaceMappingSrv, ngDialog) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'DERBYSOFT';

        $scope.state = {
            activeTab: 'SETUP'
        };

        $scope.mappingTypes = ['cancellation_policies', 'tax_codes']

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

        /**
         * Genearete Auth token
         * @return {void}
         */
        $scope.generateAuthToken = function() {
            $scope.callAPI(adIFCInterfaceMappingSrv.resetAuthToken, {
                interface: $scope.interface.toLowerCase(),
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
            $scope.config = derbysoftSetupValues;
        })();
    }]);
