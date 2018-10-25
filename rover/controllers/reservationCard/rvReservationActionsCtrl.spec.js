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
                var shouldEnableSubmitButtonStatus = $scope.reservationMissingGuestDataOrDemographics();

                expect(shouldEnableSubmitButtonStatus).toBe(true);

            });

        });    
});
