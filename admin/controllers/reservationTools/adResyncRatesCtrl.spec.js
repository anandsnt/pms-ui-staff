describe('ADResyncRatesCtrl', function() {

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

        $controller('ADResyncRatesCtrl', {
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

        $scope.clickedSyncButton();

        $scope.$digest();

        expect($scope.selectedRateObj.last_sync_at).toEqual("22/04/2018 23:47:03");
        expect($scope.selectedRateObj.last_sync_status).toEqual(true);
    });

    describe('Toggling of Rate Dropdown', function() {
        it('if the serach box is closed, then open it', function() {
            $scope.isActiveRateDropDown = false;
            $scope.toggleRateDropDown();
            expect($scope.isActiveRateDropDown).toBe(true);
        });
        it('if the serach box is opened, then close it', function() {
            $scope.isActiveRateDropDown = true;
            $scope.toggleRateDropDown();
            expect($scope.isActiveRateDropDown).toBe(false);
        });
    });

    describe('Search box query actions', function() {

        it('Search query with query length > 2', function() {
            $scope.textInQueryBox = 'rate';
            var response = {
                results: [ 
                    {
                        'name': 'rate1',
                        'id': 123,
                        'last_sync_date': '',
                        'last_sync_time': ''
                    },
                    {
                        'name': 'rate2',
                        'id': 125,
                        'last_sync_date': '',
                        'last_sync_time': ''
                    }
                ]
            };

            spyOn(ADReservationToolsSrv, 'searchRates').and.callFake(function () {
                var deferred = $q.defer();

                deferred.resolve(response);
                return deferred.promise;
            });
            
            $scope.searchQuery();

            $scope.$digest();

            expect($scope.rateListResult).toEqual(response.results);
        });

        it('Search query with query length < 3', function() {
            $scope.textInQueryBox = 'ra';
            expect($scope.rateListResult).toEqual([]);
        });

        it('Clear search query', function() {
            $scope.clearSearch();
            expect($scope.textInQueryBox).toBe(null);
        });
    });

    it('Clicked on Each rate', function() {
        // Dummy data for rate list.
        var results = [ 
            {
                'name': 'rate1',
                'id': 123,
                'last_sync_date': '',
                'last_sync_time': ''
            },
            {
                'name': 'rate2',
                'id': 125,
                'last_sync_date': '',
                'last_sync_time': ''
            }
        ];

        $scope.rateListResult = results;

        $scope.clickedEachRate(0);
        expect($scope.selectedRateObj).toBe(results[0]);

        $scope.clickedEachRate(1);
        expect($scope.selectedRateObj).toBe(results[1]);
    });

});
