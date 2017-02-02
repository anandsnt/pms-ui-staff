angular.module('divTouchMoveStopPropogate', []).directive('divTouchMoveStopPropogate', function($window) {
  return {

    link: function(scope, element) {
    	var hasTouch = 'ontouchstart' in window;
        // CICO-36654 fix for touch events not getting detected iPad.
        window.touchmovestoppropogate = function(event) {
            event.stopPropagation();
        };
    	if (hasTouch) {
	      element.on('touchmove',window.touchmovestoppropogate );
	    }
    }
  };
});
