sntRover.directive('imgError', function() {
  return {
    link: function(scope, element) {
      element.bind('error', function() {
        element.attr('src', '/assets/images/preview_not_available.png');
      });
    }
  };
});