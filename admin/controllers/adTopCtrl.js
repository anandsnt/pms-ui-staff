angular.module('admin').controller('adTopCtrl',
    ['$state', '$rootScope', '$scope', '$window', '$stateParams', 'sntAuthorizationSrv', 'ADAppSrv', '$log', '$timeout',
        function($state, $rootScope, $scope, $window, $stateParams, sntAuthorizationSrv, ADAppSrv, $log, $timeout) {

            BaseCtrl.call(this, $scope);

            var routeChange = function(event) {
                event.preventDefault();
                return false;
            };

            var setPropertyAndNavigate = function(uuid) {
                if ('snt' === $state.current.name) {
                    $window.history.pushState("initial", "Showing Dashboard", "/admin/snt");
                } else {
                    $window.history.pushState("initial", "Showing Dashboard", "/admin/h/" + uuid);
                    sntAuthorizationSrv.setProperty(uuid);
                }

                // NOTE: This listener is not removed on $destroy on purpose!
                $rootScope.$on('$locationChangeStart', routeChange);

                $state.go('admin.dashboard', {
                    menu: 0
                });
            };

            (function() {
                if ($stateParams.uuid || 'snt' === $state.current.name) {
                    setPropertyAndNavigate($stateParams.uuid);
                } else {
                    $log.info('setPropertyAndNavigate');
                    $scope.callAPI(ADAppSrv.getDefaultUUID, {
                        successCallBack: function(uuid) {
                            if (uuid) {
                                setPropertyAndNavigate(uuid);
                            } else {
                                var redirUrl = '/logout/';

                                $timeout(function() {
                                    $window.location.href = redirUrl;
                                }, 300);
                            }
                        },
                        failureCallBack: function(err) {
                            $log.info(err);
                        }
                    });
                }

            })();
        }
    ]
);