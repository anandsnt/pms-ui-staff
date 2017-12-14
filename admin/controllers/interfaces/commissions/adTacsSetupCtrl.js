admin.controller('ADTacsSetupCtrl', ['$scope', 'config', 'countryList', 'currencyList', 'adCommissionsConfigSrv',
    function($scope, config, countryList, currencyList, adCommissionsConfigSrv) {

        $scope.saveInterfaceConfig = function() {
            var params = $scope.config;
            params.commission_interface_type = 'TACS';
            $scope.callAPI(adCommissionsConfigSrv.saveConfiguration, {
                params: params,
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            $scope.config = config;
            $scope.config.taxation_country_id = config.taxation_country_id ? config.taxation_country_id.toString() : '';
            $scope.config.currency_id = config.currency_id ? config.currency_id.toString() : '';
            $scope.countryList = countryList;
            $scope.currencyList = currencyList;
        })();
    }
]);