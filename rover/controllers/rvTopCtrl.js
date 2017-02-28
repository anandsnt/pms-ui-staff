angular.module('sntRover').controller('topController',
    ['$state', 'rvAuthorizationSrv', '$rootScope', '$location', '$stateParams', '$scope', '$window', '$log',
        function($state, rvAuthorizationSrv, $rootScope, $location, $stateParams, $scope, $window, $log) {

            var routeChange = function(event) {
                event.preventDefault();
                $location.path('staff/h/HELLO');
                $location.replace();
                return false;
            };

            (function() {
                rvAuthorizationSrv.setProperty($stateParams.uuid);
                // NOTE: This listener is not removed on $destroy on purpose!
                $rootScope.$on('$locationChangeStart', routeChange);

                $window.history.pushState("initial", "Showing Dashboard", "/staff/h/" + $stateParams.uuid);
                $state.go('rover.dashboard');
            })();
        }
    ]
);