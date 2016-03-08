/**
 * Created by shahulhameed on 2/26/16.
 */
admin.directive('adSaveCancelArea', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            saveAction: '=saveAction',
            cancelAction: '=cancelAction'
        },
        templateUrl: '/assets/directives/SaveCancelArea/adSaveCancelAreaDir.html'
    };
}]);
