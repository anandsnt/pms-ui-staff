sntPay.directive('sntPayment', function() {
    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
            isStandAlone:'=',
            paymentGateway: '@',
            workstationId: '@',//for EMV terminal we must pass this ID,
            emvTimeout:'=',
            paymentTypes: '=',
            selectedPaymentType: '=',
            reservationId: '@',
            guestId: '@',
            billNumber: '=',
            billId : '@',
            amount: '=',
            selectedCC: '=',
            actionType: '@',
            depositPolicyName: '@',
            isEditable : '=',
            isRateSuppressed: '=',
            currencySymbol : '@',
            hasPermission : '=',
            formTemplateUrl : '@',
            isManualCcEntryEnabled: '=',
            mliMerchantId: '@',
            firstName: '@',
            lastName: '@'
        },
        link: function() {
            console.log("--From Payment Module Init--");
        },
        templateUrl: "/assets/partials/sntPaymentHome.html",
        controller: 'sntPaymentController'
    };

});