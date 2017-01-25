admin.controller('adSntAdminLightSpeedCredentialSetupCtrl',
    ['$scope', 'config', 'adLightSpeedPOSSetupSrv',
        function($scope, config, adLightSpeedPOSSetupSrv) {

            var interfaceIdentifier = 'lightspeed';

            $scope.toggleEnabled = function() {
                config.enabled = !config.enabled;
            };

            $scope.saveInterfaceConfig = function() {
                $scope.callAPI(adLightSpeedPOSSetupSrv.setProviderCredentials, {
                    params: {
                        config: $scope.config
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
    ])
