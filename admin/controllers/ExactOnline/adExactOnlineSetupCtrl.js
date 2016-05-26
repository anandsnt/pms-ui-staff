admin.controller('adExactOnlineSetupCtrl', ['$scope', '$rootScope', 'exactOnlineSetupValues', 'adExactOnlineSetupSrv', 'dateFilter',
    function ($scope, $rootScope, exactOnlineSetupValues, adExactOnlineSetupSrv, dateFilter) {

        BaseCtrl.call(this, $scope);

        $scope.exportOptions = {
            date: $rootScope.businessDate
        };

        $scope.datePickerOptions = {
            dateFormat: getJqDateFormat(),
            numberOfMonths: 1,
            maxDate: new tzIndependentDate($rootScope.businessDate),
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
            var params = {};

            if (!$scope.exactOnlineSetup.active) {
                params = _.pick($scope.exactOnlineSetup, 'active');
            } else {
                params = _.extendOwn({}, $scope.exactOnlineSetup);
            }

            var options = {
                params: {
                    data: {
                        "product_cross_customer": params
                    },
                    interface: "EXACTONLINE"
                },
                successCallBack: successCallBackOfExactOnlineSetup
            };
            $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
        };

        $scope.runExport = function () {
            console.log(dateFilter($scope.exportOptions.date, $rootScope.dateFormatForAPI));
            var params = {};

            if (!$scope.exactOnlineSetup.active) {
                params = _.pick($scope.exactOnlineSetup, 'active');
            } else {
                params = _.extendOwn({}, $scope.exactOnlineSetup);
            }

            var options = {
                params: {
                    data: {
                        "product_cross_customer": params
                    },
                    interface: "EXACTONLINE"
                },
                successCallBack: function(){

                }
            };
            $scope.callAPI(adExactOnlineSetupSrv.runExactOnlineExport, options);
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        var initializeMe = function () {
            $scope.exactOnlineSetup = exactOnlineSetupValues.data.product_cross_customer;
            $scope.exactOnlineSetup.is_oauth_authorized = true;
        }();
    }]);