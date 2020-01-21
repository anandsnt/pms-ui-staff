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
            if (name === "DATA" && !$scope.config.enabled) {
                $scope.errorMessage = ["Please enable integration to perform Data Sync..."];
            } else {
                $scope.state.activeTab = name;
            }
        };

        $scope.saveSetup = function() {
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'sftp_password');

            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    integration: $scope.interface.toLowerCase(),
                    settings: params
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
            $scope.setDefaultDisplayPassword($scope.config, 'sftp_password');
        })();
    }
]);
