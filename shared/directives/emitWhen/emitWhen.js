/**
 * A better approach to find out when the DOM
 * has done rendering all the elements
 *
 * BASED on:
 * =========
 * http://stackoverflow.com/questions/17225106/anyway-to-trigger-a-method-when-angular-is-done-adding-scope-updates-to-the-dom#answer-17241032
 *
 * USAGE on HTML:
 * ==============
 * ng-repeat=".." emit-when="{event: 'CUSTOM_EVENT_NAME', condition: $last}"
 *
 * USAGE on CTRL:
 * ==============
 * var handler = $scope.$on( 'CUSTOM_EVENT_NAME', callback );
 * $scope.$on( '$destroy', allRendered );
 *
 * DRAWBACK:
 * =========
 * - For nested ng-repeats we need to listen to more than one render complete events
 */

angular
.module('emitWhen', [])
.directive('emitWhen', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var params = scope.$eval(attrs.emitWhen),
                event = params.event,
                condition = params.condition;

            if(condition){
                scope.$emit(event);
            }
        }
    }
});