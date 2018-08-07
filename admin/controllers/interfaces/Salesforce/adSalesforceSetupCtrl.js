admin.controller('adSalesforceSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'adSalesforceConfigSrv', '$window',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, adSalesforceConfigSrv, $window) {

        var interfaceIdentifier = 'salesforce';

        $scope.sync = {
            start_date: null
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

        $scope.authorize = function() {
            $scope.callAPI(adSalesforceConfigSrv.authorize, {
              onSuccess: function(data) {
                $window.location.href = data.redirect_url;
              }
            });
        };

        (function() {
            //    init
            $scope.config = config;
            $scope.interface = interfaceIdentifier;
        })();
    }
]);
