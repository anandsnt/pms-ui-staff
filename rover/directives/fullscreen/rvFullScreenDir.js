/**
 * Created by rahulkookal on 15/11/17.
 */
sntRover.directive('rvFullscreen', [
    '$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            scope: {
                scroll: '@scroll'
            },
            link: function(scope, element, attrs) {
                element.on('click', function(e) {
                    scope.$apply(function() {
                        var myEl = angular.element(document.querySelector('body'))[0];
                        myEl.classList.toggle("is-fullscreen");
                        myEl.classList.toggle("fullscreen-card");
                    });
                    e.stopPropagation(); //stop event from bubbling up to document object
                    $rootScope.$broadcast(scope.scroll);
                });
            }
        };
    }
]);
