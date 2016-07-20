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
            amount: '=',
            linkedCreditCards: '=',
            attachedCc: '=',
            actionType: '@',
            depositPolicyName: '=',
            isEditable : '=',
            isRateSuppressed: '=',
            currencySymbol : '=',
            hasPermission : '=',
            formTemplateUrl : '@'
        },
        link: function() {
            console.log("--From Payment Module Init--");
        },
        templateUrl: "/assets/partials/sntPaymentHome.html",
        controller: 'sntPaymentController'
    };

});