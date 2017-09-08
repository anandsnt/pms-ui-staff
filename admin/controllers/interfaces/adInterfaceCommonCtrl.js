angular.module('admin').controller('adInterfaceCommonCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', '$stateParams',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams) {

        var interfaceIdentifier = $stateParams.id;

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
            // init
            $scope.config = config;
            $scope.availableSettings = _.keys(config);
            $scope.interface = interfaceIdentifier.toUpperCase();
        })();
    }
]);
