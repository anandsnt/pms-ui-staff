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
            // CICO-64155 disable data sync tab when integration not enabled
            if(name === "DATA" && !$scope.config.enabled) {
                $scope.errorMessage = ["Please enable integration to perform Data Sync..."];
            } else {
                $scope.state.activeTab = name;
            }
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
