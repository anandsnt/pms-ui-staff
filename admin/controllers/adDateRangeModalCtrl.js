admin.controller('ADDateRangeModalCtrl',['$scope','$filter','dateFilter','ADRatesConfigureSrv', function($scope,$filter,dateFilter,ADRatesConfigureSrv){

      var dateDict =ADRatesConfigureSrv.getCurrentSetData();
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
}]);