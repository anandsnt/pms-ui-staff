/**
 * A directive to limit the numeric input value between a from-to value
 * For better UX: The directive will throttle user inputs and will process from last input
 *
 * USAGE:
 * ======
 * <input ng-model="" limit-input-range="{from: 0, to: 12, callback: 'afterUpdate'}"
 *
 * REQUIRED:
 * =========
 * ng-model is required, otherwise it wont work and will throw error
 *
 * @param {number} 'from'     - (required) the from value
 * @param {number} 'to'       - (required) the to value
 * @param {string} 'callback' - (optional) the method on scope that must be called after updating the value
 */
angular
.module('limitInputRange', [])
.directive('limitInputRange', ['$timeout', function($timeout) {
    return {
    	restrict: 'A',
        require: 'ngModel',
    	link: function(scope, elem, attrs, ngModel) {
            var options,
                processIt,
                debounced;

            options = scope.$eval( attrs.limitInputRange );

            if ( ! options.hasOwnProperty('from') || ! options.hasOwnProperty('to') || typeof options.from !== 'number' || typeof options.to !== 'number') {
                console.error( "'Must provide 'from' and 'to' values." );
                return;
            };

            processIt = function() {
                var value = parseInt( ngModel.$viewValue ),
                    apply = value;

                if ( isNaN(value) ) {
                    apply = options.from;
                } else if ( value < options.from ) {
                    apply = options.from;
                } else if ( value > options.to ) {
                    apply = options.to;
                };

                if ( apply < 10 ) {
                    apply = '0' + apply;
                } else {
                    apply = apply.toString();
                };

                ngModel.$setViewValue(apply);
                ngModel.$render();
                scope.$digest();

                scope[options.callback] && scope[options.callback]();
            };

            debounced = _.debounce(processIt, 300);

            angular.element(elem).on('keyup', debounced);

            scope.$on('$destroy', function() {
                angular.element(elem).off('keyup');
            });
        }
    };

}]);