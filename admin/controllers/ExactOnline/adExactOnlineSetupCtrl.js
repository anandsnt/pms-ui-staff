admin.controller('adExactOnlineSetupCtrl', ['$scope', '$rootScope', 'adExactOnlineSetupSrv', 'dateFilter', 'endPoints', 'config', 'adInterfacesSrv',
    function($scope, $rootScope, adExactOnlineSetupSrv, dateFilter, endPoints, config, adInterfacesSrv) {
        BaseCtrl.call(this, $scope);
        $scope.exportOptions = {
            date: new tzIndependentDate($rootScope.businessDate).addDays(-1)
        };

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.integration = "EXACTONLINE";

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefined}
         */
        $scope.toggleExactOnlineEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.changeTab = function(name) {
            // CICO-64131 disable data sync tab when integration not enabled
            if (name === "DATA" && !$scope.config.authorized) {
                $scope.errorMessage = ["Please authenticate with Exactonline to perform Data Sync..."];
            } else {
                $scope.state.activeTab = name;
            }
        };

        $scope.onUrlChange = function() {
            $scope.config.authorized = false;
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    integration: $scope.integration.toLowerCase(),
                    settings: {
                        enabled: $scope.config.enabled,
                        endpoint: $scope.config.endpoint,
                        authorized: $scope.config.authorized,
                        balancing_account_code: $scope.config.balancing_account_code,
                        journal_code: $scope.config.journal_code
                    }
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = "Regional Endpoint changed, please re-authenticate!";
                    adExactOnlineSetupSrv.fetchExactOnLineConfiguration().then(function(settings) {
                        $scope.config = settings;
                    });
                }
            });
        };
        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveExactOnlineSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    integration: $scope.integration.toLowerCase(),
                    settings: $scope.config
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = "SUCCESS: Settings Updated!";
                }
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            /**
             * CICO-33067
             * After exactonline authorization, the application would be redirected to
             * the exactonline settings page directly. In such a case, the previousState wont be set,
             * also the selectedMenu wont be set.
             */
            if (!$rootScope.previousState) {
                $rootScope.previousState = "admin.backOfficeSetup";
                var interfacesMenuIndex = _.indexOf($scope.data.menus,
                    _.findWhere($scope.data.menus, {
                        menu_id: 9 // 9 is ID returned by API for the Interfaces Menu
                    }));

                $scope.$emit("changedSelectedMenu", interfacesMenuIndex);
            }

            $scope.config = config;

            $scope.callAPI(adExactOnlineSetupSrv.fetchJournalsList, {
                successCallBack: function(journalsList) {
                    $scope.journals = journalsList;
                }
            });
            $scope.callAPI(adExactOnlineSetupSrv.fetchBalancingAccounts, {
                successCallBack: function(balancingAccounts) {
                    $scope.balancingAccounts = balancingAccounts;
                }
            });

            $scope.endPoints = endPoints;
        }());
    }]);
