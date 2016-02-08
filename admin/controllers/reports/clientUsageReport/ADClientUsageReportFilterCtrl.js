admin.controller('ADClientUsageReportFilterCtrl', ['$scope', '$rootScope', '$filter', 'adReportsSrv', 'adReportsSortOptionsSrv',
    function($scope, $rootScope, $filter, adReportsSrv, adReportsSortOptionsSrv) {
        BaseCtrl.call(this, $scope);

        var initDay = $filter('date')(new Date(), $rootScope.mmddyyyyFormat);

        // common date picker options object
        var commonDateOptions = {
                dateFormat: getJqDateFormat(),
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function(input, inst) {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(value) {
                    $('#ui-datepicker-overlay').remove();
                }
            },
            init = function() {
                var onGetFilterSuccess = function(filters) {
                        $scope.$emit('hideLoader');
                        $scope.filterState.filters = filters;
                    },
                    onGetSortOptionsSuccess = function(sortOptions) {
                        $scope.filterState.sortOptions = sortOptions;
                        $scope.$emit('hideLoader');
                    };
                // Get Filters and Sort Options for this report
                // NOTE: $scope.reportKey is initiated in the partial so that it is availble in the respective controllers
                $scope.invokeApi(adReportsSrv.getFilterData, $scope.reportKey, onGetFilterSuccess);
                $scope.invokeApi(adReportsSortOptionsSrv.getSortOptions, $scope.reportKey, onGetSortOptionsSuccess);
            };

        $scope.filterState = {
            fromDate: initDay,
            toDate: initDay,
            fromDateOptions: angular.extend({
                maxDate: initDay,
                onSelect: function(value) {
                    $scope.filterState.toDateOptions.minDate = value;
                }
            }, commonDateOptions),
            toDateOptions: angular.extend({
                maxDate: initDay,
                onSelect: function(value) {
                    $scope.filterState.fromDateOptions.maxDate = value;
                }
            }, commonDateOptions)
        }


        init();
    }
]);