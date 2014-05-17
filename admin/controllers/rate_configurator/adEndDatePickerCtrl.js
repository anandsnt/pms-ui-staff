admin.controller('adEndDatePickerController',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){

$scope.setUpData = function(){

    $scope.end_date = $scope.rateData.end_date;
    $scope.isDateSelected = $scope.rateData.end_date ?  true:false;

    if($scope.end_date!= null){
      $scope.date = $scope.end_date;
      $scope.isDateSelected = true;
    }
    else{
      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
    }
};
$scope.setUpData();

$scope.$watch('date',function(oldValue,newValue){
    if(oldValue != newValue){
       $scope.rateData.end_date = $scope.date;
    ngDialog.close();
  }
});

}]);