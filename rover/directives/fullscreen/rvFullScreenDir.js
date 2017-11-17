/*
 * rvFullscreen Directive usage :-
 * 1.Apply directive to the expand button.ie
 *  <button rv-fullscreen >Fullscreen</button>
 *  <button rv-fullscreen fs-scroll-name="name-of-scroll-to-be-refreshed">Fullscreen</button>
 * 2.include '/assets/partials/shared/rvFullscreenHeader.html' in the specified container.
 *  set $scope.fullScreenSubHeader inside the controller.
 */
sntRover.directive('rvFullscreen', [
    '$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', function(e) {
                    var myEl = angular.element(document.querySelector('body'))[0];
                    myEl.classList.toggle("is-fullscreen");
                    myEl.classList.toggle("fullscreen-card");
                    if(!!attrs.fsScrollName) {
                        scope.refreshScroller(attrs.fsScrollName);
                    } else {
                        Object.keys($rootScope.myScrollOptions).forEach(function (key) {
                            scope.refreshScroller(key);
                        });
                    }
                    e.stopPropagation();
                });
            }
        };
    }
]);
