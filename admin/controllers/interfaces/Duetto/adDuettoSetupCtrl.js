admin.controller('adDuettoSetupCtrl', ['$scope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, config, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);

        var interfaceIdentifier = 'duetto';

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
            //    init
            var onFetchMetaSuccess = function(response) {
                $scope.rates = response.rates;
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.fetchOptionsList, {
                onSuccess: onFetchMetaSuccess,
                params: ['RATES']
            });

            $scope.config = config;
            $scope.setDefaultDisplayPassword($scope.config, 'password');
            $scope.interface = interfaceIdentifier.toUpperCase();
        })();
    }
])
