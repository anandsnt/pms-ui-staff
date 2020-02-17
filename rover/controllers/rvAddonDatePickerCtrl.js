sntRover.controller('RVAddonDatePickerController', 
    ['$scope', '$rootScope', '$filter',
    function($scope, $rootScope, $filter) {

    $scope.setUpData = function() {
        var startDate = tzIndependentDate($scope.reservation.reservation_card.arrival_date),
            endDate = tzIndependentDate($scope.reservation.reservation_card.departure_date);

        $scope.data = {};
        $scope.data.selectedDate = $scope.datePickerFor === 'start_date' ? $scope.selectedPurchesedAddon.start_date : $scope.selectedPurchesedAddon.end_date;
        $scope.dateOptions = {
            dateFormat: $rootScope.jqDateFormat,
            changeYear: true,
            changeMonth: true,
            yearRange: "0:+10",
            minDate: startDate,
            maxDate: endDate,
            onSelect: function(dateText) {
                $scope.dateSelected(dateText);
                
                $scope.closeCalendar();
            }
        };
    };
    $scope.setUpData();
}]);