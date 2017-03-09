angular.module('sntRover').controller('topController',
    [
        '$state',
        'sntAuthorizationSrv',
        '$rootScope',
        '$location',
        '$stateParams',
        '$scope',
        '$window',
        '$log',
        'RVHotelDetailsSrv',
        '$timeout',
        function($state, sntAuthorizationSrv, $rootScope, $location, $stateParams, $scope, $window, $log, RVHotelDetailsSrv, $timeout) {

            BaseCtrl.call(this, $scope);

            var routeChange = function(event) {
                event.preventDefault();
                return false;
            };

            var setPropertyAndNavigate = function(uuid) {
                sntAuthorizationSrv.setProperty(uuid);
                // NOTE: This listener is not removed on $destroy on purpose!
                $rootScope.$on('$locationChangeStart', routeChange);

                $window.history.pushState("initial", "Showing Dashboard", "/staff/h/" + uuid);
                if ($stateParams.state) {
                    var params = ($stateParams.params && angular.fromJson(decodeURI($stateParams.params))) || {};

                    $state.go($stateParams.state.replace(/-/g, '.'), params);
                } else {
                    $state.go('rover.dashboard');
                }
            };

            (function() {
                if ($stateParams.uuid) {
                    setPropertyAndNavigate($stateParams.uuid);
                } else {
                    $log.info('setPropertyAndNavigate');
                    $scope.callAPI(RVHotelDetailsSrv.getDefaultUUID, {
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