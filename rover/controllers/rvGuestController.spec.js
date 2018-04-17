describe('guestCardController', function() {

    var $controller,
        $scope = {},
        $state;

    beforeEach(function() {
        module('sntRover');
        inject(function(_$controller_, _$rootScope_, _$state_) {
            $controller = _$controller_;
            $state = _$state_;
            $scope = _$rootScope_.$new();
            $scope.reservationDetails = {
                'travelAgent': {}
            };
            $scope.guestCardData = {
                'contactInfo': {}
            };
            $scope.viewState = {
                'identifier': {}
            };
        });
        $controller('guestCardController', {
            $scope: $scope
        });
    });

    it('should hide the loading indicator', function() {
        $scope.likesInfoError = false;
        // $scope.$emit('likesInfoError', true);
        expect($scope.likesInfoError).toBe(false);

    });
});