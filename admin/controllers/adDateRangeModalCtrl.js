admin.controller('ADDateRangeModalCtrl',['$scope',
                                          '$filter',
                                          'dateFilter',
                                          'ADRatesConfigureSrv',
                                          'ngDialog', 
                                          '$rootScope',
function($scope,$filter,dateFilter,ADRatesConfigureSrv,ngDialog, $rootScope){
BaseCtrl.call(this, $scope);

 $scope.setUpData = function(){
     
      $scope.errorMessage='';
      if(ADRatesConfigureSrv.hasBaseRate){
        $scope.data.begin_date = dateDict.begin_date;
        $scope.data.end_date = dateDict.end_date;           
      }


      $scope.fromDateOptions = {
         changeYear: true,
         changeMonth: true,
         minDate: tzIndependentDate($rootScope.businessDate),
         yearRange: "0:+10",
         onSelect: function() {

            if(tzIndependentDate($scope.data.begin_date) > tzIndependentDate($scope.data.end_date)){
              $scope.data.end_date = $scope.data.begin_date;
            }
         }
         }

      $scope.toDateOptions = {
         changeYear: true,
         changeMonth: true,
         minDate: tzIndependentDate($rootScope.businessDate),
         yearRange: "0:+10",
         onSelect: function() {

            if(tzIndependentDate($scope.data.begin_date) > tzIndependentDate($scope.data.end_date)){
              $scope.data.begin_date = $scope.data.end_date;
            }
         }
       }

}

$scope.setUpData();

$scope.updateClicked = function(){
  var successUpdateRange =function(){
    $scope.$emit('hideLoader');
    $scope.dateRange.begin_date=$scope.data.begin_date;
    $scope.dateRange.end_date = $scope.data.end_date;
    ngDialog.close();
 };

 var failureUpdateRange =function(data){
   $scope.$emit('hideLoader');
   $scope.errorMessage = data;
 };

 var data = {
   "dateId":$scope.dateRange.id,
 	 "begin_date": $scope.data.begin_date,
 	 "end_date":$scope.data.end_date
 };
 $scope.invokeApi(ADRatesConfigureSrv.updateDateRange,data,successUpdateRange,failureUpdateRange);
};
$scope.cancelClicked = function(){
 ngDialog.close();

};

}]);