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
            $scope.config = config;
            $scope.interface = interfaceIdentifier.toUpperCase();
        })();
    }
]);
