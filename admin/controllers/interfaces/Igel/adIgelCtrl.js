admin.controller('adIgelCtrl', ['$scope', 'config', 'adInterfacesSrv', 'mappingTypes',
    function($scope, config, adInterfacesSrv, mappingTypes) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'IGEL';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.mappingTypes = ['charge_code', 'payment_code_billing_account'];

        /**
         *
         * @return {undefined}
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        (function() {
            $scope.config = config;
            $scope.journalExportOptions = [
              {
                name: "Daily",
                value: "DAILY"
              },
              {
                name: "Monthly",
                value: "MONTHLY"
              }
            ];
        })();
    }
]);
