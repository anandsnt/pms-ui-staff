admin.controller('ADOnyxSetupCtrl', ['$scope', 'config', 'countryList', 'currencyList', 'adInterfacesCommonConfigSrv',
    function($scope, config, countryList, currencyList, adInterfacesCommonConfigSrv) {

        $scope.saveInterfaceConfig = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: 'ONYX'
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            $scope.config = config;
            _.each(countryList, function(country) {
                country.name = country.value;
                country.value = country.id;
            });
            $scope.countryList = countryList;
            $scope.currencyList = currencyList;
        })();
    }
]);