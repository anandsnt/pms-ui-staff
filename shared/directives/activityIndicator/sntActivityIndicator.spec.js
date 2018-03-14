describe('Activity Indicator', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        module('sntActivityIndicator');

        // NOTE The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    it('template replaces content', function () {
        var $scope = $rootScope.$new(),
            element;

        $scope.hasLoader = true;
        element = $compile('<activity-indicator></activity-indicator>')($scope);
        $rootScope.$digest();
        expect(element.html()).toMatch(/loading/);
    });
});
