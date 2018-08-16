describe('zsCheckinLoyaltyCtrl', function() {

    var $controller,
        $timeout,
        $scope = {},
        zsCheckinLoyaltySrv,
        zsGeneralSrv,
        $rootScope,
        $q,
        zsEventConstants,
        deferred;

    beforeEach(function() {
        module('sntZestStation');
        inject(function(_$controller_, _$rootScope_, _$timeout_, _zsCheckinLoyaltySrv_, _zsGeneralSrv_, _$q_ , _zsEventConstants_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            zsGeneralSrv = _zsGeneralSrv_;
            zsCheckinLoyaltySrv = _zsCheckinLoyaltySrv_;
            $q = _$q_;
            zsEventConstants = _zsEventConstants_;
        });
        deferred = $q.defer();
        $scope.selectedReservation = {
            id: 123,
            guest_details: [{
                id: 321
            }]
        };
        $controller('zsCheckinLoyaltyCtrl', {
            $scope: $scope
        });
    });

    describe('On emiting FETCH_USER_MEMBERSHIPS from reservation details', function() {
        it('Call fetchUserMemberships API and change loyaltyMode to SELECT_LOYALTY', function() {
            spyOn(zsCheckinLoyaltySrv, 'fetchUserMemberships').and.callFake(function() {
                var respone = {
                    "frequentFlyerProgram": [{
                        "id": 1975,
                        "membership_type": "AF",
                        "membership_card_number": "2e2e",
                        "membership_level": ""
                    }],
                    "hotelLoyaltyProgram": []
                };

                deferred.resolve(respone);
                return deferred.promise;
            });
            $scope.$emit('FETCH_USER_MEMBERSHIPS');
            $scope.$digest();
            expect(zsCheckinLoyaltySrv.fetchUserMemberships).toHaveBeenCalledWith(jasmine.any(Object));
            expect($scope.loyaltyMode).toEqual('SELECT_LOYALTY');
            expect($scope.existingLoyaltyPgms.length).toEqual(1);
        });

        it('On fetchUserMemberships API failure, change loyaltyMode to SELECT_LOYALTY with no existing program to choose', function() {
            spyOn(zsCheckinLoyaltySrv, 'fetchUserMemberships').and.callFake(function() {
                deferred.reject({});
                return deferred.promise;
            });
            $scope.$emit('FETCH_USER_MEMBERSHIPS');
            $scope.$digest();
            expect(zsCheckinLoyaltySrv.fetchUserMemberships).toHaveBeenCalledWith(jasmine.any(Object));
            expect($scope.loyaltyMode).toEqual('SELECT_LOYALTY');
            expect($scope.existingLoyaltyPgms.length).toEqual(0);
        });
    });

    describe('Back button Actions', function() {
        it('On navigating back from SELECT_LOYALTY, emit event CHANGE_MODE_TO_RESERVATION_DETAILS', function(){
            spyOn($scope, '$emit');
            $scope.loyaltyMode = 'SELECT_LOYALTY'; 
            $scope.$broadcast('LOYALTY_PROGRAMS_BACK_NAVIGATIONS');
            $scope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith('CHANGE_MODE_TO_RESERVATION_DETAILS');
        });
        it('On navigating back from ADD_NEW_FF_LOYALTY or ADD_HOTEL_LOYALTY, change loyaltyMode to ADD_NEW_LOYALTY', function(){
            spyOn($scope, '$emit');
            $scope.loyaltyMode = 'ADD_NEW_FF_LOYALTY'; 
            $scope.$broadcast('LOYALTY_PROGRAMS_BACK_NAVIGATIONS');
            expect($scope.loyaltyMode).toEqual('ADD_NEW_LOYALTY');
        });
        it('On navigating back from ADD_NEW_LOYALTY, change loyaltyMode to SELECT_LOYALTY', function(){
            spyOn($scope, '$emit');
            $scope.loyaltyMode = 'ADD_NEW_LOYALTY'; 
            $scope.$broadcast('LOYALTY_PROGRAMS_BACK_NAVIGATIONS');
            expect($scope.loyaltyMode).toEqual('SELECT_LOYALTY');
        });
    });

    it('On skipiping loyalties, call next page actions', function() {
        spyOn($scope, '$emit');
        $scope.skipLoyalties();
        expect($scope.$emit).toHaveBeenCalledWith('NAVIGATE_FROM_LOYALTY_SCREEN');
    });

    it('On selecting existing loyalties, if only one loyalty is present, call API to add that to the reservation', function() {
        spyOn(zsCheckinLoyaltySrv, 'setLoyaltyForReservation').and.callFake(function() {
            deferred.resolve({});
            return deferred.promise;
        });
        $scope.existingLoyaltyPgms = [{
            "id": 1975,
            "membership_type": "AF",
            "membership_card_number": "S###",
            "membership_level": ""
        }];
        $scope.selectExistingLoyalty();
        $scope.$digest();
        expect(zsCheckinLoyaltySrv.setLoyaltyForReservation).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('On selecting existing loyalties, if more than one loyalty is present, change loyaltyMode to SELECT_FROM_MULTIPLE_LOYALTIES', function() {
        spyOn(zsCheckinLoyaltySrv, 'setLoyaltyForReservation').and.callFake(function() {
            deferred.resolve({});
            return deferred.promise;
        });
        $scope.existingLoyaltyPgms = [{
            "id": 1975,
            "membership_type": "AF",
            "membership_card_number": "3RTTTT",
            "membership_level": ""
        }, {
            "id": 1976,
            "membership_type": "AF",
            "membership_card_number": "2XXXX",
            "membership_level": ""
        }];
        $scope.selectExistingLoyalty();
        expect($scope.loyaltyMode).toEqual('SELECT_FROM_MULTIPLE_LOYALTIES');
    });

    describe('Test pagination', function() {
        beforeEach(function() {
            $scope.existingLoyaltyPgms = [{
                "id": 1975,
                "membership_type": "AF",
                "membership_card_number": "3RTTTT",
                "membership_level": ""
            }, {
                "id": 1976,
                "membership_type": "AF",
                "membership_card_number": "2XXXX",
                "membership_level": ""
            }, {
                "id": 1977,
                "membership_type": "AF",
                "membership_card_number": "3RTTTT",
                "membership_level": ""
            }, {
                "id": 1978,
                "membership_type": "AF",
                "membership_card_number": "2XXXX",
                "membership_level": ""
            }, {
                "id": 1979,
                "membership_type": "AF",
                "membership_card_number": "3RTTTT",
                "membership_level": ""
            }, {
                "id": 1980,
                "membership_type": "AF",
                "membership_card_number": "2XXXX",
                "membership_level": ""
            }];
            $scope.pageData = {
                disableNextButton: false,
                disablePreviousButton: false,
                pageStartingIndex: 1,
                pageEndingIndex: '',
                viewableItems: [],
                pageNumber: 1
            };
        });
        it('On clicking Next page with a 5 item per page, show 1 item in second page', function() {
            spyOn(zsGeneralSrv, 'proceesPaginationDetails').and.callThrough();
            $scope.viewNextPage();
            // flush timeout(s) for all code under test.
            $timeout.flush();
            // this will throw an exception if there are any pending timeouts.
            $timeout.verifyNoPendingTasks();
            expect($scope.pageData.viewableItems.length).toEqual(1);
        });

        it('On clicking Previous page from second page of a total to 6 items, show 5 items in first page', function() {
            $scope.pageData.pageNumber = 2;
            spyOn(zsGeneralSrv, 'proceesPaginationDetails').and.callThrough();
            $scope.viewPreviousPage();
            // flush timeout(s) for all code under test.
            $timeout.flush();
            // this will throw an exception if there are any pending timeouts.
            $timeout.verifyNoPendingTasks();
            expect($scope.pageData.viewableItems.length).toEqual(5);
        });
    });

    

    it('On clicking Add new loyalty, change loyaltyMode to ADD_NEW_LOYALTY', function() {
        $scope.addNewLoyalty();
        expect($scope.loyaltyMode).toEqual('ADD_NEW_LOYALTY');
    });

    it('On clicking Add new Frequent Flyer loyalty, change loyaltyMode to ADD_NEW_FF_LOYALTY', function() {
        spyOn(zsCheckinLoyaltySrv, 'getAvailableFreaquentFlyerLoyaltyPgms').and.callFake(function() {
            deferred.resolve({});
            return deferred.promise;
        });
        $scope.addFreaquentFlyerLoyalty();
        $scope.$digest();
        expect($scope.loyaltyMode).toEqual('ADD_NEW_FF_LOYALTY');
    });

    it('On clicking Add new Hotel Loyalty, change loyaltyMode to ADD_HOTEL_LOYALTY', function() {
        spyOn(zsCheckinLoyaltySrv, 'getAvailableHotelLoyaltyPgms').and.callFake(function() {
            deferred.resolve({});
            return deferred.promise;
        });
        $scope.addHotelLoyalty();
        $scope.$digest();
        expect($scope.loyaltyMode).toEqual('ADD_HOTEL_LOYALTY');
    });

    describe('Call save loyalty API', function() {
        beforeEach(function() {
            spyOn(zsCheckinLoyaltySrv, 'saveLoyaltyPgm').and.callFake(function() {
                deferred.resolve({});
                return deferred.promise;
            });
        });
        it('On clicking save Freaquent flyer program, call API to save loyalty', function() {
            $scope.ffLoyalty = {
                id: '',
                code: ''
            };
            $scope.saveFFLoyalty();
            $scope.$digest();
            expect(zsCheckinLoyaltySrv.saveLoyaltyPgm).toHaveBeenCalledWith(jasmine.any(Object));
        });


        it('On clicking save Hotel loyalty program, call API to save loyalty', function() {
            $scope.hotelLoyalty = {
                id: '',
                code: '',
                level: '',
                selectedLoyalty: {}
            };
            $scope.saveHotelLoyalty();
            $scope.$digest();
            expect(zsCheckinLoyaltySrv.saveLoyaltyPgm).toHaveBeenCalledWith(jasmine.any(Object));
        });
    });

    it('On save loyalty API failure, change loyaltyMode to ADD_NEW_LOYALTY_FAILED', function() {
        spyOn(zsCheckinLoyaltySrv, 'saveLoyaltyPgm').and.callFake(function() {
            deferred.reject(['Membership type has already been taken']);
            return deferred.promise;
        });
        $scope.hotelLoyalty = {
            id: '',
            code: '',
            level: '',
            selectedLoyalty: {}
        };
        $scope.saveHotelLoyalty();
        $scope.$digest();
        expect($scope.loyaltyMode).toEqual('ADD_NEW_LOYALTY_FAILED');
        expect($scope.errorMessage).toEqual('Membership already taken');

    });
});