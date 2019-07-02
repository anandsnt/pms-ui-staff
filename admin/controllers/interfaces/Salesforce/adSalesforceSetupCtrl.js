admin.controller('adSalesforceSetupCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function($scope, config, adInterfacesSrv) {
        $scope.state = {
            activeTab: "SETTING"
        };

        $scope.interface = 'salesforce';


        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    integration: $scope.interface.toLowerCase(),
                    settings: $scope.config
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings Updated!';
                }
            });
        };

        (function() {
            //    init
            $scope.config = config;
        })();
    }
]);
