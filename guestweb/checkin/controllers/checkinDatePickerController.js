 function checkinDatePickerController($scope, dateFilter) {
        $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
        $scope.minDate = '2014-03-04';
        $scope.maxDate = '2014-10-06';
 }


