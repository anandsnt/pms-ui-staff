angular.module('sntPay').run(['$rootScope', 'sntCBAGatewaySrv', function($rootScope, sntCBAGatewaySrv) {
    /**
     * This listener initiates the power failure mitigation routine in case of CBA
     */
    var listenCBAFailCheck = $rootScope.$on('CBA_PAYMENT_POWER_FAILURE_CHECK', () => {
        sntCBAGatewaySrv.checkLastTransactionStatus();
    });

    $rootScope.$on('$destroy', listenCBAFailCheck);
}]);