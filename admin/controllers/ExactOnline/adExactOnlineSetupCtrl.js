admin.controller('adExactOnlineSetupCtrl', ['$scope', '$rootScope', 'exactOnlineSetupValues', 'adExactOnlineSetupSrv', 'dateFilter', 'endPoints', '$window',
    function($scope, $rootScope, exactOnlineSetupValues, adExactOnlineSetupSrv, dateFilter, endPoints, $window) {

        BaseCtrl.call(this, $scope);

        $scope.exportOptions = {
            date: new tzIndependentDate($rootScope.businessDate).addDays(-1)
        };

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
            var options = {
                params: {
                    enabled: $scope.exactOnlineSetup.enabled,
                    journal_code: $scope.exactOnlineSetup.journal_code,
                    balancing_account_code: $scope.exactOnlineSetup.balancing_account_code,
                    endpoint: $scope.exactOnlineSetup.endpoint
                },
                successCallBack: successCallBackOfExactOnlineSetup
            };

            $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
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
            var options = {
                params: {
                    enabled: $scope.exactOnlineSetup.enabled,
                    authorized: false,
                    journal_code: $scope.exactOnlineSetup.journal_code,
                    balancing_account_code: $scope.exactOnlineSetup.balancing_account_code,
                    endpoint: $scope.exactOnlineSetup.endpoint
                },
                successCallBack: function(exactOnlineSetupValues) {
                    $scope.exactOnlineSetup = exactOnlineSetupValues;
                }
            };

            $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
        };

        $scope.authorize = function (url) {
            var jwt = $window.localStorage.getItem('jwt'),
                urlObj = new URL(url);

            if (jwt) {
                // Remove redirect_uri in case already present! Admin app handles redirection after OAuth
                urlObj.searchParams.delete('redirect_uri');
                // Set redirect_uri to point back to Admin application
                urlObj.searchParams.set('redirect_uri', location.href + '?state=admin-exactOnlineSetup');
                $window.location.href = urlObj.href;
            }
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

            $scope.exactOnlineSetup = exactOnlineSetupValues;

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
