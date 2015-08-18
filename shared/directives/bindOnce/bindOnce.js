angular
.module('bindOnce', [])
.directive('bindOnce', function() {
    return {
        scope: true,
        link: function( $scope, $element ) {
            setTimeout(function() {
                $scope.$destroy();
                $element.removeClass('ng-binding ng-scope');
            }, 0);
        }
    };
});