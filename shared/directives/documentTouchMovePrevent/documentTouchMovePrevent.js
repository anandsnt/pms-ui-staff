angular.module('documentTouchMovePrevent', []).directive('documentTouchMovePrevent', function($window) {
    return {

        link: function(scope, element) {
            var isIpad = navigator.userAgent.match(/iPad/i) !== null,
            url = window.location.href;

            // CICO-36654 fix for touch events not getting detected iPad.
            window.touchmovepreventdefault = function(event) {
                event.preventDefault();
            };
            if (isIpad) {
                document.addEventListener('touchmove', touchmovepreventdefault);
            } else if (url.indexOf("/admin/h/") == -1) {
                document.addEventListener('touchmove', touchmovepreventdefault, {passive: false});
            }
        }
    };
});
