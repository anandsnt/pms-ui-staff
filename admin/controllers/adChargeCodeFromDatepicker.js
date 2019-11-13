admin.controller('ADchargeCodeDatepickerCtrl', ['$scope', 'ngDialog', '$rootScope', '$filter', function($scope, ngDialog, $rootScope, $filter) {

// if no date is selected .Make bussiness date as default CICO-8703

$scope.setUpData = function() {
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        minDate: tzIndependentDate($rootScope.businessDate),
        onSelect: function(dateText, inst) {
        	if ($scope.whichDate === "from") {
        		$scope.prefetchData.custom_tax_rules[$scope.currentTaxIndex].from_date = $filter('date')(tzIndependentDate($scope.from_date), 'yyyy-MM-dd');
        	} else {
        		$scope.prefetchData.custom_tax_rules[$scope.currentTaxIndex].to_date = $filter('date')(tzIndependentDate($scope.from_date), 'yyyy-MM-dd');
        	}
            
            ngDialog.close();
        }
    };
};
$scope.setUpData();

}]);