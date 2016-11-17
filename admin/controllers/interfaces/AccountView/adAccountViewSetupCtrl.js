admin.controller('adAccountViewSetupCtrl', ['$scope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, config, adInterfacesCommonConfigSrv) {

        var interfaceIdentifier = 'accountview';

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
            $scope.interface = interfaceIdentifier.toUpperCase();
            $scope.config = config;
        })();
    }
]);
