sntRover.directive('click', function ($timeout, $parse) {
    return {
        priority: 100,
        restrict: 'A',
        link: function (scope, element, attrs, opt) {
            element.on("tap",function(){
                scope.$apply(attrs['click']);
            });
        }
    };
});