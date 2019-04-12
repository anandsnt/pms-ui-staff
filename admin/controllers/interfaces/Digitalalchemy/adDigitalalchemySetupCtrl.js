angular.module('admin').controller('adDigitalalchemySetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesSrv',
    function($scope, $rootScope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'digitalalchemy';

        $scope.sync = {
            start_date: null,
            end_date: null
        };

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.realTimeDataSyncItems = ['reservation'];

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };
        /**
         * when button clicked to switch between mappings/settings
         * @return {undefined}
         * @param {name} name tab name to toggle.
         */
        $scope.changeTab = function(name) {
          $scope.state.activeTab = name;
        };

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
            //    init
            $scope.config = config;
        })();
    }
]);
