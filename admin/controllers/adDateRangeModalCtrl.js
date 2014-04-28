admin.controller('ADDateRangeModalCtrl',['$scope','$filter','dateFilter','ADRatesConfigureSrv','ngDialog', function($scope,$filter,dateFilter,ADRatesConfigureSrv,ngDialog){
	BaseCtrl.call(this, $scope);
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
         $scope.errorMessage='';
   };

   $scope.setUpData();
   $scope.updateClicked = function(){
	   	var successUpdateRange =function(){
	   		$scope.$emit('hideLoader');
		    dateDict.begin_date = $scope.fromDate;
		    dateDict.end_date =  $scope.toMonthDateFormated;
		    ADRatesConfigureSrv.setCurrentSetData(dateDict);
		    ngDialog.close();
	   };
	   var failureUpdateRange =function(data){
		   $scope.$emit('hideLoader');
       $scope.errorMessage = data;
	   };
	   var data = {
	   	 "begin_date": $scope.fromDate,
	   	 "end_date":$scope.toMonthDateFormated
	   };
	   $scope.invokeApi(ADRatesConfigureSrv.updateDateRange,data,successUpdateRange,failureUpdateRange);
   };
   $scope.cancelClicked = function(){
     ngDialog.close();

   };

}]);