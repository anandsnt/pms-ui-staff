angular.module('sntPay').controller('confirmDirectBillPopupCtrl', ['$scope', 
    function($scope) {

        // Confirm DB payment option.
        $scope.payToDirectBill = function() {  
            $scope.$emit('CONFIRM_DB_PAYMENT', $scope.ngDialogData);
        };
        // Handle Cancel button click.
        $scope.cancelButtonClick = function() {
            $scope.$emit('CLOSE_CONFIRM_DB_PAYMENT');
        };

}]);