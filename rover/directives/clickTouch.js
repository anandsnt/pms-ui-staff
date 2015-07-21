sntRover.directive('clickTouch', function($timeout, $parse) {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs, opt) {
         element.bind('touchstart click', function(event) {
             //bind any touch start event to the element
         //scope.navmenutouch(arguments, attrs, element, event);
            event.preventDefault();
            event.stopPropagation();

            scope.$apply(attrs['clickTouch']);
      });

    }
  };
});