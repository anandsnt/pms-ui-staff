sntRover.controller('RVAddonDatePickerController', 
    ['$scope', '$rootScope', 'ngDialog', 'dateFilter', 
    function($scope, $rootScope, ngDialog, dateFilter) {

    $scope.setUpData = function() {
        $scope.dateOptions = {
            dateFormat: $rootScope.jqDateFormat,
            changeYear: true,
            changeMonth: true,
            yearRange: "0:+10",
            onSelect: function(dateText, inst) {
                if ($scope.datePickerFor == 'start_date') {
                    $scope.selectedPurchesedAddon.startDate = dateText;
                } else {
                    $scope.selectedPurchesedAddon.endDate = dateText;
                }
                
                $scope.closeCalendar();
            }
        };
    };
    $scope.setUpData();
}]);