sntRover.directive('onetimemousemove', ['$window', function($window) {
    return {

        link: function(scope, element) {

            var w = $(element);
            w.bind('mousemove', function(e) {
                scope.$emit("MOUSEMOVEDOVERME", e.target);
                scope.$broadcast("MOUSEMOVEDOVERME", e.target);
                w.off('mousemove');
            });
        }
    }
}]);
