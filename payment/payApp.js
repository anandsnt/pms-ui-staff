angular.module('sntPayTemplates', []);

angular.module('sntPay', [
    'pascalprecht.translate',
    'oc.lazyLoad',
    'sntPayTemplates',
    'ng-iscroll',
    'ngDialog'
])
.run(['$rootScope', 'PAYMENT_CONFIG', function($rootScope, PAYMENT_CONFIG) {

}]);
