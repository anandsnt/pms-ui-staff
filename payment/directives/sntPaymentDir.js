sntPay.directive('sntPayment', function() {
    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
            paymentTypes: '=',
            selectedPaymentType: '=',
            reservationId: '@',
            guestId: '@',
            billId : '@',
            amount: '@',
            feeData: '=',
            linkedCreditCards: '=',
            attachedCc: '=',
            actionType: '@',
            depositPolicyName: '=',
            isDepositEditable : '=',
            currencySymbol : '=',
            isReservationRateSuppressed : '=',
            hasPermissionToMakePayment : '='
        },
        link: function() {
            console.log("--From Payment Module Init--");
        },
        templateUrl: "/assets/partials/sntPaymentHome.html",
        controller: 'sntPaymentController'
    };

});