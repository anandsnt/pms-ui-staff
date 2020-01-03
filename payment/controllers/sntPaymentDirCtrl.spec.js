describe('sntPaymentController', function () {
    var $controller, $rootScope, $scope;

    beforeEach(function () {
        module('ui.router');
        module('sntPay', function ($provide) {
            $provide.value('rvPermissionSrv', {});
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

        inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope  = _$rootScope_;
            $scope = $rootScope.$new();
        });

        angular.extend($scope, {
            hotelConfig: {
                isStandAlone: true,
                paymentGateway: 'SHIJI'
            }
        });

        angular.extend($rootScope, {
            currencySymbol: '$',
            hotelCurrencyId: 1,
            hotelDetails: {
                shiji_token_enable_offline: false
            }
        });

        // To handle the sntapp global variable
        window.sntapp = {};

        // Global util method being used
        window.isEmptyObject = function isEmptyObject(obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        };

        $controller('sntPaymentController', {
            $scope: $scope,
            $rootScope: $rootScope
        });
    });

    describe('.onPaymentInfoChange(shouldReset)', function() {
        beforeEach(function() {
            $scope.amount = 25;
            $scope.$digest();
        });

        describe('when the payment type has changed', function() {
            beforeEach(function() { 
                this.shouldReset = true;
            });

            it('resets the selected currency to the default', function() {
                $scope.payment.selectedPaymentCurrencyId = 2;
                $scope.payment.selectedPaymentCurrencySymbol = '€';

                $scope.onPaymentInfoChange(this.shouldReset);

                expect($scope.payment).toEqual(jasmine.objectContaining({
                    selectedPaymentCurrencyId: 1,
                    selectedPaymentCurrencySymbol: '$'
                }));
            });

            it('resets the payment amount to its initial value', function() {
                $scope.payment.amount = 50;
                $scope.onPaymentInfoChange(this.shouldReset);
                expect($scope.payment.amount).toBe(25);
            });

            it('resets the payment fee to its initial value', function() {
                $scope.feeData.calculatedFee = 10;
                $scope.onPaymentInfoChange(this.shouldReset);
                expect(parseFloat($scope.feeData.calculatedFee)).toBe(0);
            });
        });
    });
});
