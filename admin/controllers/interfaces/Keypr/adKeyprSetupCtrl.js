angular.module('admin').controller('adKeyprSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesSrv',
    function($scope, $rootScope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.integration = 'KEYPR';


        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
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
        })();
    }
]);
