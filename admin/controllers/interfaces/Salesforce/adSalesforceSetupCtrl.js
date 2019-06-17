admin.controller('adSalesforceSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesSrv',
    function($scope, $rootScope, config, adInterfacesSrv) {

        $scope.sync = {
            start_date: null
        };

        $scope.state = {
            activeTab: "SETTING"
        };

        $scope.interface = 'salesforce';

        $scope.historical_data_sync_items = ['financials'];

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
