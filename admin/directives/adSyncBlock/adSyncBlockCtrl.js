angular.module('admin').controller('adSyncBlockCtrl', ['$scope', '$rootScope', 'adInterfacesCommonConfigSrv', 'dateFilter',
    function($scope, $rootScope, adInterfacesCommonConfigSrv, dateFilter) {

        BaseCtrl.call(this, $scope);

        var MAX_REFRESH_SPAN_DAYS = 40,
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
                if (!$scope.fromDate ||
                    new tzIndependentDate($scope.toDate) < new tzIndependentDate($scope.fromDate)) {
                    $scope.fromDate = $scope.toDate;
                }
                // NOTE: This function call is intentional.
                $scope.endDatePickerOptions.maxDate = getFutureDate($scope.fromDate, MAX_REFRESH_SPAN_DAYS);
            }, fromDateSelected = function() {
                if (!$scope.toDate ||
                    new tzIndependentDate($scope.fromDate) > new tzIndependentDate($scope.toDate)) {
                    $scope.toDate = $scope.fromDate;
                }
                $scope.endDatePickerOptions.maxDate = getFutureDate($scope.fromDate, MAX_REFRESH_SPAN_DAYS);
            }, getSyncItems = function(full_sync_items) {
                var arr = [];

                _.each(full_sync_items, function(item) {
                    arr.push({id: item});
                });
                return arr;
            };

        $scope.fromDate = null;
        $scope.toDate = null;
        $scope.syncItems = getSyncItems($scope.syncItemsList);


        $scope.startSync = function() {
            var items = _.pluck(_.filter($scope.syncItems, {isSelected: true}), 'id'),
                payLoad;

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


        $scope.startDatePickerOptions = Object.assign({
            onSelect: fromDateSelected
        }, commonDatePickerOptions);
        $scope.endDatePickerOptions = Object.assign({
            onSelect: toDateSelected
        }, commonDatePickerOptions);

        $scope.errorMessage = $scope.successMessage = "";
    }
]);