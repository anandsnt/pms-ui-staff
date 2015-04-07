sntRover.directive('scrollPosition', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, opt) {
          var w = angular.element($window);
            if (scope.initScrollBind){
                w.bind('scroll ng-iscroll', function (event) {
                        scope.initScrollBind();
                });
            }

            scope.$on('$destroy', function() {
                 w.off('ng-iscroll');
                 w.off('scroll');
            });

        }
    };
});