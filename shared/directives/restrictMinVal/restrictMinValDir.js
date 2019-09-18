angular.module('restrictMinVal').directive("restrictMinVal", [function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.restrictMinVal);

            angular.element(elem).on("keypress", function(e) {
                if (this.value < limit) e.preventDefault();
            });
        }
    }
}]);