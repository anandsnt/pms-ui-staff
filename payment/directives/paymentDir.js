sntPay.directive('sntPayment', function () {

    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
            paymentTypes : '=',
            selectedPaymentType : '@',
            reservationId : '@',
            guestId : '@',
            amount : '@'
        },
        link: function () {
            console.log("--From Payment Module Init--");
        },
        templateUrl: "/assets/partials/paymentHome.html"
    };

});