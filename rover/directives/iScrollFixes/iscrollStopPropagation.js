sntRover.directive('iscrollStopPropagation', function($window) {
  return {
    link: function(scope, element, attr) {

      element.on('mousedown', function(e) {
        e.stopPropagation();
      });

    }
  }
});