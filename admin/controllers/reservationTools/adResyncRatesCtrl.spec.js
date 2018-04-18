describe('ADResyncRatesCtrl', function() {

    var $controller,
        $scope = {},
        $rootScope = {},
        ADReservationToolsSrv,
        $q;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADReservationToolsSrv_, _$q_ ) {
            $controller = _$controller_;
            ADReservationToolsSrv = _ADReservationToolsSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_.$new();
        });

        $controller('ADResyncRatesCtrl', {
            $scope: $scope
        });
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
        // Having following error :
        // https://code.angularjs.org/1.6.1/docs/error/$rootScope/infdig?p0=10&p1=%5B%5D

        /*it('Search query with query length > 2', function() {
            $scope.textInQueryBox = 'rate';

            spyOn(ADReservationToolsSrv, 'searchRates').and.callFake(function () {
                var deferred = $q.defer(),
                    response = {
                        results : [ 
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

                deferred.resolve(response);
                return deferred.promise;
            });
            
            $rootScope.$apply();

            $scope.searchQuery();

            expect($scope.rateListResult).toEqual(response.results);
        });*/

        it('Search query with query length < 3', function(){
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
