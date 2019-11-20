angular.module('admin').directive('adSwitch', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            isChecked: '='
        },
        template: '<div class="switch-button single" ng-class="{\'on\': isChecked}">' +
            '          <ng-transclude></ng-transclude>' +
            '          <span class="switch-icon"></span>' +
            '      </div>'
    };
});
