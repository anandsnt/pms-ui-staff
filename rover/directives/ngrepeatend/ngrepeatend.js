sntRover.directive('ngrepeatend', function(){
	return function(scope, element, attrs) {
	    if (scope.$last){
	      scope.$emit("I_COMPLETED_RENDERING");
	    }
  };
});