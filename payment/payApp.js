var payTemplateApp = angular.module('sntPayTemplates', []);

angular.module('sntPay', [
    'pascalprecht.translate',
    'oc.lazyLoad',
    'ng-iscroll',
    'ngDialog'
]).run(['$rootScope', 'sntCBAGatewaySrv', function($rootScope, sntCBAGatewaySrv) {
    /**
     * This listener initiates the power failure mitigation routine in case of CBA
     */
    $rootScope.$on('CBA_PAYMENT_POWER_FAILURE_CHECK', () => {
        sntCBAGatewaySrv.checkLastTransactionStatus();
    });
}]);
