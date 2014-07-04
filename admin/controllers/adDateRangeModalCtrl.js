admin.controller('ADDateRangeModalCtrl',['$scope',
                                          '$filter',
                                          'dateFilter',
                                          'ADRatesConfigureSrv',
                                          'ngDialog', 
                                          '$rootScope',
function($scope,$filter,dateFilter,ADRatesConfigureSrv,ngDialog, $rootScope){
BaseCtrl.call(this, $scope);

   $scope.setUpData = function(){
      $scope.fromCalendarID = "rateFromCalendar";
      $scope.toCalendarID = "rateToCalendar";

      $scope.isFromDateSelected = true;
      $scope.isToDateSelected   = true;
      $scope.fromDate = $scope.data.begin_date;
      $scope.fromMinDate =dateFilter(new Date($rootScope.businessDate), 'yyyy-MM-dd');
      currentDate   = new Date($rootScope.businessDate);
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

/**
* Calendar validation
* The from_date can not be less than the to_date. 
*/
$scope.$on("dateChangeEvent",function(e, value){
  console.log(value);

    if(new Date($scope.fromDate) > new Date($scope.toMonthDateFormated)){
        if (value.calendarId === $scope.fromCalendarID){
            $scope.toMonthDateFormated = $scope.fromDate;
        }else{
            $scope.fromDate = $scope.toMonthDateFormated;
        }
    }
});

}]);