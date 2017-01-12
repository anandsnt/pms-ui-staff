admin.controller('adDelphiCtrl', ['$scope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, config, adInterfacesCommonConfigSrv) {

        var interfaceIdentifier = 'delphi';

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveInterfaceConfig = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            //    init
            var onFetchMetaSuccess = function(response) {
                $scope.rates = response.rates;
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.fetchOptionsList, {
                onSuccess: onFetchMetaSuccess,
                params: ['RATES']
            });

            $scope.config = config;
            $scope.interface = interfaceIdentifier.toUpperCase();
        })();
    }
]);
