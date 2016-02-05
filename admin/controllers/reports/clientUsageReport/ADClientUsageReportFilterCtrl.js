admin.controller('ADClientUsageReportFilterCtrl', ['$scope', '$rootScope', '$filter',
    function($scope, $rootScope, $filter) {
        BaseCtrl.call(this, $scope);

        // common date picker options object
        var datePickerCommon = {
            dateFormat: getJqDateFormat(),
            numberOfMonths: 1,
            changeYear: true,
            changeMonth: true,
            beforeShow: function(input, inst) {
                $('#ui-datepicker-div');
                $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
            },
            onClose: function(value) {
                $('#ui-datepicker-div');
                $('#ui-datepicker-overlay').remove();
            }
        };

        $scope.filterState = {
            pmsTypes: [{
                key: 'STANDALONE',
                desc: 'STANDALONE',
                isSelected: false
            }, {
                key: 'OVERLAY',
                desc: 'OVERLAY',
                isSelected: true
            }],
            fromDate: $filter('date')(new Date(), $rootScope.mmddyyyyFormat),
            toDate: $filter('date')(new Date(), $rootScope.mmddyyyyFormat),
            fromDateOptions: angular.extend({
                maxDate: $filter('date')(new Date(), $rootScope.mmddyyyyFormat),
                onSelect: function(value) {
                    $scope.filterState.toDateOptions.minDate = value;
                }
            }, datePickerCommon),
            toDateOptions: angular.extend({
                maxDate: $filter('date')(new Date(), $rootScope.mmddyyyyFormat),
                onSelect: function(value) {
                    $scope.filterState.fromDateOptions.maxDate = value;
                }
            }, datePickerCommon)

        }

        var initialize = function() {

        };

        // Init Controller
        initialize();
    }
]);