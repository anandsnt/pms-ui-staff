sntRover.directive('scrollPosition', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, opt) {
            console.log('init scroll bind via scope');
            element.bind('scroll ng-iscroll iscroll ng-scroll', function (event) {
               scope.initScrollBind();
            });


        }
    };
});