angular.module('convertToNumber', []).directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return isFinite(parseInt(val, 10)) ? parseInt(val, 10) : val;
            });
            ngModel.$formatters.push(function(val) {
                if (angular.isUndefined(val)) {
                    return '';
                }
                return '' + val;
            });
        }
    };
});