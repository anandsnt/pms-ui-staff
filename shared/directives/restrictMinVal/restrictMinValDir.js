angular.module('restrictMinVal', []).directive('restrictMinVal', [function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.restrictMinVal, 10);

            angular.element(elem).on('focusout', function (event) {
                var value = parseInt(this.value, 10);

                if (value < limit) {
                    event.preventDefault();
                    this.value = 5;
                    return false;
                }
                
            });
            
        }
    };
}]);