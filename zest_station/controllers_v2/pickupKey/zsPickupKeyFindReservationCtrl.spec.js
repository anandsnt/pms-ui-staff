describe('zsPickupKeyFindReservationCtrl', function() {

    var $controller,
        $scope = {},
        zsCheckoutSrv,
        zsGeneralSrv,
        $q,
        $state;


    beforeEach(function() {

        module('sntZestStation', function($provide) {
            $provide.value('zsEventConstants', {});
        });

        inject(function(_$controller_, _$rootScope_, _$q_, _zsCheckoutSrv_, _zsGeneralSrv_, _$state_) {
            $controller = _$controller_;
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

        // Root controller methods
        angular.extend($scope, {
            zestStationData: {
                sessionActivity: [],
                idle_timer: {},
                paymentGateway: 'MLI',
                hotelSettings: {
                    mli_cba_enabled: false
                }
            },
            reservationHasPassportsScanned: function() {
                return;
            }
        });

        $scope.errorMessage = '';

        $controller('zsPickupKeyFindReservationCtrl', {
            $scope: $scope
        });

        angular.extend($scope, {
            trackEvent: function() {
                return;
            }
        });

    });

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

        it('if the last name and no rooom number are entered and next button is clicked, go to room number entry mode', function() {
            $scope.reservationParams.room_no = '';
            $scope.lastNameEntered();
            expect($scope.mode).toBe('ROOM_NUMBER_ENTRY');
        });

        describe('On retrying the last name or entering room number, search for the reservation', function() {

            describe('Reservation is checked in and has CC', function() {
                beforeEach(function() {
                    spyOn(zsCheckoutSrv, 'findReservation').and.callFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve({
                            'is_checked_in': true,
                            'guest_arriving_today': true,
                            'has_cc': true
                        });
                        return deferred.promise;
                    });
                });

                afterEach(function() {
                    $scope.$digest();
                    expect(zsCheckoutSrv.findReservation).toHaveBeenCalled();
                    expect($scope.mode).toBe('CC_OPTIONS');
                });

                it('On entering the last name in retry mode, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });

                it('On entering the room number, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.roomNumberEntered();
                });
            });

            describe('Reservation is checked in, but doesn\'t has CC', function() {
                beforeEach(function() {
                    spyOn(zsCheckoutSrv, 'findReservation').and.callFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve({
                            'is_checked_in': true,
                            'guest_arriving_today': true,
                            'has_cc': false
                        });
                        return deferred.promise;
                    });
                });

                afterEach(function() {
                    $scope.$digest();
                    expect(zsCheckoutSrv.findReservation).toHaveBeenCalled();
                    expect($scope.mode).toBe('NO_CC_ON_FILE');
                });

                it('On entering the last name in retry mode, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });

                it('On entering the room number, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.roomNumberEntered();
                });

            });

            describe('Reservation is not checked in and is not arrivay today', function() {

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

                it('On entering the last name in retry mode, go to no match found mode', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });

                it('On entering the room number, go to no match found mode', function() {
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

                it('On entering the last name in retry mode, go to screen to enter CC last 4 digits', function() {
                    $scope.reservationParams.room_no = '101';
                    $scope.lastNameEntered();
                });

                it('On entering the room number, go to screen to enter CC last 4 digits', function() {
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


        describe('Validate CC succes', function() {
            beforeEach(function() {
                spyOn(zsCheckoutSrv, 'validateCC').and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve();
                    return deferred.promise;
                });
                spyOn($state, 'go');
            });

            it('On CC validation succes, if the reservation is not checked in, go to checkin flow', function() {

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

                $scope.reservationData = {
                    is_checked_in: false,
                    guest_arriving_today: true
                };
                $scope.zestStationData.check_in_collect_passport = false;
                $scope.validateCConFile();
                $scope.$digest();
                expect($state.go).toHaveBeenCalledWith('zest_station.checkInReservationDetails', jasmine.any(Object));
            });

            it('On CC validation succes, if the ID scan is turned OFF, go to key creation screen', function() {

                $scope.reservationData = {
                    is_checked_in: true,
                    guest_arriving_today: true
                };
                $scope.zestStationData.check_in_collect_passport = false;
                $scope.validateCConFile();
                $scope.$digest();
                expect($state.go).toHaveBeenCalledWith('zest_station.pickUpKeyDispense', jasmine.any(Object));
            });

            describe('On CC validation succes', function() {
                beforeEach(function() {
                    spyOn(zsGeneralSrv, 'fetchGuestDetails').and.callFake(function() {
                        var deferred = $q.defer();

                        deferred.resolve({
                            "primary_guest_details": {
                                "is_passport_present": false,
                                "guest_id_reviewed": false
                            },
                            "accompanying_guests_details": []
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

                    $scope.reservationData = {
                        is_checked_in: true,
                        guest_arriving_today: true
                    };
                });


                it('On CC validation succes, if the ID scan is turned ON, go to ID scan screen', function() {
                    $scope.zestStationData.check_in_collect_passport = true;
                    $scope.validateCConFile();
                    $scope.$digest();
                    expect($state.go).toHaveBeenCalledWith('zest_station.checkInScanPassport', jasmine.any(Object));
                });
                it('On CC validation succes, if the Manul ID scan is turned ON, go to Manual ID scan screen', function() {
                    $scope.zestStationData.check_in_collect_passport = false;
                    $scope.zestStationData.kiosk_manual_id_scan = true;
                    $scope.validateCConFile();
                    $scope.$digest();
                    expect($state.go).toHaveBeenCalledWith('zest_station.checkInIdVerification', jasmine.any(Object));
                });
            });

            it('On CC validation succes, if the Manual ID scan is turned ON and ID was already verified, go to key creation screen', function() {
                spyOn(zsGeneralSrv, 'fetchGuestDetails').and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve({
                        "primary_guest_details": {
                            "is_passport_present": false,
                            "guest_id_reviewed": true
                        },
                        "accompanying_guests_details": []
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

                $scope.reservationData = {
                    is_checked_in: true,
                    guest_arriving_today: true
                };
                $scope.zestStationData.check_in_collect_passport = false;
                $scope.zestStationData.kiosk_manual_id_scan = true;
                $scope.validateCConFile();
                $scope.$digest();
                expect($state.go).toHaveBeenCalledWith('zest_station.pickUpKeyDispense', jasmine.any(Object));
            });

        });
    });
    
    describe('Add new CC', function() {

        it('On clicking Add new card, set mainScreenMode as PAYMENT_IN_PROGRESS and call payUsingNewCard inside zsPaymentCtrl', function() {
            spyOn($scope, 'payUsingNewCard');
            $scope.useNewCard();
            expect($scope.mainScreenMode).toBe('PAYMENT_IN_PROGRESS');
            expect($scope.payUsingNewCard).toHaveBeenCalled();
        });

        it('On card Add failure, change mainScreenMode to PAYMENT_FAILED', function() {
            $scope.$emit('PAYMENT_FAILED');
            expect($scope.mainScreenMode).toBe('PAYMENT_FAILED');
        });

    });
});