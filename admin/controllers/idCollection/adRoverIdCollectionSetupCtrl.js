angular.module('admin').controller('adRoverIdCollectionSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv) {

        var interfaceIdentifier = 'roverIdCollection';

        $scope.toggleAllGuests = function() {
            config.scan_all_guests = !config.scan_all_guests;
        };

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveConfig = function() {
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
            $scope.config = config;
        })();
    }
]);