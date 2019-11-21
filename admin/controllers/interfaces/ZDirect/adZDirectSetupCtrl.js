admin.controller('adZDirectSetupCtrl', ['$scope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, config, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);

        var interfaceIdentifier = 'zdirect';

        $scope.sync = {
            start_date: null,
            end_date: null
        };

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveInterfaceConfig = function() {
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'password');

            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: params,
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
            $scope.setDefaultDisplayPassword($scope.config, 'password');
        })();
    }
]);
