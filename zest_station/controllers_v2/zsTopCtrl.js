angular.module('sntZestStation').controller('zsTopCtrl',
    [
        '$state',
        'sntAuthorizationSrv',
        '$rootScope',
        function($state, sntAuthorizationSrv, $rootScope) {

            // in order to prevent url change or fresh url entering with states
            var routeChange = function(event) {
                event.preventDefault();
                return;
            };

            (function() {
                var uuid = $state.params.uuid;

                sntAuthorizationSrv.setProperty(uuid);
                $rootScope.$on('$locationChangeStart', routeChange);
                // we are forcefully setting top url, please refer routerFile
                window.history.pushState('initial', 'Showing Landing Page', "/zest_station/h/" + uuid);

                if ($state.params.state) {
                    $state.go($state.params.state);
                } else {
                    $state.go('zest_station.home');
                }
            })();
        }
    ]
);