angular.module('admin').controller('adConcept4000SetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv) {

        var interfaceIdentifier = 'concept4000';

        $scope.sync = {
            start_date: null,
            end_date: null
        };

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
            $scope.config = config;
        })();
    }
]);
