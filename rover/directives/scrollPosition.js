sntRover.directive('scrollPosition', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, opt) {
            var isIpad = navigator.userAgent.match(/iPad/i) !== null;
            if (!isIpad){
                var w = angular.element($window);
                if (typeof scope.initScrollBind === 'function'){
                    w.bind('scroll ng-iscroll', function (event) {
                            scope.initScrollBind();
                    });
                    try {scope.initScrollBind();} catch(err){}//to init the first scrollbind
                }

                scope.$on('$destroy', function() {
                     w.off('scroll');
                     w.off('ng-iscroll');
                });
            }
        }
    };
});