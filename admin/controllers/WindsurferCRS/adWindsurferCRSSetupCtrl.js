admin.controller('adWindsurferCRSSetupCtrl', ['$scope', '$rootScope', 'windsurferCRSSetupValues', 'adWindsurferCRSSetupSrv', '$timeout', 'dateFilter', 'ngDialog', 'adExternalInterfaceCommonSrv', '$interval',
    function($scope, $rootScope, windsurferCRSSetupValues, adWindsurferCRSSetupSrv, $timeout, dateFilter, ngDialog, adExternalInterfaceCommonSrv, $interval) {

        BaseCtrl.call(this, $scope);

        var timer,
            MAX_REFRESH_SPAN_DAYS = 40,
            maxDate = new tzIndependentDate($rootScope.businessDate),
            datepickerDefaults = {
                dateFormat: getJqDateFormat(),
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function(input, inst) {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(value) {
                    $('#ui-datepicker-overlay').remove();
                },
                minDate: tzIndependentDate($rootScope.businessDate),
                yearRange: "0:+5"
            },
            initTimeCopy = function() {
                if ($scope.windsurferSetup.full_refresh) {
                    timer = $interval(function() {
                        var refreshDateObj = new Date($scope.windsurferSetup.full_refresh);
                        $scope.lastRefreshedTimeMark = timeSince(refreshDateObj.valueOf());
                    }, 1000);
                }
            }, //Method copied from adExternalInterfaceCtrl.js
            timeSince = function(date) {
                var seconds = Math.floor((new Date() - date) / 1000); //local to the user

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " years";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " months";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes";
                }
                return Math.floor(seconds) + " seconds";
            };

        $scope.lastRefreshedTimeMark = "";

        $scope.datepicker = {
            from: new tzIndependentDate($rootScope.businessDate),
            to: maxDate,
            settings: {
                from: angular.extend({
                        onSelect: function(selection) {
                            if (new tzIndependentDate($scope.datepicker.from) > new tzIndependentDate($scope.datepicker.to)) {
                                $scope.datepicker.to = $scope.datepicker.from;
                            }
                            var currFromDate = new tzIndependentDate($scope.datepicker.from);
                            $scope.datepicker.settings.to.maxDate = new Date(currFromDate.setDate(currFromDate.getDate() + MAX_REFRESH_SPAN_DAYS));
                        }
                    },
                    datepickerDefaults),
                to: angular.extend({
                    maxDate: new Date(maxDate.setDate(maxDate.getDate() + MAX_REFRESH_SPAN_DAYS)),
                    onSelect: function(selection) {
                        if (new tzIndependentDate($scope.datepicker.from) > new tzIndependentDate($scope.datepicker.to)) {
                            $scope.datepicker.from = $scope.datepicker.to;
                        }
                    }
                }, datepickerDefaults)
            }
        };

        $scope.onCancel = function() {
            ngDialog.close();
        };

        $scope.onRefresh = function() {
            $scope.callAPI(adWindsurferCRSSetupSrv.runFullRefresh, {
                params: {
                    start_date: dateFilter($scope.datepicker.from, $rootScope.dateFormatForAPI),
                    end_date: dateFilter($scope.datepicker.to, $rootScope.dateFormatForAPI)
                },
                onSuccess: function(response) {
                    $scope.successMessage = 'Windsurfer Full Refresh Success!';
                    $scope.windsurferSetup.full_refresh = new Date();
                    initTimeCopy();
                    ngDialog.close();
                }
            });
        };

        $scope.showRefreshDialog = function() {
            ngDialog.open({
                template: '/assets/partials/interfaces/modals/adInterfacesRefreshDateRangePicker.html',
                scope: $scope
            });
        };

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
                params["payment_id"] = params.default_payment_id;
                params["origin_id"] = params.default_origin;
                params["rate_id"] = params.default_rate;
            }

            var options = {
                params: _.omit(params, ["default_payment_id", "default_origin", "default_rate"]),
                successCallBack: successCallBackOfWindsurferCRSSetup
            };
            $scope.callAPI(adWindsurferCRSSetupSrv.saveWindsurferCRSConfiguration, options);
        };

        /**
         * Initialization stuffs
         * @return {undefiend}
         */
        var initializeMe = function() {
            var onfetchMetaSuccess = function(response) {
                $scope.channelManagerRates = _.pluck(response.rates, 'rate');
                $scope.bookingOrigins = response.bookingOrigins;
                $scope.paymentMethods = response.paymentMethods;
                $scope.windsurferSetup = windsurferCRSSetupValues;
                initTimeCopy();
            }

            $scope.callAPI(adExternalInterfaceCommonSrv.fetchMetaData, {
                params: {
                    interface_id: windsurferCRSSetupValues.interface_id
                },
                onSuccess: onfetchMetaSuccess
            });
        }();


        $scope.$on('$destroy', function(){
            $interval.cancel(timer);
        });
    }
]);