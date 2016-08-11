var sntPay = angular.module('sntPay', [
    'pascalprecht.translate',
    'oc.lazyLoad',
    'sntPayTemplates'
]);

sntPay.run(['$rootScope',  'PAYMENT_CONFIG', function($rootScope, PAYMENT_CONFIG) {
    console.log("----------------", PAYMENT_CONFIG);
}]);
