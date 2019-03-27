describe('reservationActionsController', function () {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('reservationSampleData.json'),
        reservationSampleData = fixtures['reservationSampleData.json'];

    var $controller,
        $scope,
        $rootScope;

        describe('variable initalizations', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _$rootScope_) {
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                    $scope.guestCardData = {};
                    $scope.guestCardData.contactInfo = {};
                    $scope.guestCardData.contactInfo.address = {};
                    $scope.guestCardData.contactInfo.nationality_id = 12;
                    $scope.guestCardData.contactInfo.address.country_id = 15;
                    $scope.reservationData = reservationSampleData;
                    $scope.reservationParentData = {};
                    $scope.reservationParentData.arrivalDate = reservationSampleData.reservation_card.arrival_date;
                    
                });


                $controller('reservationActionsController', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 

            // =============================================

            it('check reservation missing guest data or demographics', function () {    
                $scope.guestCardData.contactInfo.email = "";
                $scope.guestCardData.contactInfo.phone = ""; 
                $scope.guestCardData.contactInfo.mobile = ""; 
                $scope.otherData = {};
                $scope.otherData.marketIsForced = true;
                $scope.otherData.sourceIsForced = true;
                $scope.otherData.originIsForced = true;
                $scope.otherData.segmentsIsForced = true;
                $scope.otherData.marketsEnabled = false;
                $scope.otherData.segmentsEnabled = false;
                $scope.otherData.originsEnabled = false;
                $scope.otherData.sourcesEnabled = false;
                $scope.otherData.markets = [];
                $scope.otherData.segments = [];
                $scope.otherData.origins = [];
                $scope.otherData.sources = [];
                $scope.reservationParentData.demographics = {"reservationType": "", "market": "", "source": "", "origin": "", "segment": ""};
                var shouldShowDemographicsPopup = $scope.reservationMissingGuestDataOrDemographics();

                expect(shouldShowDemographicsPopup).toBe(true);

            });

            it('If all data is set for that reservation, then no need to show popup', function () {    
                $scope.guestCardData.contactInfo.email = "soumya@stayntouch.com";
                $scope.guestCardData.contactInfo.phone = "123123123"; 
                $scope.guestCardData.contactInfo.mobile = "789777777"; 
                $rootScope.isStandAlone = true;
                $scope.otherData = {};
                $scope.otherData.marketIsForced = true;
                $scope.otherData.sourceIsForced = true;
                $scope.otherData.originIsForced = true;
                $scope.otherData.segmentsIsForced = true;
                $scope.otherData.marketsEnabled = true;
                $scope.otherData.segmentsEnabled = true;
                $scope.otherData.originsEnabled = true;
                $scope.otherData.sourcesEnabled = true;
                $scope.otherData.markets = [{"is_active": true, "name": "one", "value": 45}];
                $scope.otherData.segments = [{"is_active": true, "name": "one", "value": 45}];
                $scope.otherData.origins = [{"is_active": true, "name": "one", "value": 45}];
                $scope.otherData.sources = [{"is_active": true, "name": "one", "value": 45}];
                $scope.reservationParentData.demographics = {"reservationType": 5, "market": 182, "source": 202, "origin": 55, "segment": 21};

                var shouldShowDemographicsPopup = $scope.reservationMissingGuestDataOrDemographics();

                expect(shouldShowDemographicsPopup).toBe(false);

            });

            it('If some data missing, show popup', function () {    
                $scope.guestCardData.contactInfo.email = "soumya@stayntouch.com";
                $scope.guestCardData.contactInfo.phone = "123123123"; 
                $scope.guestCardData.contactInfo.mobile = "789777777";
                $rootScope.isStandAlone = true;
                $scope.otherData = {};
                $scope.otherData.marketIsForced = true;
                $scope.otherData.sourceIsForced = true;
                $scope.otherData.originIsForced = true;
                $scope.otherData.segmentsIsForced = true;
                $scope.otherData.marketsEnabled = false;
                $scope.otherData.segmentsEnabled = false;
                $scope.otherData.originsEnabled = false;
                $scope.otherData.sourcesEnabled = false;
                $scope.otherData.markets = [];
                $scope.otherData.segments = [];
                $scope.otherData.origins = [];
                $scope.otherData.sources = [];
                $scope.reservationParentData.demographics = {"reservationType": "", "market": "", "source": "", "origin": "", "segment": ""};
                var shouldShowDemographicsPopup = $scope.reservationMissingGuestDataOrDemographics();

                expect(shouldShowDemographicsPopup).toBe(false);

            });
        }); 
        
        
        describe('Reverse check-in', function () {
            var RVReservationCardSrv,
                $q,
                ngDialog,
                $httpBackend;

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _$rootScope_, _RVReservationCardSrv_, _$q_, _ngDialog_, _$httpBackend_) {
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                    $scope.guestCardData = {};
                    $scope.guestCardData.contactInfo = {};
                    $scope.guestCardData.contactInfo.address = {};
                    $scope.guestCardData.contactInfo.nationality_id = 12;
                    $scope.guestCardData.contactInfo.address.country_id = 15;
                    $scope.reservationData = reservationSampleData;
                    $scope.reservationParentData = {};
                    $scope.reservationParentData.arrivalDate = reservationSampleData.reservation_card.arrival_date;
                    RVReservationCardSrv = _RVReservationCardSrv_;
                    $q = _$q_;
                    ngDialog = _ngDialog_;
                    $httpBackend = _$httpBackend_;
                    
                });


                $controller('reservationActionsController', {
                    $scope: $scope
                });

            }); 

            it('should invoke the success callback during reverse check-in success', function() {
                spyOn(RVReservationCardSrv, 'reverseCheckIn').and.callFake(function() {
                    var deferred = $q.defer();
        
                    deferred.resolve({});
                    return deferred.promise;
                });

                spyOn(ngDialog, 'open').and.callFake(function() {
                    var deferred = $q.defer();
        
                    deferred.resolve();
                    return deferred.promise;
                });

                $scope.reservationData = {
                    reservation_card: {
                        reservation_id: 123456
                    }
                };

                $scope.performReverseCheckIn();
                $rootScope.$apply();
                expect(ngDialog.open).toHaveBeenCalled();
            });

            it('should invoke the failure callback when the reverse check-in is a failure', function() {
                spyOn(RVReservationCardSrv, 'reverseCheckIn').and.callFake(function() {
                    var deferred = $q.defer();
        
                    deferred.reject('Errored');
                    return deferred.promise;
                });

                $scope.reservationData = {
                    reservation_card: {
                        reservation_id: 123456
                    }
                };

                $scope.performReverseCheckIn();
                $rootScope.$apply();
                expect($scope.errorMessage).toEqual('Errored');
            });

            it('should update the hk status as dirty when not ready is selected as the option from the popup', function() {
                $scope.roomStatus = {
                    isReady: false
                };
                var hkstatusId;

                $httpBackend.expectPOST('/house/change_house_keeping_status.json').respond((method, url, data, headers, params) => {
                    var deferred = $q.defer();

                    hkstatusId = (JSON.parse(data)).hkstatus_id;
                    deferred.resolve(params);
                    return deferred.promise; 
                });

                $scope.updateRoomStatus();
                $httpBackend.flush();
                expect(hkstatusId).toEqual(3);
            });
            it('should update the hk status as clean when ready is selected as the option from the popup and check in inspected is false', function() {
                $scope.roomStatus = {
                    isReady: true
                };

                $scope.reservationData = {
                    reservation_card: {
                        checkin_inspected_only: 'false'
                    }
                };
                var hkstatusId;

                $httpBackend.expectPOST('/house/change_house_keeping_status.json').respond(function(method, url, data, headers, params) {
                    var deferred = $q.defer();

                    hkstatusId = (JSON.parse(data)).hkstatus_id;
                    deferred.resolve(params);
                    return deferred.promise; 
                });

                $scope.updateRoomStatus();
                $httpBackend.flush();
                expect(hkstatusId).toEqual(1);
            });
            it('should update the hk status as inspected when ready is selected as the option from the popup and check in inspected is true', function() {
                $scope.roomStatus = {
                    isReady: true
                };

                $scope.reservationData = {
                    reservation_card: {
                        checkin_inspected_only: 'true'
                    }
                };
                var hkstatusId;

                $httpBackend.expectPOST('/house/change_house_keeping_status.json').respond(function(method, url, data, headers, params) {
                    var deferred = $q.defer();

                    hkstatusId = (JSON.parse(data)).hkstatus_id;
                    deferred.resolve(params);
                    return deferred.promise; 
                });

                $scope.updateRoomStatus();
                $httpBackend.flush();
                expect(hkstatusId).toEqual(2);
            });
        }); 
});
