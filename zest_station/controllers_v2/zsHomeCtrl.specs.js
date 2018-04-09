describe('zsHomeCtrl', function() {

    var $controller,
        $state,
        $scope = {},
        languages,
        $rootScope,
        zestStationSettings;

    beforeEach(function() {
        module('sntZestStation', function($provide) {
            $provide.value('languages', function() {return [];});
            $provide.value('zestStationSettings', function() {return {};});
        });

        inject(function(_$controller_, _$rootScope_, _$state_, _languages_, _zestStationSettings_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $state = _$state_;
            $scope.zestStationSettings = _zestStationSettings_;
            languages = _languages_;

        });

        $scope = $rootScope.$new();

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

    it('Based on key pickup setting, go to the corresponding state', function() {

        $scope.zestStationData = {};
        $scope.zestStationData.kiosk_key_creation_method = 'manual';
        $scope.clickedOnPickUpKey();
        expect($state.go).toHaveBeenCalledWith('zest_station.manualKeyPickup');
        $scope.zestStationData.pickup_qr_scan = true;
        $scope.clickedOnPickUpKey();
        expect($state.go).toHaveBeenCalledWith('zest_station.qrPickupKey');
        $scope.zestStationData.kiosk_key_creation_method = '';
        $scope.zestStationData.pickup_qr_scan = false;
        expect($state.go).toHaveBeenCalledWith('zest_station.checkOutReservationSearch');
    });


});
