sntRover.controller('RVJournalDatePickerController', ['$scope', '$rootScope', 'ngDialog', 'dateFilter', function($scope, $rootScope, ngDialog, dateFilter) {

    var minDateSelected = '',
        maxDateSelected = tzIndependentDate($rootScope.businessDate),
        YEAR_LIMIT = 5;

    if ($scope.clickedOn === 'FROM') {
        $scope.date = $scope.data.fromDate;
        minDateSelected = moment(tzIndependentDate($scope.data.toDate)).add((-1 * YEAR_LIMIT), 'y')
              .format($rootScope.momentFormatForAPI);
    }
    else if ($scope.clickedOn === 'TO') {
        $scope.date = $scope.data.toDate;
        minDateSelected = tzIndependentDate($scope.data.fromDate);
        // Max date selection logic..
        var businessDateObj = tzIndependentDate($rootScope.businessDate),
            fromDatePlusFiveYears = moment(tzIndependentDate($scope.data.fromDate)).add(YEAR_LIMIT, 'y');

        if ( businessDateObj < fromDatePlusFiveYears ) {
            maxDateSelected = businessDateObj;
        }
        else {
            maxDateSelected = moment(tzIndependentDate($scope.data.fromDate)).add(YEAR_LIMIT, 'y')
              .format($rootScope.momentFormatForAPI);
        }
    }
    else if ($scope.clickedOn === 'CASHIER') {
        $scope.date = $scope.data.cashierDate;
    }
    else if ($scope.clickedOn === 'TRANSACTIONS') {
        $scope.date =  $scope.data.transactionDate;
    }
    else if ($scope.clickedOn === 'SUMMARY') {
        $scope.date =  $scope.data.summaryDate;
    }

    $scope.setUpData = function() {
        $scope.dateOptions = {
           changeYear: true,
           changeMonth: true,
           minDate: tzIndependentDate(minDateSelected),
           maxDate: tzIndependentDate(maxDateSelected),
           yearRange: "-100:+0",
           onSelect: function(dateText, inst) {
                if ($scope.clickedOn === 'FROM') {
                  $scope.data.fromDate = $scope.date;
                  $scope.data.toDate = $scope.date;
                  $rootScope.$emit('fromDateChanged');
                }
                else if ($scope.clickedOn === 'TO') {
                  $scope.data.toDate = $scope.date;
                  $rootScope.$emit('toDateChanged');
                }
                else if ($scope.clickedOn === 'CASHIER') {
                  $scope.data.cashierDate = $scope.date;
                  $scope.$emit('cashierDateChanged');
                }
                else if ($scope.clickedOn === 'TRANSACTIONS') {
                  $scope.data.transactionDate = $scope.date;
                  $rootScope.$emit('transactionDateChanged');
                }
                else if ($scope.clickedOn === 'SUMMARY') {
                  $scope.data.summaryDate = $scope.date;
                  $rootScope.$emit('summaryDateChanged');
                }
                ngDialog.close();
            }
        };
    };

    $scope.setUpData();

}]);