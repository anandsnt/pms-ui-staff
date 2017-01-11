angular.module('documentTouchMovePrevent', []).directive('documentTouchMovePrevent', function($window) {
    return {

        link: function(scope, element) {
            var hasTouch = 'ontouchstart' in window;

            // CICO-36654 fix for touch events not getting detected iPad.
            window.touchmovepreventdefault = function(event) {
                event.preventDefault();
            };
            if (hasTouch) {
                document.addEventListener('touchmove', touchmovepreventdefault);
            }
        }
    };
});
