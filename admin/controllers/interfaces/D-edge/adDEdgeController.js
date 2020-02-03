admin.controller('adDEdgeController', ['$scope', 'config', 'adInterfacesSrv',
    function ($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'DEDGE';

        $scope.rate_types = [
            { value: 'before_tax', description: "AmountBeforeTax" },
            { value: 'after_tax', description: "AmountAfterTax" }
        ];

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.mappingTypes = ['booking_origins'];
        $scope.historicalDataSyncItems = ['Rates', 'Inventory', 'Restrictions'];

        $scope.toggleEnabled = function () {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         *
         * @return {undefined}
         */
        $scope.changeTab = function (name) {
            $scope.state.activeTab = name;
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function () {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function () {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        (function () {
            $scope.config = config;
        })();
    }
]);
