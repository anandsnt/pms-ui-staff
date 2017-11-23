admin.controller('ADJobDatePickerBalanceJournalController', [
    '$scope',
    '$rootScope',
    '$filter',
    'ngDialog',
    function($scope, $rootScope, $filter, ngDialog) {
        BaseCtrl.call(this, $scope);

        // quick reference to the underlaying page $scope
        $scope.parentScope = $scope.$parent;
        $scope.dateNeeded = $scope.parentScope.dateNeeded;

        /*
         * Common params
         */
        var datePickerCommon = {
            numberOfMonths: 1,
            changeYear: true,
            changeMonth: true,
            maxDate: tzIndependentDate($scope.previousDayOfBusinessDateInDbFormat),
            onSelect: function(dateText, inst) {
                // emit choosen date back
                $scope.$emit('datepicker.update', $scope.datePickerDate);
                ngDialog.close();
            }
        };

        var startDate = $scope.parentScope.payload.begin_date || $rootScope.businessDate;

        // link everthing
        if ( $scope.parentScope.dateNeeded === 'from' ) {
            $scope.datePickerDate = $scope.parentScope.payload.begin_date || $rootScope.businessDate;
            $scope.dateOptions = angular.extend({}, datePickerCommon);
        } else {
            $scope.datePickerDate = $scope.parentScope.payload.end_date || weekAfter;
            $scope.dateOptions = angular.extend({
                maxDate: tzIndependentDate(weekAfter)
            }, datePickerCommon);
        }
        /*
         * Cancel click
         */
        $scope.cancelClicked = function() {
            ngDialog.close();
        };
    }
]);