angular.module('restrictMinVal', []).directive('restrictMinVal', [function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.restrictMinVal);

            angular.element(elem).on('keyup', function (event) {
                var value = parseInt(this.value);

                if (value < limit) {
                    event.preventDefault();
                    this.value = '';
                    return false;
                }
            });
        }
    };
}]);