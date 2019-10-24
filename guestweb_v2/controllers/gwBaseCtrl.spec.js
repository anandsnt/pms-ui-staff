describe('BaseController', function() {

    var $controller,
        $state,
        $scope = {};

    beforeEach(function() {
        module('sntGuestWeb');

        inject(function(_$controller_, _$rootScope_, _$state_) {
            $controller = _$controller_;
            $state = _$state_;
            $scope = _$rootScope_.$new();
        });
        $controller('BaseController', {
            $scope: $scope
        });
        spyOn($state, 'go');
    });

    it('on API failure, go to the see front desk state', function() {
        $scope.fetchedFailed();
        expect($state.go).toHaveBeenCalledWith('seeFrontDesk');
    });

    it('should display the loading indicator', function() {
        $scope.loading = false;
        $scope.$emit('showLoader');
        expect($scope.loading).toBe(true);
    });

    it('should hide the loading indicator', function() {
        $scope.loading = true;
        $scope.$emit('hideLoader');
        expect($scope.loading).toBe(false);
    });

});
