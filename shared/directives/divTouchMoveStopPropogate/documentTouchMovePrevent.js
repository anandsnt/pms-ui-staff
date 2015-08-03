angular.module('divTouchMoveStopPropogate', []).directive('divTouchMoveStopPropogate', function($window) {
  return {

    link: function(scope, element) {
    	var hasTouch = 'ontouchstart' in window;
    	if(hasTouch){
	      element.on('touchmove', function(event){
	        event.stopPropagation();
	      });
	    }
    }
  }
});