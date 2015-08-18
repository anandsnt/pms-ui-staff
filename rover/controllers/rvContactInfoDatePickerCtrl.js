sntRover.controller('RVContactInfoDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

$scope.setUpData = function(){
   $scope.dateOptions = {
     changeYear: true,
     changeMonth: true,
     maxDate: tzIndependentDate($rootScope.businessDate),
     yearRange: "-100:+0",
      onSelect: function(dateText, inst) {
        ngDialog.close();
      }

    };
};
$scope.setUpData();

}]);