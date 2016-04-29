admin.controller('adWindsurferCRSSetupCtrl', ['$scope', 'windsurferCRSSetupValues', 'adWindsurferCRSSetupSrv', '$timeout',
    function($scope, windsurferCRSSetupValues, adWindsurferCRSSetupSrv, $timeout) {

        BaseCtrl.call(this, $scope);

        var datepickerDefaults = {
            minDate: tzIndependentDate($rootScope.businessDate),
            maxDate: tzIndependentDate($rootScope.businessDate),
            changeYear: true,
            changeMonth: true,
            yearRange: "0:+5"
        }

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefiend}
         */
        $scope.toggleWindsurferCRSEnabled = function() {
            $scope.windsurferSetup.enabled = !$scope.windsurferSetup.enabled;
        };

        /**
         * when the save is success
         * @return {undefien
         */
        var successCallBackOfWindsurferCRSSetup = function(data) {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefiend}
         */
        $scope.saveWindsurferCRSSetup = function() {
            var params = {};

            if (!$scope.windsurferSetup.active) {
                params = _.pick($scope.windsurferSetup, 'active');
            } else {
                params = _.extendOwn({}, $scope.windsurferSetup);
            }

            var options = {
                params: params,
                successCallBack: successCallBackOfWindsurferCRSSetup
            };
            $scope.callAPI(adWindsurferCRSSetupSrv.saveWindsurferCRSConfiguration, options);
        };

        /**
         * Initialization stuffs
         * @return {undefiend}
         */
        var initializeMe = function() {
            $scope.windsurferSetup = windsurferCRSSetupValues;

            $scope.fromDateOptions = _.extend(datePickerDefaults, {
                onSelect: function() {
                    if (tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)) {
                        $scope.toDate = $scope.fromDate;
                    }
                }
            });

            $scope.toDateOptions = _.extend(datePickerDefaults, {
                onSelect: function() {
                    if (tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)) {
                        $scope.fromDate = $scope.toDate;
                    }
                }
            });
        }();
    }
]);