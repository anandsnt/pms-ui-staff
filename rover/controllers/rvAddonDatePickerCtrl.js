sntRover.controller('RVAddonDatePickerController', 
    ['$scope', '$rootScope',
    function($scope, $rootScope) {

    $scope.setUpData = function() {
        $scope.data = {};
        $scope.data.selectedDate = $scope.datePickerFor === 'start_date' ? $scope.selectedPurchesedAddon.start_date : $scope.selectedPurchesedAddon.end_date;
        $scope.dateOptions = {
            dateFormat: $rootScope.jqDateFormat,
            changeYear: true,
            changeMonth: true,
            yearRange: "0:+10",
            minDate: $scope.datePickerFor === 'start_date' ? $scope.addonPostingDate.startDate : $scope.selectedPurchesedAddon.start_date,
            maxDate: $scope.datePickerFor === 'start_date' ? $scope.selectedPurchesedAddon.end_date : $scope.addonPostingDate.endDate,
            onSelect: function(dateText) {
                $scope.dateSelected(dateText);
                
                $scope.closeCalendar();
            }
        };
    };
    $scope.setUpData();
}]);