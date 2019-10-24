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
            onSelect: function() {
                // emit choosen date back
                $scope.$emit('datepicker.update', $scope.datePickerDate);
                ngDialog.close();
            }
        };

        // link everthing
        if ( $scope.parentScope.dateNeeded === 'from' ) {
            $scope.dateOptions = angular.extend({}, datePickerCommon);
        } 
        /*
         * Cancel click
         */
        $scope.cancelClicked = function() {
            ngDialog.close();
        };
    }
]);