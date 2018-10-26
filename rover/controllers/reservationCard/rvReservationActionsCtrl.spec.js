describe('reservationActionsController', function () {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('reservationSampleData.json'),
        reservationSampleData = fixtures['reservationSampleData.json']

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
});
