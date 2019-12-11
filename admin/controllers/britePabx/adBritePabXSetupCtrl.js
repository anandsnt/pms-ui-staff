admin.controller('adBritePabXSetupCtrl', ['$scope', 'britePabXSetupValues', 'adInterfacesCommonConfigSrv', '$timeout',
    function ($scope, britePabXSetupValues, adInterfacesCommonConfigSrv, $timeout) {

        BaseCtrl.call(this, $scope);

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefined}
         */
        $scope.toggleBritePabXEnabled = function () {
            $scope.brite.enabled = !$scope.brite.enabled;
        };

        // if there is any error occured
        $scope.$on('showErrorMessage', function ($event, errorMessage) {
            $event.stopPropagation();
            $scope.errorMessage = errorMessage;
        });

        var clearConfigValues = function () {
            $scope.brite.charge_code_id = '';
            $scope.brite.charge_code_name = '';
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.savePabXSetup = function () {
            var params = {
                interfaceIdentifier: 'brite',
                config: _.omit(angular.copy($scope.brite), 'charge_code_name')
            };

            $scope.deletePropertyIfRequired(params.config, 'api_key');

            if (params.config.charge_code_id === '') {
                $timeout(function () {
                    $scope.errorMessage = ['Please search a charge code, pick from the list and proceed'];
                    clearConfigValues();
                }, 20);
                return;
            }

            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: params,
                successCallBack: $scope.goBackToPreviousState
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function () {
            $scope.brite = britePabXSetupValues;
            $scope.setDefaultDisplayPassword($scope.brite, 'api_key');
        }());
    }]);
