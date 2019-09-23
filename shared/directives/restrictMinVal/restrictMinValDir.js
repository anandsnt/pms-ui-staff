angular.module('restrictMinVal', []).directive('restrictMinVal', [function() {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.restrictMinVal, 10);

            angular.element(elem).on('keyup', function (event) {
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