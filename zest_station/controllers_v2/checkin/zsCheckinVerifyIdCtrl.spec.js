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
            var params = {
                'guest_email': 'r@s.com'
            };

            $stateParams.params = JSON.stringify(params);
            zsCheckinSrv = _zsCheckinSrv_;
        });
        $controller('zsCheckinVerifyIdCtrl', {
            $scope: $scope
        });
        $scope.inDemoMode = function() {
            return false;
        };
        $scope.setScreenIcon = function() {
            return false;
        };
        $scope.zestStationData = {};
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
            $scope.adminPin = '12';
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

        it('On PIN retry, change mode to enter PIN', function() {
            $scope.screenMode = 'PIN_ERROR';
            $scope.retryPinEntry();
            expect($scope.screenMode).toEqual('ADMIN_PIN_ENTRY');
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

    it('On aborting, go to Home screen', function() {
        spyOn($state, 'go');
        $scope.abortCheckin();
        expect($state.go).toHaveBeenCalledWith('zest_station.home');
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
                'last_name': ''
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
                'last_name': ''
            }]
        };
        $scope.continueToNextScreen();
        expect($scope.showWarningPopup).toEqual(true);
        $scope.acceptWithoutID();
        expect(zsGeneralSrv.recordIdVerification).toHaveBeenCalled();
    });

    it('On Cancelling, dismiss the popup', function() {
        $scope.showWarningPopup = true;
        $scope.hideWarningPopup();
        expect($scope.showWarningPopup).toEqual(false);
    });

    describe('On accepting guests with or without IDs, checkin the reservation', function() {
        beforeEach(function() {
            spyOn(zsCheckinSrv, 'checkInGuest').and.callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({});
                return deferred.promise;
            });
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
                }]
            };
            spyOn($state, 'go');
        });

        it('Should call record API and checkin API', function() {
            $scope.continueToNextScreen();
            $scope.$digest();
            expect(zsGeneralSrv.recordIdVerification).toHaveBeenCalled()
            expect(zsCheckinSrv.checkInGuest).toHaveBeenCalled();
        });

        it('If OWS messages display is turned ON, go to checkin success state', function() {
            $scope.zestStationData.is_kiosk_ows_messages_active = true;
            $scope.continueToNextScreen();
            $scope.$digest();
            expect($state.go).toHaveBeenCalledWith('zest_station.checkinSuccess', jasmine.any(Object));
        });

        it('If nationality collection is turned ON and reservation has a valid email ID, go to nationality collection', function() {
            $scope.zestStationData.is_kiosk_ows_messages_active = false;
            $scope.zestStationData.check_in_collect_nationality = true;
            $scope.continueToNextScreen();
            $scope.$digest();
            expect($state.go).toHaveBeenCalledWith('zest_station.collectNationality', jasmine.any(Object));
        });

        it('If nationality collection is turned OFF and reservation has a valid email ID, go to key collection', function() {
            $scope.zestStationData.is_kiosk_ows_messages_active = false;
            $scope.zestStationData.check_in_collect_nationality = false;
            $scope.continueToNextScreen();
            $scope.$digest();
            expect($state.go).toHaveBeenCalledWith('zest_station.checkinKeyDispense', jasmine.any(Object));
        });
    });
});