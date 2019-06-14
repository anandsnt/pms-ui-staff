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

        $scope.datePickerOptions = {
            dateFormat: $rootScope.jqDateFormat,
            numberOfMonths: 1,
            maxDate: $scope.exportOptions.date,
            changeYear: true,
            changeMonth: true,
            beforeShow: function() {
                $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
            },
            onClose: function() {
                $('#ui-datepicker-overlay').remove();
            }
        };

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefined}
         */
        $scope.toggleExactOnlineEnabled = function() {
            $scope.exactOnlineSetup.enabled = !$scope.exactOnlineSetup.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfExactOnlineSetup = function() {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveExactOnlineSetup = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    integration: $scope.integration.toLowerCase(),
                    settings: {
                        enabled: $scope.config.enabled,
                        journal_code: $scope.config.journal_code,
                        balancing_account_code: $scope.config.balancing_account_code,
                        endpoint: $scope.config.endpoint
                    }
                },
                onSuccess: function () {
                    $scope.errorMessage = '';
                    $scope.successMessage = "SUCCESS: Settings Updated!";
                }
            })
        };

        $scope.runExport = function() {
            var options = {
                params: {
                    data: {
                        "date": dateFilter($scope.exportOptions.date, $rootScope.dateFormatForAPI)
                    }
                },
                successCallBack: function() {
                    $scope.successMessage = 'Exact Online Export Started!';
                }
            };

            $scope.callAPI(adExactOnlineSetupSrv.runExactOnlineExport, options);
        };

        $scope.onURLChange = function() {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: {
                        enabled: $scope.config.enabled,
                        authorized: false,
                        journal_code: $scope.config.journal_code,
                        balancing_account_code: $scope.config.balancing_account_code,
                        endpoint: $scope.config.endpoint
                    }
                },
                onSuccess: function () {
                    $scope.errorMessage = '';
                    $scope.successMessage = "SUCCESS: Endpoint Updated!";
                }
            })
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
