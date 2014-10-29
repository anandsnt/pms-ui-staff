sntRover.controller('RVJournalDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

$scope.setUpData = function(){
   $scope.dateOptions = {
     changeYear: true,
     changeMonth: true,
     maxDate: tzIndependentDate($rootScope.businessDate),
     yearRange: "-100:+0",
      onSelect: function(dateText, inst) {
      	if($scope.clickedOn === 'FROM'){
          $scope.data.fromDate = $scope.date;
          $rootScope.$emit('fromDateChanged');
        } 
        else if($scope.clickedOn === 'TO'){
          $scope.data.toDate = $scope.date;
          $rootScope.$emit('toDateChanged');
        } 
        else if($scope.clickedOn === 'CASHIER'){
          $scope.data.cashierDate = $scope.date;
          $scope.$emit('cashierDateChanged');
        }
        else if($scope.clickedOn === 'PAYMENT'){
          $scope.data.paymentDate = $scope.date;
          $rootScope.$emit('paymentDateChanged');
        }
        ngDialog.close();
      }
    }
};
$scope.setUpData();

}]);