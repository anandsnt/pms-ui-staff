angular.module('sntPay').directive('sntPayment', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            hotelConfig: '=', // hotel settings related
            paymentTypes: '=', // the payment types present
            selectedPaymentType: '=?', // selected initial payment type
            reservationId: '@',
            postingAccountId: '=?',
            billId: '=?',
            arTransactionId: '=?', // param used for ar payment refund
            accountId: '@',
            groupId: '@',
            allotmentId: '@',
            guestId: '@',
            billNumber: '=',
            amount: '=', // amount to pay
            selectedCC: '=?', // selected CC details
            referenceText: '=?', // selected CC details
            actionType: '@',
            depositPolicyName: '@',
            isEditable: '=?', // is the amount editable
            isRateSuppressed: '=?',
            workstationId: "@",
            hasPermission: '=?', // has permission to amke payment
            formTemplateUrl: '@', // the URL of the partial to be laoded as form
            firstName: '@?', // first name to be used in six pay iframe
            lastName: '@?', // second name to be used in six pay iframe
            swipedCardData: '@',
            splitBillEnabled: '=?',
            numSplits: '=?',
            completedSplitPayments: '=?',
            fetchLinkedCards: "=?",
            hideOverlayGiftcard: "=?",
            reservationIds: "=?",
            onlyPaymentSelection: "=?"
        },
        link: function(scope, element, attrs) {
            console.log("--From Payment Module Init--");
            console.log(attrs);
        },
        templateUrl: "/assets/partials/sntPaymentHome.html",
        controller: 'sntPaymentController'
    };

});