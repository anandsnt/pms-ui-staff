admin.controller('ADchargeCodeDatepickerCtrl', ['$scope', 'ngDialog', '$rootScope', 
function($scope, ngDialog, $rootScope) {

// if no date is selected .Make bussiness date as default CICO-8703

var minDate = "";

if ($scope.whichDate === "from") {
    minDate = tzIndependentDate($rootScope.businessDate);
} else {
    minDate = $scope.prefetchData.custom_tax_rules[$scope.currentTaxIndex].from_date;
}

$scope.setUpData = function(minDate) {
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        minDate: tzIndependentDate(minDate),

        onSelect: function(dateText) {
            if ($scope.whichDate === "from") {
                $scope.prefetchData.custom_tax_rules[$scope.currentTaxIndex].from_date = moment(dateText, "MM/DD/YYYY").format("YYYY-MM-DD");
            } else {
                $scope.prefetchData.custom_tax_rules[$scope.currentTaxIndex].to_date = moment(dateText, "MM/DD/YYYY").format("YYYY-MM-DD");
            }

            ngDialog.close();
        }
    };
};
$scope.setUpData(minDate);

}]);