admin.directive('adRadioDir', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            dirModel: '=dirModel',
            dirLabel: '@dirLabel',
            dirValue: '@dirValue'
        },
        templateUrl: '/assets/directives/radio/adRadioDir.html'
    };
}]);
