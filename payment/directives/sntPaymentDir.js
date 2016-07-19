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
            attachedCc: '=',
            actionType: '@',
            depositPolicyName: '=',
            isDepositEditable : '=',
            currencySymbol : '=',
            isReservationRateSuppressed : '='
        },
        link: function() {
            console.log("--From Payment Module Init--");
        },
        templateUrl: "/assets/partials/sntPaymentHome.html",
        controller: 'sntPaymentController'
    };

});