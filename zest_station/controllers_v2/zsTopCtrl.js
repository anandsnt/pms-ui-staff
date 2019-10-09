angular.module('sntZestStation').controller('zsTopCtrl',
    [
        '$state',
        'sntAuthorizationSrv',
        '$rootScope',
        '$window',
        '$timeout',
        function($state, sntAuthorizationSrv, $rootScope, $window, $timeout) {

            // in order to prevent url change or fresh url entering with states
            var routeChange = function(event) {
                event.preventDefault();
                return;
            };

            (function() {
                var uuid = $state.params.uuid;

                sntAuthorizationSrv.setProperty(uuid);

                $window.history.replaceState('', 'Showing Landing Page', "/zest_station/h/" + uuid);

                if ($state.params.state) {
                    $state.go($state.params.state);
                } else {
                    $state.go('zest_station.home');
                }

                // NOTE: This listener is not removed on $destroy on purpose!
                $timeout(function () {
                    // we are forcefully setting top url, please refer routerFile
                    $rootScope.$on('$locationChangeStart', routeChange);
                });
            })();
        }
    ]
);
