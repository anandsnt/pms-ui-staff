sntRover.directive('scrollPosition', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, opt) {
          var w = angular.element($window);
            if (scope.initScrollBind && scope.initScrollBind()){
                w.bind('ng-iscroll', function (event) {
                        scope.initScrollBind();
                });
            }

          scope.$on('$destroy', function() {
               w.off('ng-iscroll');
          });

        }
    };
});