describe('zsCheckinLoyaltyCtrl', function() {

    var $controller,
        $timeout,
        $scope = {},
        zsCheckinSrv,
        zsGeneralSrv,
        $rootScope,
        $q,
        deferred;

    beforeEach(function() {
        module('sntZestStation');
        inject(function(_$controller_, _$rootScope_, _$timeout_, _zsCheckinSrv_, _zsGeneralSrv_, _$q_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            zsGeneralSrv = _zsGeneralSrv_;
            zsCheckinSrv = _zsCheckinSrv_;
            $q = _$q_;
        });

        $controller('zsCheckinLoyaltyCtrl', {
            $scope: $scope
        });
        deferred = $q.defer();
        $scope.selectedReservation = {
            id: 123,
            guest_details: [{
                id: 321
            }]
        };
    });

    describe('On emiting FETCH_USER_MEMBERSHIPS from reservation details', function() {
        it('call fetchUserMemberships API and if no programs are present change loyaltyMode to ADD_NEW_LOYALTY', function() {
            spyOn(zsCheckinSrv, 'fetchUserMemberships').and.callFake(function() {
                var respone = {
                    hotelLoyaltyProgram: [],
                    frequentFlyerProgram: []
                };

                deferred.resolve(respone);
                return deferred.promise;
            });

            $scope.$emit('FETCH_USER_MEMBERSHIPS');
            $scope.$digest();
            expect(zsCheckinSrv.fetchUserMemberships).toHaveBeenCalledWith(jasmine.any(Object));
            expect($scope.loyaltyMode).toEqual('ADD_NEW_LOYALTY');
        });

        it('call fetchUserMemberships API and if there are existing programs, change loyaltyMode to SELECT_LOYALTY', function() {
            spyOn(zsCheckinSrv, 'fetchUserMemberships').and.callFake(function() {
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
            expect(zsCheckinSrv.fetchUserMemberships).toHaveBeenCalledWith(jasmine.any(Object));
            expect($scope.loyaltyMode).toEqual('SELECT_LOYALTY');
        });
    });

    it('On skipiping loyalties, call next page actions', function() {
        spyOn($scope, '$emit');
        $scope.skipLoyalties();
        expect($scope.$emit).toHaveBeenCalledWith('NAVIGATE_FROM_LOYALTY_SCREEN');
    });

    it('On selecting existing loyalties, if only one loyalty is present, call API to add that to the reservation', function() {
        spyOn(zsCheckinSrv, 'setLoyaltyForReservation').and.callFake(function() {
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
        expect(zsCheckinSrv.setLoyaltyForReservation).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('On selecting existing loyalties, if more than one loyalty is present, change loyaltyMode to SELECT_FROM_MULTIPLE_LOYALTIES', function() {
        spyOn(zsCheckinSrv, 'setLoyaltyForReservation').and.callFake(function() {
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
});