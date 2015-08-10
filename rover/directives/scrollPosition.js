sntRover.directive('scrollPosition', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, opt) {
            var isIpad = navigator.userAgent.match(/iPad/i) !== null;
            if (isIpad){
                try {
                   /* $(element)[0].addEventListener('touchmove', function(){
                        if ($(element)[0].id === 'rateViewCalendar'){
                            $(element).prev().scrollTop($(element).scrollTop());
                        }
                    });*/

                } catch(err){

                }
            } else {
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