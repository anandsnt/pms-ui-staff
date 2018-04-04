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

        element = $compile('<activity-indicator><div element-transclude>\n' +
            '  Some Content\n' +
            '</div></activity-indicator>')($scope);
        $rootScope.$digest();

        // Both normal loader and EMV loader need to be hidden
        expect(element[0].querySelectorAll('.ng-hide').length).toBe(2);
    });

    it('should load payment loader if $rootScope.showTerminalActivity is true', function () {
        var element,
            ngEl = angular.element;

        $rootScope['showTerminalActivity'] = true;
        element = $compile('<activity-indicator></activity-indicator>')($rootScope);
        $rootScope.$digest();

        expect(ngEl(ngEl(element).children()[0]).hasClass('ng-hide')).toBe(true);
    });
});
