describe('zsHomeCtrl', function() {

    var $controller,
        $state,
        $scope = {};

    beforeEach(function() {
        module('sntZestStation');

        inject(function(_$controller_, _$rootScope_, _$state_) {
            $controller = _$controller_;
            $state = _$state_;
            $scope = _$rootScope_.$new();
        });
        $controller('zsHomeCtrl', {
            $scope: $scope
        });
        spyOn($state, 'go');
    });

    it('Based on key pickup setting, go to the corresponding state', function() {


        // inject(function (_zsCheckinSrv_, _languages_) {
        //     zsCheckinSrv = _zsCheckinSrv_;
        //     languages = _languages_;
        // });

    	$scope.zestStationData.kiosk_key_creation_method = 'manual';
         console.log("===========================");
         console.log(zsCheckinSrv);
         console.log(languages);
        console.log($scope);
        // $scope.clickedOnPickUpKey();
        // expect($state.go).toHaveBeenCalledWith('zest_station.manualKeyPickup');
        // $scope.zestStationData.pickup_qr_scan = true;
        // $scope.clickedOnPickUpKey();
        // expect($state.go).toHaveBeenCalledWith('zest_station.qrPickupKey');
        // $scope.zestStationData.kiosk_key_creation_method = '';
        // $scope.zestStationData.pickup_qr_scan = false;
        // expect($state.go).toHaveBeenCalledWith('zest_station.checkOutReservationSearch');
    });


});
