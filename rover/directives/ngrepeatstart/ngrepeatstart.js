/**
* Directive used to get the ngrepeat start event
* will be helpful for larger data sets
*/
sntRover.directive('ngrepeatstarted', function(){
	return function(scope, element, attrs) {
		//we are using ngrepeat $first in cracking this
	    if (scope.$first){
	      scope.$emit("NG_REPEAT_STARTED_RENDERING");
	    }
  };
});