admin.controller('adExactOnlineSetupCtrl', ['$scope', '$rootScope', 'exactOnlineSetupValues', 'adExactOnlineSetupSrv', 'dateFilter', 'journalsList', 'balancingAccounts',
    function ($scope, $rootScope, exactOnlineSetupValues, adExactOnlineSetupSrv, dateFilter, journalsList, balancingAccounts) {

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
            beforeShow: function (input, inst) {
                $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
            },
            onClose: function (value) {
                $('#ui-datepicker-overlay').remove();
            }
        };

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefined}
         */
        $scope.toggleExactOnlineEnabled = function () {
            $scope.exactOnlineSetup.enabled = !$scope.exactOnlineSetup.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfExactOnlineSetup = function (data) {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveExactOnlineSetup = function () {
            var options = {
                params: {
                    enabled: $scope.exactOnlineSetup.enabled,
                    journal_code: $scope.exactOnlineSetup.journal_code,
                    balancing_account_code : $scope.exactOnlineSetup.balancing_account_code
                },
                successCallBack: successCallBackOfExactOnlineSetup
            };
            $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
        };

        $scope.runExport = function () {
            var options = {
                params: {
                    data: {
                        "date": dateFilter($scope.exportOptions.date, $rootScope.dateFormatForAPI)
                    }
                },
                successCallBack: function () {
                    $scope.successMessage = 'Exact Online Export Started!';
                }
            };
            $scope.callAPI(adExactOnlineSetupSrv.runExactOnlineExport, options);
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        var initializeMe = function() {
            /**
             * CICO-33067
             * After exactonline authorization, the application would be redirected to
             * the exactonline settings page directly. In such a case, the previousState wont be set,
             * also the selectedMenu wont be set.
             */
            if(!$rootScope.previousState) {
                $rootScope.previousState = "admin.backOfficeSetup";
                var interfacesMenuIndex = _.indexOf($scope.data.menus,
                    _.findWhere($scope.data.menus, {
                        menu_id: 9, // 9 is ID returned by API for the Interfaces Menu
                    }));
                $scope.$emit("changedSelectedMenu", interfacesMenuIndex);
            }

            $scope.exactOnlineSetup = exactOnlineSetupValues;
            $scope.journals = journalsList;
            $scope.balancingAccounts = balancingAccounts;
        }();
    }]);
