admin.directive('adFormSubTitle', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            fullWidth: '@fullWidth',
            title: '@title',
            hide: '=hide'
        },
        templateUrl: '/assets/directives/FormSubTitle/adFormSubTitleDir.html'
    };
}]);
