/*
 * rvFullscreen Directive usage :-
 * 1.Apply directive to the expand button.ie
 *  <button rv-fullscreen >Fullscreen</button>
 * 2.include rvFullscreenHeader.html in the specified container.
 *  a.<div ng-include="'/assets/partials/common/rvFullscreenHeader.html'" class="fullscreen-header"></div>
 *  b.set $scope.fullScreenSubHeader inside the controller.
 */
sntRover.directive('rvFullscreen', [
    '$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function(e) {
                    var myEl = angular.element(document.querySelector('body'))[0];

                    myEl.classList.toggle("is-fullscreen");
                    myEl.classList.toggle("fullscreen-card");
                    Object.keys($rootScope.myScrollOptions).forEach(function (key) {
                        scope.refreshScroller(key);
                    });
                    e.stopPropagation();
                });
            }
        };
    }
]);
