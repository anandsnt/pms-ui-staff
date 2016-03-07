/**
 * Created by shahulhameed on 2/26/16.
 */
admin.directive('adFormHeaderWithBackButton', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            cancelAction: '=cancelAction',
            formTitle: '@formTitle'
        },
        templateUrl: '/assets/directives/FormHeaderWithBackButton/adFormHeaderWithBackButtonDir.html'
    };
}]);
