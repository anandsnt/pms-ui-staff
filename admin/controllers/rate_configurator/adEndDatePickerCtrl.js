admin.controller('adEndDatePickerController',['$scope','dateFilter','ngDialog','$rootScope','$filter',function($scope,dateFilter,ngDialog,$rootScope,$filter){

$scope.setUpData = function(){

    $scope.isDateSelected = $scope.rateData.end_date ?  true:false;
    if($scope.rateData.end_date){
        $scope.date = $scope.rateData.end_date;
        $scope.isDateSelected = true;
    }
    else{
        $scope.date = dateFilter(new Date($rootScope.businessDate), 'yyyy-MM-dd');
    }
    $scope.minDate = $rootScope.businessDate;
    $scope.closePopupOnSelection =false;
};
$scope.setUpData();



$scope.updateDate = function(){

    if($scope.closePopupOnSelection){
      $scope.rateData.end_date = $scope.date;
      $scope.rateData.end_date_for_display = $filter('date')(new Date($scope.rateData.end_date), 'MM-dd-yyyy');
      ngDialog.close();
    };  

  
};


}]);