sntPay.directive('sntPayment', function() {
    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
            hotelConfig: '=',
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
            hasPermission : '=',
            formTemplateUrl : '@',
            isManualCcEntryEnabled: '=',
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