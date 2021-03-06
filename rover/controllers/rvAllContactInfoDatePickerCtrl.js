sntRover.controller('RVAllContactInfoDatePickerController', 
    ['$scope', '$rootScope', 'ngDialog', 'dateFilter', 
    function($scope, $rootScope, ngDialog, dateFilter) {

    $scope.setUpData = function() {
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            maxDate: tzIndependentDate($rootScope.businessDate),
            yearRange: "-100:+0",
            onSelect: function(dateText, inst) {
                dateText = moment(dateText, "MM/DD/YYYY").format("YYYY-MM-DD");
                if ($scope.calenderFor === 'idDate') {
                    $scope.guestCardData.contactInfo.id_issue_date = dateText;
                }
                if ($scope.calenderFor === 'entryDate') {
                    $scope.guestCardData.contactInfo.entry_date = dateText;
                }
                if ($scope.calenderFor === 'birthday') {
                    $scope.guestCardData.contactInfo.birthday = dateText;
                }
                if ($scope.calenderFor === 'validate') {
                    $scope.saveData.birth_day = dateText;
                }
                if ($scope.datePicker) {
                    ngDialog.close($scope.datePicker.id);
                } else {
                    ngDialog.close();
                }
            }
        };
        if ($scope.calenderFor === 'idExpirationDate' || $scope.calenderFor === 'idExpirationDateValidate') {
            $scope.dateOptions = {
                changeYear: true,
                changeMonth: true,
                yearRange: "-100:+10",
                onSelect: function(dateText, inst) {
                    dateText = moment(dateText, "MM/DD/YYYY").format("YYYY-MM-DD");
                    $scope.guestCardData.contactInfo.id_expiration_date = dateText;
                    if ($scope.calenderFor === 'idExpirationDateValidate') {
                        $scope.saveData.id_expiration_date = dateText;
                    }
                    if ($scope.datePicker) {
                        ngDialog.close($scope.datePicker.id);
                    } else {
                        ngDialog.close();
                    }
                }
            };
        }
    };
    $scope.setUpData();
}]);