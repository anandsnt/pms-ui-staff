angular.module('admin').controller('adTopCtrl',
    ['$state', '$rootScope', '$scope', '$window', '$stateParams', 'sntAuthorizationSrv', 'ADAppSrv', '$log', '$timeout', 'adminDashboardConfigData',
        function($state, $rootScope, $scope, $window, $stateParams, sntAuthorizationSrv, ADAppSrv, $log, $timeout, adminDashboardConfigData) {

            BaseCtrl.call(this, $scope);

            var routeChange = function(event) {
                event.preventDefault();
                return false;
            };

            var setPropertyAndNavigate = function(uuid) {
                if ('snt' === $state.current.name && $rootScope.isSntAdmin) {
                    $window.history.pushState("initial", "Showing Dashboard", "/admin/snt");
                } else {
                    if (uuid) {
                        $window.history.pushState("initial", "Showing Dashboard", "/admin/h/" + uuid);
                        sntAuthorizationSrv.setProperty(uuid);
                    } else {
                        // fetch uuid and then navigate
                    }
                }

                // NOTE: This listener is not removed on $destroy on purpose!
                $rootScope.$on('$locationChangeStart', routeChange);
                if ($stateParams.state) {
                    var params = ($stateParams.params && angular.fromJson(decodeURI($stateParams.params))) || {};

                    // Exactonline oAuth returns code - Add that to the params
                    if ($stateParams.code) {
                        params.code = $stateParams.code;
                    }

                    $state.go($stateParams.state.replace(/-/g, '.'), params);
                } else {
                    $state.go('admin.dashboard', {
                        menu: 0
                    });
                }
            };

            (function() {
                $rootScope.adminRole = adminDashboardConfigData['admin_role'];
                $rootScope.isServiceProvider = adminDashboardConfigData['is_service_provider'] ||
                    adminDashboardConfigData['is_service_provider_admin'];
                $rootScope.hotelId = adminDashboardConfigData['hotel_id'];
                $rootScope.isPmsConfigured = adminDashboardConfigData['is_pms_configured'] === 'true';
                $rootScope.isSntAdmin = $rootScope.adminRole === 'snt-admin';
                $rootScope.isChainAdmin = adminDashboardConfigData['is_chain_admin'];

                if ($stateParams.uuid || ( $rootScope.isSntAdmin && 'snt' === $state.current.name)) {
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
