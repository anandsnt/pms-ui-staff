sntRover.controller('RVJournalDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

    var minDateSelected = '';
    if($scope.clickedOn === 'FROM'){
        $scope.date = $scope.data.fromDate;
    }
    else if($scope.clickedOn === 'TO'){
        $scope.date = $scope.data.toDate;
        minDateSelected = tzIndependentDate($scope.data.fromDate);
    }
    else if($scope.clickedOn === 'CASHIER'){
        $scope.date = $scope.data.cashierDate;
    }
    else if($scope.clickedOn === 'TRANSACTIONS'){
        $scope.date =  $scope.data.transactionDate;
    }

    $scope.setUpData = function(){
        $scope.dateOptions = {
           changeYear: true,
           changeMonth: true,
           minDate: minDateSelected,
           maxDate: tzIndependentDate($rootScope.businessDate),
           yearRange: "-100:+0",
           onSelect: function(dateText, inst) {
                if($scope.clickedOn === 'FROM'){
                  $scope.data.fromDate = $scope.date;
                  $scope.data.toDate = $scope.date;
                  $rootScope.$emit('fromDateChanged');
                }
                else if($scope.clickedOn === 'TO'){
                  $scope.data.toDate = $scope.date;
                  $rootScope.$emit('toDateChanged');
                }
                else if($scope.clickedOn === 'CASHIER'){
                  $scope.data.cashierDate = $scope.date;
                  $scope.$emit('cashierDateChanged');
                }
                else if($scope.clickedOn === 'TRANSACTIONS'){
                  $scope.data.transactionDate = $scope.date;
                  $rootScope.$emit('transactionDateChanged');
                }
                ngDialog.close();
            }
        };
    };

    $scope.setUpData();

}]);