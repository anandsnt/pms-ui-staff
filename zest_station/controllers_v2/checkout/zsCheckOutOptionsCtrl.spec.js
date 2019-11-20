describe('zsCheckOutOptionsCtrl', function() {

    var $controller,
        $scope = {},
        zsPaymentSrv,
        zsStateHelperSrv,
        zsEventConstants,
        $q,
        $state;

    beforeEach(function() {
        module('sntZestStation', function($provide) {
            $provide.value('zsEventConstants', {});
        });
        inject(function(_$controller_, _zsPaymentSrv_, _zsStateHelperSrv_, _$state_, _$rootScope_, _$q_, _zsEventConstants_) {
            $controller = _$controller_;
            zsPaymentSrv = _zsPaymentSrv_;
            zsStateHelperSrv = _zsStateHelperSrv_;
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $q = _$q_;
            zsEventConstants = _zsEventConstants_;
        });
        $controller('zsCheckOutOptionsCtrl', {
            $scope: $scope
        });
        spyOn($state, 'go');
    });

    it('On clicking back button, go to Home screen', function() {
        $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
        expect($state.go).toHaveBeenCalledWith('zest_station.home');
    });

    it('On choosing search by name, go to checkout reservation search screen', function() {
        $scope.searchByName();
        expect($state.go).toHaveBeenCalledWith('zest_station.checkOutReservationSearch');
    });

    it('On choosing captureKey, go to checkout reservation search by key card look up', function() {
        $scope.captureKey();
        expect($state.go).toHaveBeenCalledWith('zest_station.checkoutKeyCardLookUp');
    });
});