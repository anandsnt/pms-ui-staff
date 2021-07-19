sntRover.directive('imgError', function() {
  return {
    link: function(scope, element) {
      element.bind('error', function() {
        element.attr('src', '/ui/pms-ui/images/preview_not_available.png');
      });
    }
  };
});