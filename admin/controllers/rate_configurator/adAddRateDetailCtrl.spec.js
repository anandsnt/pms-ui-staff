describe('ADaddRatesDetailCtrl', function() {

    var $controller,
        $scope = {},
        $parentScope = {},
        ADReservationToolsSrv,
        $q;

    beforeEach(function() {
        module('admin', function($provide) {
            $provide.value('rateInitialData', function() {return [];});
            //$provide.value('languageSettings', function() {return {};});
        });
        inject(function (_$controller_, _$rootScope_, _ADReservationToolsSrv_, _$q_ ) {
            $controller = _$controller_;
            ADReservationToolsSrv = _ADReservationToolsSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
        });

        $controller('ADAddnewRate', {
            $scope: $parentScope
        });

        $controller('ADaddRatesDetailCtrl', {
            $scope: angular.extend($scope, $parentScope)
        });

        $scope.rateData = { 'id': 123 };
    });

    it('Clicked on Re-Sync Rates button', function() {
        
        spyOn(ADReservationToolsSrv, 'reSyncRates').and.callFake(function () {
            var deferred = $q.defer(),
                response = {
                    last_sync_at: "22/04/2018 23:47:03",
                    last_sync_status: true
                };

            deferred.resolve(response);
            return deferred.promise;
        });

        $scope.clickedSyncButton();

        $scope.$digest();

        expect($scope.selectedRateObj.last_sync_at).toEqual("22/04/2018 23:47:03");
        expect($scope.selectedRateObj.last_sync_status).toEqual(true);
    });

});
