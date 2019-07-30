admin.controller('adExactOnlineSetupCtrl', ['$scope', '$rootScope', 'adExactOnlineSetupSrv', 'dateFilter', 'endPoints', 'config', 'adInterfacesSrv',
    function($scope, $rootScope, adExactOnlineSetupSrv, dateFilter, endPoints, config, adInterfacesSrv) {

        BaseCtrl.call(this, $scope);
        console.log("config from router", config)

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
            // var options = {
            //     params: {
            //         enabled: $scope.exactOnlineSetup.enabled,
            //         journal_code: $scope.exactOnlineSetup.journal_code,
            //         balancing_account_code: $scope.exactOnlineSetup.balancing_account_code,
            //         endpoint: $scope.exactOnlineSetup.endpoint
            //     },
            //     successCallBack: successCallBackOfExactOnlineSetup
            // };

            // $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
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
            // change to $scope.config to update settings in IFC
            // var options = {
            //     params: {
            //         enabled: $scope.exactOnlineSetup.enabled,
            //         authorized: false,
            //         journal_code: $scope.exactOnlineSetup.journal_code,
            //         balancing_account_code: $scope.exactOnlineSetup.balancing_account_code,
            //         endpoint: $scope.exactOnlineSetup.endpoint
            //     },
            //     successCallBack: function(exactOnlineSetupValues) {
            //         $scope.exactOnlineSetup = exactOnlineSetupValues;
            //     }
            // };

            // $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
            console.log("currently under MIGRATION")
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

            $scope.callAPI(adExactOnlineSetupSrv.indexWithParams, {
                params: $scope.config,
                successCallBack: function(values) {
                    //save values to $scope? how were the extra config/auth values handled before??
                    console.log("done", values)
                }
            });

            $scope.endPoints = endPoints;
            console.log("iife, scope: ", $scope)
        }());
    }]);
