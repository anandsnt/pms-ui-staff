describe('zsCheckoutKeyCardActionsCtrl', function() {

    var $controller,
        $scope = {},
        zsPaymentSrv,
        zsModeConstants,
        zsEventConstants,
        $q,
        $state;

    beforeEach(function() {
        module('sntZestStation', function($provide) {
            $provide.value('zsEventConstants', {
                'SHOW_BACK_BUTTON': 'Show_back_button',
                'HIDE_BACK_BUTTON': 'Hide_back_button',
                'SHOW_CLOSE_BUTTON': 'Show_close_button',
                'HIDE_CLOSE_BUTTON': 'Hide_close_button'
            });
            $provide.value('zsModeConstants', {
                'CHECKIN_MODE': 'CheckinMode',
                'CHECKOUT_MODE': 'CheckoutMode',
                'PICKUP_KEY_MODE': 'PickupKeyMode'
            });
        });
        inject(function(_$controller_, _zsPaymentSrv_, _zsModeConstants_, _$state_, _$rootScope_, _$q_, _zsEventConstants_) {
            $controller = _$controller_;
            zsPaymentSrv = _zsPaymentSrv_;
            zsModeConstants = _zsModeConstants_;
            $scope = _$rootScope_.$new();
            $state = _$state_;
            $q = _$q_;
            zsEventConstants = _zsEventConstants_;
        });

        angular.extend($scope, {
            zestStationData: {},
            socketOperator: {
                returnWebSocketObject: function() {
                    return {
                        readyState: 1
                    };
                },
                InsertKeyCard: function(){
                    return;
                }
            }
        });

        $controller('zsCheckoutKeyCardActionsCtrl', {
            $scope: $scope
        });
    });

    it('On choosing captureKey, go to checkout reservation search by key card look up', function() {
        spyOn($state, 'go');
        $scope.alreadyCheckedOutActions();
        expect($state.go).toHaveBeenCalledWith('zest_station.home');
    });

    it('On failure and on choosing the reservation search, go to reservation search screen', function() {
        spyOn($state, 'go');
        $scope.searchByName();
        expect($state.go).toHaveBeenCalledWith('zest_station.checkOutReservationSearch');
    });

    it('On back button clicking, go to checkout search options screen', function(){
        spyOn($state, 'go');
        $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
        expect($state.go).toHaveBeenCalledWith('zest_station.checkoutSearchOptions');
    });
});