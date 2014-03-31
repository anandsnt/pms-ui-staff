admin.directive('error_message', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      messsage: '@'
    },
    link: function(scope, element, attrs){
        scope.errorMessage = 'sdfd';
    }
  };
});