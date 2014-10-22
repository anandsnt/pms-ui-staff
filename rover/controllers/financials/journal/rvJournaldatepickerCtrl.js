sntRover.controller('RVJournalDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

$scope.setUpData = function(){
   $scope.dateOptions = {
     changeYear: true,
     changeMonth: true,
     maxDate: tzIndependentDate($rootScope.businessDate),
     yearRange: "-100:+0",
      onSelect: function(dateText, inst) {
      	
      	if($scope.clickedOn === 'FROM') $scope.data.fromDate = $scope.date;
      	if($scope.clickedOn === 'TO') $scope.data.toDate = $scope.date;

      	console.log("$scope.fromDate"+$scope.data.fromDate);
      	console.log("$scope.toDate"+$scope.data.toDate);

      
        ngDialog.close();
      }

    }
};
$scope.setUpData();

}]);