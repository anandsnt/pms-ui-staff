admin.directive('adFormSubTitle', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            fullWidth: '@fullWidth',
            title: '@title'
        },
        templateUrl: '/assets/directives/FormSubTitle/adFormSubTitleDir.html'
    };
}]);
