angular.module('admin').controller('adConcept4000SetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv) {
        BaseCtrl.call(this, $scope);
        
        var interfaceIdentifier = 'concept4000';

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
            //    init
            $scope.config = config;
            $scope.setDefaultDisplayPassword($scope.config, 'password');
        })();
    }
]);
