sntRover.directive('clickTap', function($timeout, $parse) {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs, opt) {
         element.bind('touchstart', function(event) {
             try {
                if (element) {
                    if (arguments[0].target) {
                        if (angular.element(arguments[0].target)) {
                            angular.element(arguments[0].target).trigger('click');
                        }
                      //  if (arguments[0].target.type==='select-one'){//dropdowns which are <select> with options
                       //     angular.element(element).trigger('click');
                       // }
                    }
                    
                }
             } catch(err) {
                 
             }
             if (typeof event === typeof {}) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            }
            scope.$apply(attrs['clickTap']);
      });

    }
  };
});