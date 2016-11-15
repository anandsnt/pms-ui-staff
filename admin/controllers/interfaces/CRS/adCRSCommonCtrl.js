angular.module('admin').controller('adCRSCommonCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', '$stateParams',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams) {

        var interfaceIdentifier = $stateParams.id,
            MAX_REFRESH_SPAN_DAYS = 40,
            commonDatePickerOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function() {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function() {
                    $('#ui-datepicker-overlay').remove();
                }
            },
            getFutureDate = function(fromDate, addDays) {
                var maxDate = new tzIndependentDate(fromDate);

                return tzIndependentDate(maxDate.setDate(maxDate.getDate() + addDays));
            },
            toDateSelected = function() {
                if (!$scope.sync.start_date ||
                    new tzIndependentDate($scope.sync.end_date) < new tzIndependentDate($scope.sync.start_date)) {
                    $scope.sync.start_date = $scope.sync.end_date;
                }
                // NOTE: This function call is intentional.
                $scope.endDatePickerOptions.maxDate = getFutureDate($scope.sync.start_date, MAX_REFRESH_SPAN_DAYS);
            }, fromDateSelected = function() {
                if (!$scope.sync.end_date ||
                    new tzIndependentDate($scope.sync.start_date) > new tzIndependentDate($scope.sync.end_date)) {
                    $scope.sync.end_date = $scope.sync.start_date;
                }
                $scope.endDatePickerOptions.maxDate = getFutureDate($scope.sync.start_date, MAX_REFRESH_SPAN_DAYS);
            };

        $scope.sync = {
            start_date: null,
            end_date: null,
            items: ['group', 'inventory', 'rate', 'reservation', 'restriction']
        };

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveInterfaceConfig = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        $scope.startSync = function() {
            var payLoad = {
                start_date: dateFilter($scope.sync.start_date, $rootScope.dateFormatForAPI),
                end_date: dateFilter($scope.sync.end_date, $rootScope.dateFormatForAPI),
                items: $scope.sync.items
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.initSync, {
                params: {
                    payLoad: payLoad,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.successMessage = 'SUCCESS: Synchronization Initiated!';
                }
            });
        };

        (function() {
            //    init
            var onFetchMetaSuccess = function(response) {
                $scope.rates = response.rates;
                $scope.bookingOrigins = response.bookingOrigins;
                $scope.paymentMethods = response.paymentMethods;
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.fetchOptionsList, {
                onSuccess: onFetchMetaSuccess
            });

            $scope.config = config;
            $scope.availableSettings = _.keys(config);
            $scope.interface = interfaceIdentifier.toUpperCase();

            $scope.startDatePickerOptions = Object.assign({
                onSelect: fromDateSelected
            }, commonDatePickerOptions);
            $scope.endDatePickerOptions = Object.assign({
                onSelect: toDateSelected
            }, commonDatePickerOptions);
        })();
    }
]);