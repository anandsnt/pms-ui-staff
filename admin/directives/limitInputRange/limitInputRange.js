admin.directive('limitInputRange', ['$timeout', function($timeout) {
    return {
    	restrict: 'A',
        require: 'ngModel',
    	link: function(scope, elem, attrs, ngModel) {
            var options = scope.$eval( attrs.limitInputRange );

            var processIt = function() {
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

                scope[options.callback] && scope[options.callback]();
            };

            var throttled = _.throttle(processIt, 300, { leading: false });

            angular.element(elem).on('keyup', throttled);

            scope.$on('$destroy', function() {
                angular.element(elem).off('keyup');
            });
        }
    };

}]);