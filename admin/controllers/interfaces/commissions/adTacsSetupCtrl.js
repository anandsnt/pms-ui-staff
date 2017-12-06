admin.controller('ADTacsSetupCtrl', ['$scope', 'config', 'countryList', 'currencyList', 'adInterfacesCommonConfigSrv',
    function($scope, config, countryList, currencyList, adInterfacesCommonConfigSrv) {

        $scope.saveInterfaceConfig = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: 'TACS'
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            $scope.config = config;
            $scope.countryList = countryList;
            $scope.currencyList = currencyList;
        })();
    }
]);