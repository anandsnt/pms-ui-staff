sntRover.directive('outsideClickHandler', function($window) {
  return {

    link: function(scope, element) {

      var w = angular.element($window);
      w.bind('click', function(e) {
        if (element[0].contains(e.target)) {

        } else {
          scope.$emit("OUTSIDECLICKED", e.target);
          scope.$broadcast("OUTSIDECLICKED", e.target);
        }

      });
      scope.$on('$destroy', function() {
             w.off('click');
        });
    }
  };
});