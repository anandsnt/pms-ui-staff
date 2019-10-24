admin.controller('adEndDatePickerController', ['$scope', 'ngDialog', '$rootScope', '$filter', 
    function($scope, ngDialog, $rootScope, $filter) {

// if no date is selected .Make bussiness date as default CICO-8703
if (!$scope.rateData.end_date) {
	$scope.rateData.end_date = $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd');
}

$scope.setUpData = function() {
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        minDate: tzIndependentDate($rootScope.businessDate),
        onSelect: function(dateText, inst) {
            $scope.rateData.end_date_for_display = $filter('date')(tzIndependentDate($scope.rateData.end_date), $rootScope.dateFormat);
            ngDialog.close();
        }
    };
};
$scope.setUpData();

}]);