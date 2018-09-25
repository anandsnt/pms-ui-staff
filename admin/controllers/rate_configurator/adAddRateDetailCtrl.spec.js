describe('ADaddRatesDetailCtrl', function() {

    var $controller,
        $scope = {},
        ADReservationToolsSrv,
        $q;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADReservationToolsSrv_, _$q_ ) {
            $controller = _$controller_;
            ADReservationToolsSrv = _ADReservationToolsSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
        });

        angular.extend($scope, {
            rateData: {
                'id': '',
                'name': '',
                'description': '',
                'code': '',
                'based_on': {
                    'id': '',
                    'type': '',
                    'value_abs': '',
                    'value_sign': '',
                    'is_copied': false
                },
                'rate_type': {
                    'id': '',
                    'name': ''
                },
                'status': true,
                'room_type_ids': [],
                'promotion_code': '',
                'date_ranges': [],
                'addOns': [],
                'end_date': '',
                'end_date_for_display': '',
                'commission_details': {},
                'is_discount_allowed_on': true
            },
            rateInitialData: {
                hotel_settings: {
                    default_work_type: {},
                    currency: {
                        id: 1
                    }
                }
            }
        });

        $controller('ADaddRatesDetailCtrl', {
            $scope: $scope
        });

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
        $scope.init();
        $scope.clickedSyncButton();
        $scope.$digest();
        
        expect($scope.rateData.last_sync_at).toEqual("22/04/2018 23:47:03");
        expect($scope.rateData.last_sync_status).toEqual(true);
    });

});
