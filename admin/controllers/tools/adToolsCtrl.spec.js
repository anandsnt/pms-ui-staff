describe('ADToolsCtrl', function() {

    var $controller,
        $scope = {};

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;

            $scope = _$rootScope_.$new();
        });

        $controller('ADToolsCtrl', {
            $scope: $scope
        });

    });

    it('cancel resets currentClickedElement', function() {
        // Assign a non zero index to the currentClickedElement;
        $scope.currentClickedElement = 1;
        $scope.clickCancel();
        expect($scope.currentClickedElement).toBe(-1);
    });
});
