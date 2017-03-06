angular.module('admin').controller('adTopCtrl',
    ['$state', '$rootScope', '$scope', '$window', '$stateParams', 'sntAuthorizationSrv',
        function($state, $rootScope, $scope, $window, $stateParams, sntAuthorizationSrv) {

            var routeChange = function(event) {
                event.preventDefault();
                return false;
            };

            (function() {
                if ('snt' === $state.current.name) {
                    $window.history.pushState("initial", "Showing Dashboard", "/admin/snt");
                } else {
                    $window.history.pushState("initial", "Showing Dashboard", "/admin/h/" + $stateParams.uuid);
                    sntAuthorizationSrv.setProperty($stateParams.uuid);
                }

                // NOTE: This listener is not removed on $destroy on purpose!
                $rootScope.$on('$locationChangeStart', routeChange);

                $state.go('admin.dashboard', {
                    menu: 0
                });
            })();
        }
    ]
);