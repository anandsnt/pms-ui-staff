sntPay.directive('sntPayment', function() {
    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
            paymentGateway: '@',
            workstationId: '@',//for EMV terminal we must pass this ID
            paymentTypes: '=',
            selectedPaymentType: '=',
            reservationId: '@',
            guestId: '@',
            billNumber: '=',
            billId : '@',
            amount: '=',
            linkedCreditCards: '=',
            attachedCc: '=',
            actionType: '@',
            depositPolicyName: '@',
            isEditable : '=',
            isRateSuppressed: '=',
            currencySymbol : '@',
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