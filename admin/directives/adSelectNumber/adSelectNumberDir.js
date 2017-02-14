angular.module('admin').directive('adSelectNumber', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            divClass: '@',
            selBoxClass: '@',
            required: '@',
            label: '@',
            labelInDropDown: '@',
            items: '=',
            selectedId: '=',
            labelClass: '@',
            onChange: '='
        },
        templateUrl: '/assets/directives/adSelectNumber/adSelectNumber.html'
    };

});