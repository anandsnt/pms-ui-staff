describe('payShijiCtrl', () => {

    let $controller,
        $scope = {},
        $rootScope,
        sntActivity,
        ctrl,
        $q,
        sntPaymentSrv;

    beforeEach(() => {
        module('sntPay', function($provide) {
            $provide.value('paymentAppEventConstants', {});
            $provide.value('PAYMENT_CONFIG', {
                'SHIJI': {
                    iFrameUrl: '/api/ipage/shiji',
                    jsLibrary: null,
                    partial: '/assets/partials/payShijiPartial.html',
                    params: iFrameParams
                }
            });
        });

        inject(function(_$controller_,
            _$rootScope_,
            _sntShijiGatewaySrv_,
            _sntPaymentSrv_,
            _ngDialog_,
            _$timeout_,
            _sntActivity_,
            _$window_,
            _$sce_,
            _$q_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $scope = $rootScope.$new();
            sntActivity = _sntActivity_;
            sntPaymentSrv = _sntPaymentSrv_;
            $q = _$q_;
        });

        angular.extend($scope, {
            showSelectedCard: () => {
                return true;
            },
            payment: {
                addToGuestCardSelected: true
            },
            hotelConfig: {
                paymentGateway: 'SHIJI'
            },
            clearErrorMessage: () => {

            }
        });
        ctrl = $controller('payShijiCtrl', {
            $scope: $scope
        });
    });

    it('set isManualEntryInsideIFrame as true if card is present', () => {

        expect($scope.payment.isManualEntryInsideIFrame)
            .toBe(true);
    });

    it('On trying to add a new card, clear previous error message', () => {
        spyOn($scope, 'clearErrorMessage');
        $scope.$emit('GET_SHIJI_TOKEN');
        expect($scope.clearErrorMessage)
            .toHaveBeenCalled();
    });

    it('On iFrame reloading show loading indicator', () => {
        let fixture = '<iframe class="payment-iframe iframe-scroll" id="iframe-token" ng-controller="payShijiCtrl" seamless></iframe>';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
        spyOn(sntActivity, 'start');
        $scope.$emit('RELOAD_IFRAME');

        expect(sntActivity.start)
            .toHaveBeenCalledWith('SHIJI_IFRAME_LOADING');
    });

    it('on Message from iframe retieve token Id', () => {
        spyOn(sntPaymentSrv, 'savePaymentDetails').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({
                status: 'success',
                data: {}
            });
            return deferred.promise;
        });
        $scope.actionType = 'ADD_PAYMENT_CARD';
        $scope.tokenizeBySavingtheCard('XXXXXXXXX');
        $rootScope.$apply();
    });

    it('on save payment failure, show error message', () => {
        spyOn(sntPaymentSrv, 'savePaymentDetails').and.callFake(function() {
            var deferred = $q.defer();

            deferred.reject("Error");
            return deferred.promise;
        });
        spyOn($scope, '$emit');
        $scope.actionType = 'ADD_PAYMENT_CARD';
        $scope.tokenizeBySavingtheCard('XXXXXXXXX');
        $rootScope.$apply();
        expect($scope.$emit).toHaveBeenCalledWith('PAYMENT_FAILED', 'Error');
    });
});