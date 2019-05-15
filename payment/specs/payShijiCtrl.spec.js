describe('payShijiCtrl', () => {

    let $controller,
        $scope = {},
        $rootScope,
        sntActivity,
        payShijiCtrl,
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
                    params: {}
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
        payShijiCtrl = $controller('payShijiCtrl', {
            $scope: $scope
        });
    });

    it('On iFrame reloading show loading indicator', () => {
        let fixture = '<iframe class="payment-iframe iframe-scroll" id="iframe-token" ng-controller="payShijiCtrl" seamless></iframe>';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
        spyOn(sntActivity, 'start');
        payShijiCtrl.loadShijiIframe();

        expect(sntActivity.start)
            .toHaveBeenCalledWith('SHIJI_IFRAME_LOADING');
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

    describe('Add payment method', () => {
        it('on Message from iframe retieve token Id', () => {
            spyOn(sntPaymentSrv, 'savePaymentDetails').and.callFake(function() {
                let deferred = $q.defer();

                deferred.resolve({
                    status: 'success',
                    data: {}
                });
                return deferred.promise;
            });
            $scope.actionType = 'ADD_PAYMENT_CARD';
            payShijiCtrl.tokenizeBySavingtheCard('XXXXXXXXX');
            $rootScope.$apply();
        });

        it('on Message from iframe retieve token Id and save card and notify parent controller', () => {
            spyOn($scope, '$emit');
            spyOn(sntPaymentSrv, 'savePaymentDetails').and.callFake(function() {
                let deferred = $q.defer();

                deferred.resolve({
                    status: 'success',
                    data: {}
                });
                return deferred.promise;
            });
            $scope.actionType = 'ADD_PAYMENT_CARD';
            payShijiCtrl.tokenizeBySavingtheCard('XXXXXXXXX');
            $rootScope.$apply();
            expect($scope.$emit).toHaveBeenCalledWith('SUCCESS_LINK_PAYMENT', jasmine.any(Object));
        });

        it('on Message from iframe retieve token Id and save card and on error, show error message', () => {
            spyOn($scope, '$emit');
            spyOn(sntPaymentSrv, 'savePaymentDetails').and.callFake(function() {
                let deferred = $q.defer();

                deferred.resolve({
                    status: 'failure',
                    data: {},
                    errors: []
                });
                return deferred.promise;
            });
            $scope.actionType = 'ADD_PAYMENT_CARD';
            payShijiCtrl.tokenizeBySavingtheCard('XXXXXXXXX');
            $rootScope.$apply();
            expect($scope.$emit).toHaveBeenCalledWith('PAYMENT_FAILED', jasmine.any(Object));
        });

        it('on save payment failure, show error message', () => {
            spyOn(sntPaymentSrv, 'savePaymentDetails').and.callFake(function() {
                let deferred = $q.defer();

                deferred.reject("Error");
                return deferred.promise;
            });
            spyOn($scope, '$emit');
            $scope.actionType = 'ADD_PAYMENT_CARD';
            payShijiCtrl.tokenizeBySavingtheCard('XXXXXXXXX');
            $rootScope.$apply();
            expect($scope.$emit).toHaveBeenCalledWith('PAYMENT_FAILED', 'Error');
        });
    });

    it('For payment screens, on Message from iframe retieve token Id and notify the parent controller', () => {
        spyOn($scope, '$emit');
        $scope.actionType = 'DEPOSIT_PAYMENT_RES_SUMMARY';
        payShijiCtrl.tokenizeBySavingtheCard('XXXXXXXXX');
        expect($scope.$emit).toHaveBeenCalledWith('PAYMENTAPP_CC_TOKEN_GENERATED', jasmine.any(Object));
    });
});