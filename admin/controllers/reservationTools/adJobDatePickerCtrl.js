admin.controller('ADJobDatePicker', [
    '$scope',
    '$rootScope',
    '$filter',
    'ngDialog',
    function($scope, $rootScope, $filter, ngDialog) {
        BaseCtrl.call(this, $scope);

        // quick reference to the underlaying page $scope
        $scope.parentScope = $scope.$parent.$parent;
        $scope.dateNeeded = $scope.parentScope.dateNeeded;

        var calWeekAfter = function(today) {
            var _dateVal      = tzIndependentDate(today),
                _businessDate = $filter('date')(_dateVal, 'yyyy-MM-dd'),
                _dateParts    = _businessDate.match(/(\d+)/g),
                _year  = parseInt( _dateParts[0] ),
                _month = parseInt( _dateParts[1] ) - 1,
                _date  = parseInt( _dateParts[2] );

            return new Date(_year, _month, _date + 7);
        };

        var datePickerCommon = {
            numberOfMonths: 1,
            changeYear: true,
            changeMonth: true,
            minDate: tzIndependentDate($rootScope.businessDate),
            onSelect: function(dateText, inst) {
                // emit choosen date back
                $scope.$emit('datepicker.update', $scope.datePickerDate);
                ngDialog.close();
            }
        };

        var startDate = $scope.parentScope.payload.begin_date || $rootScope.businessDate,
            weekAfter = $filter('date')(calWeekAfter(startDate), 'yyyy-MM-dd');

        // link everthing
        if ( $scope.parentScope.dateNeeded === 'from' ) {
            $scope.datePickerDate = $scope.parentScope.payload.begin_date || $rootScope.businessDate;
            $scope.dateOptions = angular.extend({}, datePickerCommon);
        } else {
            $scope.datePickerDate = $scope.parentScope.payload.end_date || weekAfter;
            $scope.dateOptions = angular.extend({
                maxDate: tzIndependentDate(weekAfter),
            }, datePickerCommon);
        };

        $scope.cancelClicked = function() {
            ngDialog.close();
        };
    }
]);