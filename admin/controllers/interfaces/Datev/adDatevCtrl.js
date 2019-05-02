admin.controller('adDatevCtrl', ['$scope', 'config', 'adInterfacesSrv', 'ngDialog',
    function($scope, config, adInterfacesSrv, ngDialog) {
        BaseCtrl.call(this, $scope);
        var glAccountNumberLength;

        $scope.interface = 'DATEV';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

         /**
         *
         * @return {undefined}
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        $scope.acceptNewGlAccountNumber = function() {
          glAccountNumberLength = $scope.config.gl_account_number_length;
          $scope.saveSetup();
          ngDialog.close();
        };

         /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            if ($scope.config.gl_account_number_length && glAccountNumberLength !== $scope.config.gl_account_number_length) {
              ngDialog.open({
                template: '/assets/partials/interfaces/datev/adGlAccountNumberChangeWarnPopup.html',
                className: 'ngdialog-theme-default1 modal-theme1',
                closeByDocument: true,
                scope: $scope
              });
              return;
            }
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
            glAccountNumberLength = config.gl_account_number_length;
        })();
    }
]);
