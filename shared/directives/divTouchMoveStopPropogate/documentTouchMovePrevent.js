angular.module('divTouchMoveStopPropogate', []).directive('divTouchMoveStopPropogate', function($window) {
  return {

    link: function(scope, element) {
      element.on('touchmove', function(event){
        event.stopPropagation();
      });
    }
  }
});