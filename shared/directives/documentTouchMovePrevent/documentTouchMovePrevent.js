angular.module('documentTouchMovePrevent', []).directive('documentTouchMovePrevent', function($window) {
  return {

    link: function(scope, element) {

      document.addEventListener('touchmove', function(event){
        event.preventDefault();
      });
    }
  }
});