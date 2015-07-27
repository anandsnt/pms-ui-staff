sntRover.controller('RVArTransactionsDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

    if($scope.clickedOn === 'FROM'){
        $scope.date = $scope.filterData.fromDate;
    }
    else if($scope.clickedOn === 'TO'){
        $scope.date = $scope.filterData.toDate;
    }

    $scope.setUpData = function(){
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: "+0:+5",
            onSelect: function(dateText, inst) {
                if($scope.clickedOn === 'FROM'){
                    $scope.filterData.fromDate = $scope.date;
                    $scope.$emit('fromDateChanged');
                }
                else if($scope.clickedOn === 'TO'){
                    $scope.filterData.toDate = $scope.date;
                    $scope.$emit('toDateChanged');
                }
                ngDialog.close();
            }
        }
    };

    $scope.setUpData();

}]);