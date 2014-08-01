admin.controller('adEndDatePickerController',['$scope','ngDialog','$rootScope','$filter',function($scope,ngDialog,$rootScope,$filter){

$scope.setUpData = function(){
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        minDate: tzIndependentDate($rootScope.businessDate),
        onSelect: function(dateText, inst) {
            $scope.rateData.end_date_for_display = $filter('date')(tzIndependentDate($scope.rateData.end_date), 'MM-dd-yyyy');
            ngDialog.close();
        }
    }
};
$scope.setUpData();

}]);