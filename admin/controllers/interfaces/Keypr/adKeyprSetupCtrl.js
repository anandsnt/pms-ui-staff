angular.module('admin').controller('adKeyprSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesSrv',
    function($scope, $rootScope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.integration = 'KEYPR';


        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveSetup = function() {
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'access_token');
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: params,
                    integration: $scope.integration.toLowerCase()
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS! Settings updated!';
                }
            });
        };

        (function() {
            //    init
            $scope.config = config;
            $scope.setDefaultDisplayPassword($scope.config, 'access_token');
        })();
    }
]);
