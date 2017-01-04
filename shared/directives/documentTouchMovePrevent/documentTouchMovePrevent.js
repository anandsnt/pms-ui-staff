angular.module('documentTouchMovePrevent', []).directive('documentTouchMovePrevent', function($window) {
  return {

    link: function(scope, element) {
    	var hasTouch = 'ontouchstart' in window;

      window.fu = function(event) {
		    	event.preventDefault();
		    }
    	if (hasTouch) {
		    document.addEventListener('touchmove',fu );
		}
    }
  };
});
