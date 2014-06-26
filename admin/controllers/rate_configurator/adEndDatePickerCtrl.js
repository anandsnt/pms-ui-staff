admin.controller('adEndDatePickerController',['$scope','dateFilter','ngDialog','$rootScope',function($scope,dateFilter,ngDialog,$rootScope){

$scope.setUpData = function(){

    $scope.isDateSelected = $scope.rateData.end_date ?  true:false;
    if($scope.rateData.end_date){
      $scope.date = $scope.rateData.end_date;
      $scope.isDateSelected = true;
    }
    else{
      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
    }
    $scope.minDate = $rootScope.businessDate;
};
$scope.setUpData();

$scope.$watch('date',function(oldValue,newValue){
    if(oldValue != newValue){
      $scope.rateData.end_date = $scope.date;
      ngDialog.close();
  }
});

}]);