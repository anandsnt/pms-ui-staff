//Directive to set focus to input element
sntRover.directive('focusMe', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      element.bind('blur', function() {
      	if(!scope.$$phase) {
         	scope.$apply(model.assign(scope, false));
      	}else {
			model.assign(scope, false);
      	}

      });
    }
  };
});