sntPay.directive('sntPayment', function () {

    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            instanceConfig: '@'
        },
        link: function () {
            console.log("--From Payment Module Init--");
        },
        templateUrl: "/assets/partials/paymentHome.html"
    };

});