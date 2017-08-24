sntRover.controller('RVArAddBalanceDatePickerController', ['$scope', 'ngDialog', function($scope, $rootScope, ngDialog ) {

	$scope.date = tzIndependentDate($rootScope.businessDate) ;
    // Setup date picker..
    $scope.setUpData = function() {
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: "0:+5", // Show 5 years in past & 5 years in future
            onSelect: function(dateText, inst) {
                var item = $scope.manualBalanceObj;

                item.manualBalanceList[item.selectedIndex].departureDate = $scope.date;
               
                ngDialog.close();
            }
        };
    };

    $scope.setUpData();

}]);
