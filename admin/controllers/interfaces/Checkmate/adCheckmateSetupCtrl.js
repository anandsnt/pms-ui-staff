admin.controller('adCheckmateSetupCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function($scope, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'CHECKMATE';

        $scope.state = {
            activeTab: 'SETTING'
        };

        /**
         * when clicked on check box to enable/disable GoMomentIvy
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         * when button clicked to switch between mappings/settings
         * @return {undefined}
         * @param {name} name tab name to toggle.
         */
        $scope.changeTab = function (name) {
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
                    $scope.errorMessge = '';
                    $scope.successMessage = "SUCCESS: Settings Updated!";
                }
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.config = config;
        })();
    }]);