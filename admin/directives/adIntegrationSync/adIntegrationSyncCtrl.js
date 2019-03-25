angular.module('admin').controller('adIntegrationSyncCtrl', ['$scope', '$rootScope', 'adInterfacesSetupSrv', 'dateFilter',
    function ($scope, $rootScope, adInterfacesCommonConfigSrv, dateFilter) {

        BaseCtrl.call(this, $scope);

        var MAX_REFRESH_SPAN_DAYS = 40,
            HISTORICAL_SYNC_LIMIT = 2, // IN YEARS
            commonDatePickerOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                changeYear: true,
                minDate: new Date(),
                changeMonth: true,
                beforeShow: function () {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function () {
                    $('#ui-datepicker-overlay').remove();
                }
            },
            diffDays = function (from, to) {
                return Math.abs((to - from) / (1000 * 3600 * 24));
            },
            getFutureDate = function (fromDate, addDays) {
                var maxDate = new tzIndependentDate(fromDate);

                return tzIndependentDate(maxDate.setDate(maxDate.getDate() + addDays));
            },
            toDateSelected = function () {
                if (!$scope.fromDate ||
                    new tzIndependentDate($scope.toDate) < new tzIndependentDate($scope.fromDate)) {
                    $scope.fromDate = $scope.toDate;
                }
                // NOTE: This function call is intentional.
                if (!$scope.syncHistoricalData) {
                    $scope.endDatePickerOptions.maxDate = getFutureDate($scope.fromDate, MAX_REFRESH_SPAN_DAYS);
                } else if ($scope.historicalDateRangeDays) {
                    // Maintain a date range of 30 days or less
                    if (diffDays($scope.fromDate, $scope.toDate) > parseInt($scope.historicalDateRangeDays)) {
                        $scope.fromDate = new Date($scope.toDate.setDate($scope.toDate.getDate() - parseInt($scope.historicalDateRangeDays)));
                    }
                }
            },
            fromDateSelected = function () {
                if (!$scope.toDate ||
                    new tzIndependentDate($scope.fromDate) > new tzIndependentDate($scope.toDate)) {
                    $scope.toDate = $scope.fromDate;
                }

                if (!$scope.syncHistoricalData) {
                    $scope.endDatePickerOptions.maxDate = getFutureDate($scope.fromDate, MAX_REFRESH_SPAN_DAYS);
                } else if ($scope.historicalDateRangeDays) {
                    // Maintain a date range of 30 days or less
                    if (diffDays($scope.fromDate, $scope.toDate) > parseInt($scope.historicalDateRangeDays)) {
                        $scope.toDate = new Date($scope.fromDate.setDate($scope.fromDate.getDate() + parseInt($scope.historicalDateRangeDays)));
                    }
                }
            },
            getSyncItems = function (full_sync_items) {
                var arr = [];

                _.each(full_sync_items, function (item) {
                    arr.push({id: item});
                });

                if (arr.length === 1) {
                    arr[0].isSelected = true;
                }

                return arr;
            };

        $scope.startSync = function () {
            var items = _.pluck(_.filter($scope.syncItems, {isSelected: true}), 'id'),
                payLoad;

            $scope.errorMessage = $scope.successMessage = '';

            if (!items.length && $scope.syncItems.length) {
                $scope.successMessage = '';
                $scope.errorMessage = ['ERROR: Please select at least one Item to Synchronize!'];
                return;
            }

            payLoad = {
                start_date: dateFilter($scope.fromDate, $rootScope.dateFormatForAPI),
                items: items
            };

            if (!$scope.isExport) {
                payLoad['end_date'] = dateFilter($scope.toDate, $rootScope.dateFormatForAPI);
            }

            if ($scope.syncHistoricalData) {
                payLoad['sync_type'] = 'historical';
            }

            $scope.callAPI(adInterfacesSetupSrv.synchronize, {
                params: {
                    payLoad: payLoad,
                    interfaceIdentifier: $scope.interface
                },
                onSuccess: function () {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Synchronization Initiated!';
                }
            });
        };

        $scope.onToggleHistoricalSync = function (adCheckbox) {
            var fromDate;

            $scope.errorMessage = $scope.successMessage = '';

            $scope.syncHistoricalData = adCheckbox;

            if (adCheckbox) {
                $scope.syncItems = getSyncItems($scope.config.historical_data_sync_items);

                $scope.toDate = new Date();
                fromDate = new Date();

                var maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - HISTORICAL_SYNC_LIMIT));

                $scope.endDatePickerOptions.minDate = maxDate;
                $scope.endDatePickerOptions.maxDate = new Date();

                $scope.startDatePickerOptions.minDate = maxDate;
                $scope.startDatePickerOptions.maxDate = new Date();

                if ($scope.excludeToday) {
                    var dateObj = new Date();

                    $scope.startDatePickerOptions.maxDate = tzIndependentDate(dateObj.setDate(dateObj.getDate() - 1));
                }

                if ($scope.historicalDateRangeDays) {
                    $scope.fromDate = new Date(fromDate.setDate(fromDate.getDate() - parseInt($scope.historicalDateRangeDays)));
                } else {
                    $scope.fromDate = maxDate;
                }

            } else {
                $scope.syncItems = getSyncItems($scope.config.real_time_data_sync_items);

                $scope.startDatePickerOptions.minDate = new Date();
                $scope.endDatePickerOptions.minDate = new Date();

                $scope.startDatePickerOptions.maxDate = null;
                $scope.fromDate = new Date();
                fromDateSelected();
            }
        };

        (function () {
            // $scope.errorMessage = $scope.successMessage = '';
            // $scope.fromDate = null;
            // $scope.toDate = null;
            //
            // // Disable toggle if either of the lists is empty!
            // $scope.disableSyncHistoricalDataToggle = !$scope.config.real_time_data_sync_items ||
            //     !$scope.config.historical_data_sync_items;
            //
            // $scope.startDatePickerOptions = Object.assign({
            //     onSelect: fromDateSelected
            // }, commonDatePickerOptions);
            // $scope.endDatePickerOptions = Object.assign({
            //     onSelect: toDateSelected
            // }, commonDatePickerOptions);
            //
            // $scope.onToggleHistoricalSync(!$scope.config.real_time_data_sync_items);

        })();
    }
]);
