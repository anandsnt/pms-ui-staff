admin.controller('ADDateRangeModalCtrl',['$scope','$filter','dateFilter','ADRatesConfigureSrv','ngDialog', function($scope,$filter,dateFilter,ADRatesConfigureSrv,ngDialog){

      var dateDict =ADRatesConfigureSrv.getCurrentSetData();
      console.log(dateDict)
       $scope.setUpData = function(){

         $scope.isFromDateSelected = true;
         $scope.isToDateSelected   = true;

        $scope.fromDate = dateDict.begin_date;
        $scope.fromMinDate =dateFilter(new Date(), 'yyyy-MM-dd');
      
        currentDate   = new Date();
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() +1);
        $scope.toMonthDate = currentDate;
        $scope.toMonthDateFormated = dateDict.end_date;;
         $scope.toMonthMinDate = dateFilter(currentDate, 'yyyy-MM-dd');
   };

   $scope.setUpData();
   $scope.updateClicked = function(){
    dateDict.begin_date = $scope.fromDate;
    dateDict.end_date =  $scope.toMonthDateFormated;

    ADRatesConfigureSrv.setCurrentSetData(dateDict);
      ngDialog.close();
   }

}]);