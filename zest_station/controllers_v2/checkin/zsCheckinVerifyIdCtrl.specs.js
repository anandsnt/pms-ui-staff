describe('zsCheckinVerifyIdCtrl', function() {

    var $controller,
        $state,
        $stateParams,
        $scope = {},
        $rootScope,
        zsGeneralSrv,
        zsCheckinSrv,
        $q;

    beforeEach(function() {
        module('sntZestStation');
        inject(function(_$controller_, _$rootScope_, _$state_, _$stateParams_, _zsGeneralSrv_, _$q_, _zsCheckinSrv_) {
            $q = _$q_;
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $state = _$state_;
            $scope = $rootScope.$new();
            zsGeneralSrv = _zsGeneralSrv_;
            $stateParams = _$stateParams_;
            $stateParams.params = "{}";
            zsCheckinSrv = _zsCheckinSrv_;
        });
        $controller('zsCheckinVerifyIdCtrl', {
            $scope: $scope
        });
    });

    it('On entering guest ID verification, screen mode has to be Wait for Staff', function() {
        expect($scope.screenMode).toEqual('WAIT_FOR_STAFF');
    });

    it('On clicking admim verify, change mode to enter PIN', function() {
        $scope.adminVerify();
        expect($scope.screenMode).toEqual('ADMIN_PIN_ENTRY');
    });

    describe('Admin verification', function() {
        beforeEach(function() {
            $scope.adminVerify();
            $scope.adminPin = '12'
        });
        it('On Admin verification failure, change mode to PIN error', function() {
            spyOn(zsGeneralSrv, 'verifyStaffByPin').and.callFake(function() {
                var deferred = $q.defer();

                deferred.reject({});
                return deferred.promise;
            });
            $scope.goToNext();
            $scope.$digest();
            expect($scope.screenMode).toEqual('PIN_ERROR');
        });

        it('On Admin verification success, change mode to guest list', function() {
            spyOn(zsGeneralSrv, 'verifyStaffByPin').and.callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({});
                return deferred.promise;
            });
            $scope.goToNext();
            $scope.$digest();
            expect($scope.screenMode).toEqual('GUEST_LIST');
        });
    });



    it('On continuing with any one pending guest ID verification, show warning', function() {
        $scope.selectedReservation = {
            guest_details: [{
                'id': 1,
                'guest_type': 'ADULT',
                'first_name': '',
                'last_name': '',
                'review_status': '1'
            }, {
                'id': 2,
                'guest_type': 'ADULT',
                'first_name': '',
                'last_name': '',
            }]
        };
        $scope.continueToNextScreen();
        expect($scope.showWarningPopup).toEqual(true);
    });

    it('On continuing without any pending guest ID verification, proceed to loging', function() {
        spyOn(zsGeneralSrv, 'recordIdVerification').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.selectedReservation = {
            guest_details: [{
                'id': 1,
                'guest_type': 'ADULT',
                'first_name': '',
                'last_name': '',
                'review_status': '1'
            }, {
                'id': 2,
                'guest_type': 'ADULT',
                'first_name': '',
                'review_status': '2'
            }]
        };
        $scope.continueToNextScreen();
        expect(zsGeneralSrv.recordIdVerification).toHaveBeenCalled();
    });

    it('On proceeding after accepting even on seeing the warning, proceed to loging', function() {
        spyOn(zsGeneralSrv, 'recordIdVerification').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.selectedReservation = {
            guest_details: [{
                'id': 1,
                'guest_type': 'ADULT',
                'first_name': '',
                'last_name': '',
                'review_status': '1'
            }, {
                'id': 2,
                'guest_type': 'ADULT',
                'first_name': '',
                'last_name': '',
            }]
        };
        $scope.acceptWithoutID();
        expect(zsGeneralSrv.recordIdVerification).toHaveBeenCalled();
    });
});