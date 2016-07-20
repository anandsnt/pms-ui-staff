var sntPay = angular.module('sntPay', [
    'pascalprecht.translate',
    'oc.lazyLoad'
]);


sntPay.run(function ($rootScope) {
    $rootScope.viewState = {
        numRequests: 0
    };
});
