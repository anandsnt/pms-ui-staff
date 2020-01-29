sntRover.controller('RVAddonDatePickerController', 
    ['$scope', '$rootScope', 'dateFilter',
    function($scope, $rootScope, dateFilter) {

    $scope.setUpData = function() {
        $scope.data = {};
        $scope.data.selectedDate = $scope.datePickerFor == 'start_date' ? $scope.selectedPurchesedAddon.start_date : $scope.selectedPurchesedAddon.end_date;
        $scope.dateOptions = {
            dateFormat: $rootScope.jqDateFormat,
            changeYear: true,
            changeMonth: true,
            yearRange: "0:+10",
            onSelect: function(dateText, inst) {
                $scope.dateSelected(dateText);
                
                $scope.closeCalendar();
            }
        };
    };
    $scope.setUpData();
}]);