sntRover.controller('RVContactInfoDatePickerController', ['$scope', '$rootScope', 'ngDialog', 'dateFilter', function($scope, $rootScope, ngDialog, dateFilter) {

$scope.setUpData = function() {
   $scope.dateOptions = {
     changeYear: true,
     changeMonth: true,
     maxDate: tzIndependentDate($rootScope.businessDate),
     yearRange: "-100:+0",
      onSelect: function(dateText, inst) {
      	if ($scope.datePicker) {
      		ngDialog.close($scope.datePicker.id);
      		$scope.saveData.birth_day = JSON.parse(JSON.stringify(dateFilter(dateText, $rootScope.dateFormat)));;
      	} else {
      		ngDialog.close();
      	}        
      }

    };
};
$scope.setUpData();

}]);