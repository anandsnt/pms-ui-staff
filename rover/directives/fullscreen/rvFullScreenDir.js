/**
 * Created by rahulkookal on 15/11/17.
 */
sntRover.directive('rvFullscreen', [
    '$document',
    function($document) {

        return {
            restrict: 'A',
            scope: {
                test: '=pageOptions'
            },
            link: function(scope, element, attrs) {
                console.log(scope);
                console.log(scope.$parent.getScroller());
                element.on('click', function(e) {
                    scope.$apply(function() {
                        var myEl = angular.element(document.querySelector('body'));
                        myEl.addClass('is-fullscreen fullscreen-card');
                    });
                    e.stopPropagation(); //stop event from bubbling up to document object
                });
            }
        };
    }
]);
