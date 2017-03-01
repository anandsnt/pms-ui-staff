angular.module('sntRover').controller('topController',
    ['$state', 'sntAuthorizationSrv', '$rootScope', '$location', '$stateParams', '$scope', '$window', '$log',
        function($state, sntAuthorizationSrv, $rootScope, $location, $stateParams, $scope, $window, $log) {

            var routeChange = function(event) {
                event.preventDefault();
                return false;
            };

            (function() {
                sntAuthorizationSrv.setProperty($stateParams.uuid);
                // NOTE: This listener is not removed on $destroy on purpose!
                $rootScope.$on('$locationChangeStart', routeChange);

                $window.history.pushState("initial", "Showing Dashboard", "/staff/h/" + $stateParams.uuid);
                $state.go('rover.dashboard');
            })();
        }
    ]
);