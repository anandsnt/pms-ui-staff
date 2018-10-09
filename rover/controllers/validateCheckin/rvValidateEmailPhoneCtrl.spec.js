describe('RVValidateEmailPhoneCtrl', function () {

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
                    $rootScope.roverObj = {};
                    $rootScope.roverObj.forceCountryAtCheckin = true;
                    $rootScope.roverObj.forceNationalityAtCheckin = true;
                    $scope.guestCardData = {};
                    $scope.guestCardData.contactInfo = {};
                    $scope.guestCardData.contactInfo.address = {};
                    $scope.guestCardData.contactInfo.nationality_id = 12;
                    $scope.guestCardData.contactInfo.address.country_id = 15;
                    $scope.reservationData = {};
                });


                $controller('RVValidateEmailPhoneCtrl', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 
            // =============================================

            it('should Enable submit button', function () {    
                $scope.guestCardData.contactInfo.nationality_id = 12;
                $scope.guestCardData.contactInfo.address.country_id = 15;            

                var shouldEnableSubmitButtonStatus = $scope.shouldEnableSubmitButton();

                expect(shouldEnableSubmitButtonStatus).toBe(true);

            });
            // // ==========================
            it('should Enable submit button if only force country', function () {    
                $rootScope.roverObj.forceCountryAtCheckin = true;
                $rootScope.roverObj.forceNationalityAtCheckin = false;
                $scope.guestCardData.contactInfo.nationality_id = 12;
                $scope.guestCardData.contactInfo.address.country_id = 15;            

                var shouldEnableSubmitButtonStatus = $scope.shouldEnableSubmitButton();

                expect(shouldEnableSubmitButtonStatus).toBe(true);

            });
             // // ==========================
            it('should Enable submit button if only force nationality', function () {    
                $rootScope.roverObj.forceCountryAtCheckin = false;
                $rootScope.roverObj.forceNationalityAtCheckin = true;
                $scope.guestCardData.contactInfo.nationality_id = 12;
                $scope.guestCardData.contactInfo.address.country_id = 15;            

                var shouldEnableSubmitButtonStatus = $scope.shouldEnableSubmitButton();

                expect(shouldEnableSubmitButtonStatus).toBe(true);

            });
             // // ==========================
            it('should Enable submit button if both not forced', function () {    
                $rootScope.roverObj.forceCountryAtCheckin = false;
                $rootScope.roverObj.forceNationalityAtCheckin = false;
                $scope.guestCardData.contactInfo.nationality_id = 12;
                $scope.guestCardData.contactInfo.address.country_id = 15;            

                var shouldEnableSubmitButtonStatus = $scope.shouldEnableSubmitButton();

                expect(shouldEnableSubmitButtonStatus).toBe(true);

            });
        });    
});
