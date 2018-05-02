describe('Report Details Controller', function() {
    beforeEach(module('sntRover'));

    var $controller,
        $scope;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;

        $scope = _$rootScope_.$new();

    }));

    it('Unit test goes here', function() {
        $controller('RVReportDetailsCtrl', { $scope: $scope });
    });
});
