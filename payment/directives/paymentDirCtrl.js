sntPay.controller('sntPaymentController', function($scope) {
    $scope.showSelectedCard = function() {
         //below condition may be modified wrt payment gateway and all
         var isCCPresent = ($scope.selectedPaymentType === "CC" && $scope.attachedCc.ending_with.length > 0);
         return isCCPresent;
    };
});