describe('ADChargeCodesCtrl', function() {

    var $controller,
        $scope = {},
        ADChargeCodesSrv;

    beforeEach(function() {
        module('admin');

        inject(function (_$controller_, _$rootScope_, _ADChargeCodesSrv_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            ADChargeCodesSrv = _ADChargeCodesSrv_;
        });
        angular.extend($scope, {
            'setScroller': function() {
                return true;
            }
        });
        $scope.data = {};
        $scope.data.id = 81;
        $controller('ADChargeCodesCtrl', {
            $scope: $scope
        });

        spyOn(ADChargeCodesSrv, 'getChargeCodeTypeValue').
            and.
            callFake(function(value) {
                switch (value) {
                    case 'TAX':
                        return 1;
                    case 'FEES':
                        return 2;
                    case 'PAYMENT':
                        return 3;
                    case 'TOURIST TAX':
                        return 4;
                    default:
                        return -1;
                }
            });
    });

    it('isTaxSelected', function() {
        $scope.prefetchData.selected_charge_code_type = 1;
        expect($scope.isTaxSelected()).toBe(true);
    });

    it('isFeesSelected', function() {
        $scope.prefetchData.selected_charge_code_type = 2;
        expect($scope.isFeesSelected()).toBe(true);
    });

    it('isPaymentSelected', function() {
        $scope.prefetchData.selected_charge_code_type = 3;
        expect($scope.isPaymentSelected()).toBe(true);
    });

    it('isTouristTaxSelected', function() {
        $scope.prefetchData.selected_charge_code_type = 4;
        expect($scope.isTouristTaxSelected()).toBe(true);
    });

    it('Hide Add Tax Option for Tax, Payment and Tourist Tax', function() {
        $scope.prefetchData.selected_charge_code_type = 3;
        expect($scope.shouldHideAddTaxOption()).toBe(true);
    });
});
