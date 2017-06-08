angular.module('login').directive('sntFocusInput', ['$window', function($window) {
    return {
        link: function() {
            // https://issues.apache.org/jira/browse/CB-5115
            $window.addEventListener('touchstart', function(e) {
                if (e.target.tagName.toUpperCase() === 'INPUT') {
                    e.preventDefault();
                    e.target.focus();
                }
            });
        }
    };
}]);