admin.controller('ADDateRangeModalCtrl',['$scope','$filter','dateFilter','ADRatesConfigureSrv','ngDialog', function($scope,$filter,dateFilter,ADRatesConfigureSrv,ngDialog){
BaseCtrl.call(this, $scope);

   $scope.setUpData = function(){

      $scope.isFromDateSelected = true;
      $scope.isToDateSelected   = true;
      $scope.fromDate = $scope.data.begin_date;
      $scope.fromMinDate =dateFilter(new Date(), 'yyyy-MM-dd');
      currentDate   = new Date();
      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() +1);
      $scope.toMonthDate = currentDate;
      $scope.toMonthDateFormated = $scope.data.end_date;
      $scope.toMonthMinDate = dateFilter(currentDate, 'yyyy-MM-dd');
      $scope.errorMessage='';
      if(ADRatesConfigureSrv.hasBaseRate){
        $scope.fromMinDate = dateDict.begin_date;
        $scope.maxDate = dateDict.end_date;           
      }
};

$scope.setUpData();
$scope.updateClicked = function(){
 	var successUpdateRange =function(){
 		$scope.$emit('hideLoader');
    $scope.data.begin_date= $scope.dateRange.begin_date = $scope.fromDate;
    $scope.data.end_date =$scope.dateRange.end_date = $scope.toMonthDateFormated;
    ngDialog.close();
 };
 var failureUpdateRange =function(data){
   $scope.$emit('hideLoader');
   $scope.errorMessage = data;
 };

 var data = {
   "dateId":$scope.dateRange.id,
 	 "begin_date": $scope.fromDate,
 	 "end_date":$scope.toMonthDateFormated
 };
 $scope.invokeApi(ADRatesConfigureSrv.updateDateRange,data,successUpdateRange,failureUpdateRange);
};
$scope.cancelClicked = function(){
 ngDialog.close();

};

$scope.count = 0;

$scope.$on("fromDateChanged", function(e,value){
           $scope.count++;
           if($scope.count > 2){
              var fromScope = $scope.$$childHead;
              var toScope = $scope.$$childHead.$$nextSibling;
              var fromDays = (12* parseInt(fromScope.yearSelected)) + parseInt(fromScope.monthSelected.value);
              var toDays = (12*parseInt(toScope.yearSelected)) + parseInt(toScope.monthSelected.value);
              if(fromDays >= toDays){                
                toScope.changeMonth(parseInt (fromDays - toDays),false);  
              }
           }
});

}]);