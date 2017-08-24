sntRover.controller('RVArTransactionsDatePickerController', ['$scope', '$rootScope', 'ngDialog', 'dateFilter', function($scope, $rootScope, ngDialog, dateFilter) {

    if ($scope.clickedOn === 'FROM') {
        $scope.date = $scope.filterData.from_date ? tzIndependentDate($scope.filterData.from_date) : tzIndependentDate($rootScope.businessDate);
    }
    else if ($scope.clickedOn === 'TO') {
        $scope.date = $scope.filterData.to_date ? tzIndependentDate($scope.filterData.to_date) : tzIndependentDate($rootScope.businessDate) ;
    }

    $scope.setUpData = function() {
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: "-5:+5", // Show 5 years in past & 5 years in future
            onSelect: function(dateText, inst) {
                if ($scope.clickedOn === 'FROM') {
                    $scope.filterData.from_date = $scope.date;
                    $scope.$emit('fromDateChanged');
                }
                else if ($scope.clickedOn === 'TO') {
                    $scope.filterData.to_date = $scope.date;
                    $scope.$emit('toDateChanged');
                }
                ngDialog.close();
            }
        };
    };

    $scope.setUpData();

}]);