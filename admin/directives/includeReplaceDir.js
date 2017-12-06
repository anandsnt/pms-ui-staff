admin.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el) {
            el.replaceWith(el.children());
        }
    };
});