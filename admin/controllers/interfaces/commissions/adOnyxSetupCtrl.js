admin.controller('ADOnyxSetupCtrl', ['$scope', 'config', 'countryList', 'currencyList', 'adCommissionsConfigSrv',
    function($scope, config, countryList, currencyList, adCommissionsConfigSrv) {

        $scope.saveInterfaceConfig = function() {
            var params = $scope.config;
            params.commission_interface_type = 'ONYX';
            $scope.callAPI(adCommissionsConfigSrv.saveConfiguration, {
                params: params,
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