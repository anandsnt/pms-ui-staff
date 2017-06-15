angular.module('admin').directive('sntHighlightSyntax', function($timeout) {

    return {
        restrict: 'A',
        link: function() {
            $timeout(function() {
                SyntaxHighlighter.highlight({
                    toolbar: false
                });
            }, 0);
        }
    };

});
