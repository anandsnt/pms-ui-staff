angular.module('admin').controller('adSyncBlockCtrl', ['$scope', '$rootScope', 'adInterfacesCommonConfigSrv', 'dateFilter',
    function($scope, $rootScope, adInterfacesCommonConfigSrv, dateFilter) {

        BaseCtrl.call(this, $scope);

        var MAX_REFRESH_SPAN_DAYS = 40,
            HISTORICAL_SYNC_LIMIT = 3, // IN YEARS
            commonDatePickerOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                changeYear: true,
                minDate: new Date(),
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
                if (!$scope.fromDate ||
                    new tzIndependentDate($scope.toDate) < new tzIndependentDate($scope.fromDate)) {
                    $scope.fromDate = $scope.toDate;
                }
                // NOTE: This function call is intentional.
                $scope.endDatePickerOptions.maxDate = getFutureDate($scope.fromDate, MAX_REFRESH_SPAN_DAYS);
            },
            fromDateSelected = function() {
                if (!$scope.toDate ||
                    new tzIndependentDate($scope.fromDate) > new tzIndependentDate($scope.toDate)) {
                    $scope.toDate = $scope.fromDate;
                }
                $scope.endDatePickerOptions.maxDate = getFutureDate($scope.fromDate, MAX_REFRESH_SPAN_DAYS);
            },
            getSyncItems = function(full_sync_items) {
                var arr = [];

                _.each(full_sync_items, function(item) {
                    arr.push({id: item});
                });

                if (arr.length === 1) {
                    arr[0].isSelected = true;
                }

                return arr;
            };

        $scope.startSync = function() {
            var items = _.pluck(_.filter($scope.syncItems, {isSelected: true}), 'id'),
                payLoad;

            $scope.errorMessage = $scope.successMessage = "";

            if (!items.length) {
                $scope.successMessage = '';
                $scope.errorMessage = ['ERROR: Please select at least one Item to Synchronize!'];
                return;
            }

            payLoad = {
                start_date: dateFilter($scope.fromDate, $rootScope.dateFormatForAPI),
                end_date: dateFilter($scope.toDate, $rootScope.dateFormatForAPI),
                items: items
            };

            if ($scope.syncHistoricalData) {
                payLoad["sync_type"] = "historical";
            }

            $scope.callAPI(adInterfacesCommonConfigSrv.initSync, {
                params: {
                    payLoad: payLoad,
                    interfaceIdentifier: $scope.interface
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Synchronization Initiated!';
                }
            });
        };

        $scope.onToggleHistoricalSync = function(adCheckbox) {
            var fromDate;

            $scope.errorMessage = $scope.successMessage = "";
            $scope.syncHistoricalData = adCheckbox;

            if (adCheckbox) {
                $scope.syncItems = getSyncItems($scope.config.historical_data_sync_items);

                $scope.toDate = new Date();
                fromDate = new Date();
                $scope.fromDate = new Date(fromDate.setFullYear(fromDate.getFullYear() - HISTORICAL_SYNC_LIMIT));

                $scope.endDatePickerOptions.minDate = $scope.fromDate;
                $scope.endDatePickerOptions.maxDate = new Date();

                $scope.startDatePickerOptions.minDate = $scope.fromDate;
                $scope.startDatePickerOptions.maxDate = new Date();

            } else {
                $scope.syncItems = getSyncItems($scope.config.real_time_data_sync_items);

                $scope.startDatePickerOptions.minDate = new Date();
                $scope.endDatePickerOptions.minDate = new Date();

                $scope.startDatePickerOptions.maxDate = null;
                $scope.fromDate = new Date();
                fromDateSelected();
            }
        };

        (function(){
            $scope.errorMessage = $scope.successMessage = "";
            $scope.syncHistoricalData = false;
            $scope.fromDate = null;
            $scope.toDate = null;
            $scope.syncItems = getSyncItems($scope.config.real_time_data_sync_items);

            $scope.startDatePickerOptions = Object.assign({
                onSelect: fromDateSelected
            }, commonDatePickerOptions);
            $scope.endDatePickerOptions = Object.assign({
                onSelect: toDateSelected
            }, commonDatePickerOptions);
        })();
    }
]);