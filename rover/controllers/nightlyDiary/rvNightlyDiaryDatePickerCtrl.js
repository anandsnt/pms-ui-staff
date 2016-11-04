sntRover.controller('RVNightlyDiaryDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

    var minDateSelected = '';
    $scope.date = $scope.diaryData.fromDate;

    $scope.setUpData = function(){
        $scope.dateOptions = {
           changeYear: true,
           changeMonth: true,
           minDate: minDateSelected,
           maxDate: tzIndependentDate($rootScope.businessDate),
           yearRange: "-100:+0",
           onSelect: function(dateText, inst) {
                $scope.diaryData.fromDate = $scope.date;
                $rootScope.$emit('DATE_CAHNGED');
                ngDialog.close();
            }
        };
    };

    $scope.setUpData();
}]);