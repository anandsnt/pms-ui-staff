angular.module('documentTouchMovePrevent', []).directive('documentTouchMovePrevent', function($window) {
  return {

    link: function(scope, element) {
    	var hasTouch = 'ontouchstart' in window;
    	if(hasTouch){
		    document.addEventListener('touchmove', function(event){
		    	event.preventDefault();
		    });
		}
    }
  };
});