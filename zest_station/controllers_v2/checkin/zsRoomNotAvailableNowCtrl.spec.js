describe('zsRoomNotAvailableNowCtrl', function() {

    var $controller,
        $stateParams,
        $scope = {},
        $rootScope,
        zsGeneralSrv,
        zsCheckinSrv,
        $q;

    beforeEach(function() {
        module('sntZestStation');
        inject(function(_$controller_, _$rootScope_, _$stateParams_, _zsGeneralSrv_, _$q_, _zsCheckinSrv_) {
            $q = _$q_;
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $scope = $rootScope.$new();
            zsGeneralSrv = _zsGeneralSrv_;
            $stateParams = _$stateParams_;
            var params = {
                'guest_email': 'r@s.com',
                'reservation_id': '12234',
                'guest_id': '123'
            };

            $stateParams.params = JSON.stringify(params);
            zsCheckinSrv = _zsCheckinSrv_;
            zsGeneralSrv.refToLatestPulledTranslations = {
                en: {}
            };
            zsGeneralSrv.defaultLangShortCode = 'en';
        });
        angular.extend($scope, {
            zestStationData: {
                kiosk_scan_all_guests: false,
                precheckin_details: {}
            },
            inDemoMode: function() {
                return;
            },
            setScreenIcon: function() {
                return;
            },
            callBlurEventForIpad: function() {
                return;
            }
        });
        $controller('zsRoomNotAvailableNowCtrl', {
            $scope: $scope
        });
    });

    describe('Show and hide next button', function() {

        it('On entering screern, screen mode has to choose action', function() {
            expect($scope.screenData.mode).toEqual('CHOOSE_ACTION');
        });

        it('If action type is \'Send email\' and there is a valid email id, show next button', function() {
            $scope.screenData.action_type = 'send_mail';
            $scope.screenData.email = 'r@s.com';
            expect($scope.showNextButton()).toEqual(true);
        });

        it('If action type is \'Send email\' and there is no valid email, don\'t show next button', function() {
            $scope.screenData.action_type = 'send_mail';
            $scope.screenData.email = 'rs.com';
            expect($scope.showNextButton()).toEqual(false);
        });

        it('If action type is \'Find guest\' and there is a location selected, show next button', function() {
            $scope.screenData.action_type = 'find_guest';
            $scope.screenData.location = 'Bar';
            expect($scope.showNextButton()).toEqual(true);
        });

        it('If action type is \'Find guest\' and there is no location selected, don\'t show next button', function() {
            $scope.screenData.action_type = 'find_guest';
            $scope.screenData.location = '';
            expect($scope.showNextButton()).toEqual(false);
        });

        it('If action type is \'Guest will come back later\', show next button', function() {
            $scope.screenData.action_type = 'guest_will_come_back_later';
            $scope.screenData.location = '';
            expect($scope.showNextButton()).toEqual(true);
        });
    });

    describe('Next button action', function() {
        it('If action type is \'Send email\' and mail has changed, save the new mail', function() {
            spyOn(zsGeneralSrv, 'updateGuestEmail').and.callFake(function() {
                var deferred = $q.defer();

                deferred.reject({});
                return deferred.promise;
            });
            $scope.screenData.action_type = 'send_mail';
            $stateParams.guest_email = 'mail@mail.com';
            $scope.screenData.email = 'another_mail@mail.com';
            $scope.nextButtonClicked();
            $scope.$digest();
            expect(zsGeneralSrv.updateGuestEmail).toHaveBeenCalled();
        });

        it('If action type is \'Send email\' and mail has not changed, precheckin the reservation', function() {
            spyOn(zsCheckinSrv, 'preCheckinReservation').and.callFake(function() {
                var deferred = $q.defer();

                deferred.reject({});
                return deferred.promise;
            });
            $scope.screenData.action_type = 'send_mail';
            $stateParams.guest_email = 'mail@mail.com';
            $scope.screenData.email = 'mail@mail.com';
            $scope.nextButtonClicked();
            $scope.$digest();
            expect(zsCheckinSrv.preCheckinReservation).toHaveBeenCalled();
        });

        it('If action type is \'Guest will come back later\', notify the property', function() {
            spyOn(zsCheckinSrv, 'addNotes').and.callFake(function() {
                var deferred = $q.defer();

                deferred.reject({});
                return deferred.promise;
            });
            $scope.screenData.action_type = 'guest_will_come_back_later';
            $scope.nextButtonClicked();
            $scope.$digest();
            expect(zsCheckinSrv.addNotes).toHaveBeenCalled();
        });

        it('If action type is \'Find guest\', notify the property', function() {
            spyOn(zsCheckinSrv, 'addNotes').and.callFake(function() {
                var deferred = $q.defer();

                deferred.reject({});
                return deferred.promise;
            });
            $scope.screenData.action_type = 'find_guest';
            $scope.screenData.location = 'BAR';
            $scope.nextButtonClicked();
            $scope.$digest();
            expect(zsCheckinSrv.addNotes).toHaveBeenCalled();
        });
    });
});