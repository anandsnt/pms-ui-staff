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
            // rename keys for the select box directive
            _.each(countryList, function(country) {
                country.name = country.value;
                country.value = country.id;
            });
            $scope.countryList = countryList;
            $scope.currencyList = currencyList;
        })();
    }
]);