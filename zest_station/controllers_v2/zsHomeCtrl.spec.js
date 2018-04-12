describe('zsHomeCtrl', function() {

    var $controller,
        $state,
        $scope = {},
        $rootScope;

    beforeEach(function() {
        module('sntZestStation', function($provide) {
            $provide.value('languages', function() {
                return [];
            });
            $provide.value('zestStationSettings', function() {
                return {};
            });
        });
        inject(function(_$controller_, _$rootScope_, _$state_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $state = _$state_;
            $scope = $rootScope.$new();
        });

        // the scope variable zestStationData and two functions are in zsRootCtrl, so we have to extend 
        // our scope with those
        angular.extend($scope, {
            'zestStationData': {},
            'setScreenIcon': function() {
                return false;
            },
            'trackEvent': function() {
                return false;
            }
        });
        $controller('zsHomeCtrl', {
            $scope: $scope
        });
        spyOn($state, 'go');
    });

    describe('clickedOnPickUpKey', function() {
        beforeEach(function() {
            $scope.zestStationData = {};
        });
        it('if the setting is manual, go to manual key pickup state', function() {
            $scope.zestStationData.kiosk_key_creation_method = 'manual';
            $scope.clickedOnPickUpKey();
            expect($state.go).toHaveBeenCalledWith('zest_station.manualKeyPickup', {
                mode: 'PICKUP_KEY'
            });
        });
        it('if the setting is QR scan, go to QR scan state', function() {
            $scope.zestStationData.pickup_qr_scan = true;
            $scope.clickedOnPickUpKey();
            expect($state.go).toHaveBeenCalledWith('zest_station.qrPickupKey');
        });
        it('if the setting is neither manual nor QR scan, go to find reservation state', function() {
            $scope.zestStationData.kiosk_key_creation_method = '';
            $scope.zestStationData.pickup_qr_scan = false;
            $scope.clickedOnPickUpKey();
            expect($state.go).toHaveBeenCalledWith('zest_station.checkOutReservationSearch', {'mode': 'PICKUP_KEY'});
        });
    });
});
