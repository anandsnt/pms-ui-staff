/**
 * Created by shahulhameed on 2/26/16.
 */

admin.directive('adFormTitle', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            fullWidth: '@fullWidth',
            formTitle: '@formTitle'
        },
        templateUrl: '/assets/directives/FormTitle/adFormTitleDir.html'
    };
}]);
