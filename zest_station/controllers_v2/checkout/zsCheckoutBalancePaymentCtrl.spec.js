describe('zsCheckoutBalancePaymentCtrl', function() {

    var $controller,
        $scope = {},
        zsPaymentSrv,
        zsStateHelperSrv,
        $q,
        $state;

    beforeEach(function() {

        module('sntZestStation', function($provide) {
            $provide.value('zsEventConstants', {});
        });

        inject(function(_$controller_, _zsPaymentSrv_, _zsStateHelperSrv_, _$state_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            zsPaymentSrv = _zsPaymentSrv_;
            zsStateHelperSrv = _zsStateHelperSrv_;
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $q = _$q_;
        });

        angular.extend($scope, {
            zestStationData: {},
            screenMode: {
                paymentAction: 'PAY_AMOUNT'
            },
            payUsingNewCard: function() {
                return;
            },
            resetTime: function() {
                return;
            },
            initiateCBAlisteners: function() {
                return;
            },
            startCBAPayment: function() {
                return;
            }
        });
        zsPaymentSrv.setPaymentData({
            amount: '23',
            payment_details: {
                card_number: '4111111111111111'
            }
        });
        zsStateHelperSrv.setPreviousStateParams({});

        $controller('zsCheckoutBalancePaymentCtrl', {
            $scope: $scope
        });
        $controller('zsPaymentCtrl', {
            $scope: $scope
        });
    });

    it('On next button click, go to the reservation bill state', function() {
        spyOn($state, 'go');
        $scope.goToNextScreen();
        expect($state.go).toHaveBeenCalledWith('zest_station.checkoutReservationBill', jasmine.any(Object));
    });

    it('On retry with an existing card, show payment method selection', function() {
        $scope.screenMode.isUsingExistingCardPayment = true;
        $scope.reTryCardSwipe();
        expect($scope.screenMode.value).toEqual('SELECT_PAYMENT_METHOD');
    });

    it('On retry without an existing card, start payemnt actions', function() {
        spyOn($scope, 'payUsingNewCard');
        $scope.screenMode.isUsingExistingCardPayment = false;
        $scope.reTryCardSwipe();
        expect($scope.payUsingNewCard).toHaveBeenCalled();
    });

    it('Once payment type API call is completed, Initialize and start CBA payments', function() {
        spyOn($scope, 'initiateCBAlisteners');
        spyOn($scope, 'startCBAPayment');
        $scope.$emit('FETCH_PAYMENT_TYPES_COMPLETED');
        expect($scope.initiateCBAlisteners).toHaveBeenCalled();
        expect($scope.startCBAPayment).toHaveBeenCalled();
    });
});