describe('zsPickupKeyFindReservationCtrl', function() {

    var $controller,
        $scope = {},
        zsCheckinSrv,
        zsCheckoutSrv,
        zsGeneralSrv,
        $q,
        $state;

    beforeEach(function() {

        module('sntZestStation', function($provide) {
            $provide.value('zsEventConstants', {});
        });

        inject(function(_$controller_, _$rootScope_, _zsCheckinSrv_, _$q_, _zsCheckoutSrv_, _zsGeneralSrv_, _$state_) {
            $controller = _$controller_;
            zsCheckinSrv = _zsCheckinSrv_;
            zsCheckoutSrv = _zsCheckoutSrv_;
            zsGeneralSrv = _zsGeneralSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
            $state = _$state_;
        });

        angular.extend($scope, {
            setScreenIcon: function() {
                return;
            },
            focusInputField: function() {
                return;
            },
            hideKeyboardIfUp: function() {
                return;
            },
            callBlurEventForIpad: function() {
                return;
            },
            resetTime: function() {
                return;
            }
        });

        $controller('zsPickupKeyFindReservationCtrl', {
            $scope: $scope
        });

        // Root controller methods
        angular.extend($scope, {
            zestStationData: {
                sessionActivity: [],
                idle_timer: {}
            },
            trackEvent: function() {
                return;
            },
            reservationHasPassportsScanned: function() {
                return;
            }
        });

        $scope.errorMessage = '';
    });

    var commonApiActions = function() {
        var deferred = $q.defer();

        deferred.resolve();
        return deferred.promise;
    };

    it('Start the screen with Last name entry Mode and the initial values are empty', function() {
        expect($scope.mode).toBe('LAST_NAME_ENTRY');
        expect($scope.reservationParams.last_name).toBe('');
        expect($scope.reservationParams.room_no).toBe('');
        expect($scope.creditCardNumber).toBe('');
    });

    describe('Find reservation', function() {
        beforeEach(function() {
            $scope.reservationParams.last_name = 'test';
        });

        it('if the last name is entered and no rooom number is entered and then if next is clicked, go to room number entry mode', function() {
            $scope.reservationParams.room_no = '';
            $scope.lastNameEntered();
            expect($scope.mode).toBe('ROOM_NUMBER_ENTRY');
        });

        describe('On retrying the last name or entering room number and on clicking next, search for the reservation', function() {

            describe('Reservation is checked in', function() {
                beforeEach(function() {
                    spyOn(zsCheckoutSrv, 'findReservation').and.callFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve({
                            'is_checked_in': true,
                            'guest_arriving_today': true
                        });
                        return deferred.promise;
                    });
                });

                afterEach(function() {
                    $scope.$digest();
                    expect(zsCheckoutSrv.findReservation).toHaveBeenCalled();
                    expect($scope.mode).toBe('CC_ENTRY');
                });

                it('On enetering the last name in retry mode, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });
                
                it('On enetering the room number, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.roomNumberEntered();
                });
            });

            describe('Reservation not checked in and is not arrivay today', function() {

                beforeEach(function() {
                    spyOn(zsCheckoutSrv, 'findReservation').and.callFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve({
                            'is_checked_in': false,
                            'guest_arriving_today': false
                        });
                        return deferred.promise;
                    });
                });

                afterEach(function() {
                    $scope.lastNameEntered();
                    $scope.$digest();
                    expect(zsCheckoutSrv.findReservation).toHaveBeenCalled();
                    expect($scope.mode).toBe('NO_MATCH');
                });

                it('On enetering the last name in retry mode, go to no match found mode', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });

                it('On enetering the room number, go to no match found mode', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.roomNumberEntered();
                });
            });

            describe('No Reservation found', function() {

                beforeEach(function() {
                    spyOn(zsCheckoutSrv, 'findReservation').and.callFake(function() {
                        var deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                });

                afterEach(function() {
                    $scope.$digest();
                    expect(zsCheckoutSrv.findReservation).toHaveBeenCalled();
                    expect($scope.mode).toBe('NO_MATCH');
                });

                it('On enetering the last name in retry mode, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });

                it('On enetering the room number, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.roomNumberEntered();
                });
            });

        });

        describe('Retry reservation search', function() {
            it('On retrying with last name, chage mode to last name entry', function() {
                $scope.reEnterText('last_name');
                expect($scope.mode).toBe('LAST_NAME_ENTRY');
            });
            it('On retrying with room number, chage mode to room number entry', function() {
                $scope.reEnterText('room');
                expect($scope.mode).toBe('ROOM_NUMBER_ENTRY');
            });
        });
    });

    describe('Validate CC', function() {
        it('On CC validation failure, go to CC match failed mode', function() {
            spyOn(zsCheckoutSrv, 'validateCC').and.callFake(function() {
                var deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
            $scope.validateCConFile();
            $scope.$digest();
            expect($scope.mode).toBe('CC_MATCH_FAILED');
        });

        it('On CC validation succes and if passport scan is turned OFF, go to key creation screen', function() {

            spyOn(zsCheckoutSrv, 'validateCC').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });

            spyOn($state, 'go');

            $scope.reservationData = {
                is_checked_in: true,
                guest_arriving_today: true
            };
            $scope.zestStationData.check_in_collect_passport = false;
            $scope.validateCConFile();
            $scope.$digest();
            expect($state.go).toHaveBeenCalledWith('zest_station.pickUpKeyDispense', jasmine.any(Object));
        });

        it('On CC validation succes and if passport scan is turned ON, go to passport scan screen', function() {

            spyOn(zsCheckoutSrv, 'validateCC').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });

            spyOn(zsGeneralSrv, 'fetchGuestDetails').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve({
                    'reservation_id': 123
                });
                return deferred.promise;
            });

            spyOn(zsGeneralSrv, 'fetchCheckinReservationDetails').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve({
                    'results': []
                });
                return deferred.promise;
            });

            spyOn($state, 'go');

            $scope.reservationData = {
                is_checked_in: true,
                guest_arriving_today: true
            };

            $scope.zestStationData.check_in_collect_passport = true;
            $scope.validateCConFile();
            $scope.$digest();
            expect($state.go).toHaveBeenCalledWith('zest_station.checkInScanPassport', jasmine.any(Object));
        });


        it('On CC validation succes, if reservation is not checked in, go to checkin flow', function() {

            spyOn(zsCheckoutSrv, 'validateCC').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });

            spyOn(zsGeneralSrv, 'fetchCheckinReservationDetails').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve({
                    'results': [{
                        'guest_details': [{
                            'is_primary': true
                        }]
                    }]
                });
                return deferred.promise;
            });

            spyOn($state, 'go');

            $scope.reservationData = {
                is_checked_in: false,
                guest_arriving_today: true
            };
            $scope.zestStationData.check_in_collect_passport = false;
            $scope.validateCConFile();
            $scope.$digest();
            expect($state.go).toHaveBeenCalledWith('zest_station.checkInReservationDetails', jasmine.any(Object));
        });
    });
});