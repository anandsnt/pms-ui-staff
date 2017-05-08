angular.module('sntPay').controller('confirmDirectBillPopupCtrl', ['$scope', 
    function($scope) {

        // Confirm DB payment option.
        $scope.payToDirectBill = function() {  
            $scope.$emit('CONFIRMED_DB_PAYMENT', $scope.ngDialogData);
        };
        // Handle Cancel button click.
        $scope.cancelButtonClick = function() {
            $scope.$emit('CANCELLED_CONFIRM_DB_PAYMENT');
        };
	}
]);