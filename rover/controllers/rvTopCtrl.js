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
                if ($stateParams.state) {
                    var params = ($stateParams.params && angular.fromJson(decodeURI($stateParams.params))) || {};

                    $state.go($stateParams.state.replace(/-/g,'.'), params);
                } else {
                    $state.go('rover.dashboard');
                }

            })();
        }
    ]
);