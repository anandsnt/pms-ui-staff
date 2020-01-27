angular.module('snt.utils').directive('sntSessionTimeout', function () {

    var sessionTimeoutCtrl = [
        '$scope',
        'sessionTimeoutHandlerSrv', 
        'ngDialog', 
        'sntSharedLoginSrv',
        '$rootScope',
        'sntActivity',
        '$timeout',
        'sntAuthorizationSrv',
        '$window',        
        function ($scope, sessionTimeoutHandlerSrv, ngDialog, sntSharedLoginSrv, $rootScope, sntActivity, $timeout, sntAuthorizationSrv, $window) {
            var sessionTimeoutDialog;

            $scope.loginData = {};
            var ACCOUNT_LOCKED_STR = 'account has been locked';

            var idleTimeSecondsCounter = 0,
                tokenExpiryTimeSecs,
                validateTokenTimer;

            
            /**
             * Show session timeout popup
             */
            var showSessionTimeoutPopup = function() {
                    $rootScope.$broadcast('resetLoader');
                    // Remove the token, when the session times out at the client side rather than when an API call is triggered
                    $window.localStorage.removeItem('jwt');

                    if (!sessionTimeoutDialog) {
                       $scope.loginData.autoLogoutDelay = Math.floor((sessionTimeoutHandlerSrv.getAutoLogoutDelay() / 1000 / 60) << 0);

                       sessionTimeoutDialog = ngDialog.open({
                            template: '/assets/partials/rvExtendSessionModal.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            closeByEscape: false,
                            closeByDocument: false
                        }); 
                    }
                    
                };

            /**
             * Continue session by entering the password 
             */
            $scope.continueSession = function() {
                var user = {
                    email: sessionTimeoutHandlerSrv.getLoginEmail(),
                    password: $scope.loginData.password
                };

                $scope.hasError = false;
                $scope.errorMessage = '';
                sntActivity.start('API_REQ');
                sntSharedLoginSrv.login(user).then(function(response) {
                    if (response.status === 'success') {
                        ngDialog.close(sessionTimeoutDialog.id);
                        sessionTimeoutDialog = null;
                        $scope.loginData = {}; 
                    }
                    sntActivity.stop('API_REQ');
                }, function (error) {
                    $scope.hasError = error.status === 'failure';
                    $scope.errorMessage = _.isArray(error.errors) ? error.errors[0] : '';

                    $scope.loginData.password = '';
                    sntActivity.stop('API_REQ');

                    // This is a work around to identify the account locked scenario.
                    // Once the api provides the flag for account locked, we can use that to check this particular case
                    if ($scope.errorMessage && $scope.errorMessage.indexOf(ACCOUNT_LOCKED_STR) > -1) {
                        $timeout(function () {
                            $window.location.href = '/logout';
                        }, 500);
                        
                    }
                });
            };

            /**
             * Implements the logout functionality
             */
            $scope.logout = function () {
                sntSharedLoginSrv.logout().finally(function() {
                    $timeout(function () {
                        if (sessionTimeoutHandlerSrv.getWorker()) {
                            sessionTimeoutHandlerSrv.stopTimer();
                        }
                        $window.location.href = '/logout';
                    });
                });

            };

            /**
             * Fetch the login details 
             */
            var fetchLoginDetails = function() {
                var onLoginFetchSuccess = function (response) {
                    if (response.auto_logout_delay) {
                        sessionTimeoutHandlerSrv.setAutoLogoutDelay(response.auto_logout_delay * 1000);
                        tokenExpiryTimeSecs = response.auto_logout_delay - 30;
                    }
                    sessionTimeoutHandlerSrv.setLoginEmail(response.login);
                };

                if (!sessionTimeoutHandlerSrv.getAutoLogoutDelay()) {
                    sntSharedLoginSrv.getSessionDetails().then(onLoginFetchSuccess); 
                }
                
            };

            $scope.$on('CLOSE_SESSION_TIMEOUT_POPUP', function() {
                if (sessionTimeoutDialog) {
                    sessionTimeoutDialog.close();
                }
            });

            $scope.$on('SET_HOTEL', function() {
                fetchLoginDetails();
            });

            /**
             * Refresh the token when its about to expire
             */
            var refreshToken = function () {
                sntSharedLoginSrv.refreshToken().then(function() {

                });
            };

            /**
             * Check and validate the token expiry based on browser idle time
             */
            var checkAndValidateToken = function () {
                
                if (idleTimeSecondsCounter < tokenExpiryTimeSecs) {
                    refreshToken();
                } else {
                    validateTokenTimer = setInterval(checkAndValidateToken, 1000);
                }

            };

            /**
             * Set up the event listeners to track the various browser events to identify browser inactivity 
             */
            var setUpEventListeners = function () {
                var checkIdleTime = function () {
                    idleTimeSecondsCounter++;
                };

                document.onclick = function() {
                    idleTimeSecondsCounter = 0;
                };
                
                document.onmousemove = function() {
                    idleTimeSecondsCounter = 0;
                };
                
                document.onkeypress = function() {
                    idleTimeSecondsCounter = 0;
                };

                setInterval(checkIdleTime, 1000);

            };

            var init = function () {
                setUpEventListeners();

                if (!sessionTimeoutHandlerSrv.getWorker()) {
                    sessionTimeoutHandlerSrv.initWorker();
                    $timeout(function () {
                        sessionTimeoutHandlerSrv.getWorker().addEventListener('message', function(event) {
                            var data = event.data;
        
                            switch (data.cmd) {
                                case 'SHOW_TIMEOUT_POPUP':
                                    if (validateTokenTimer) {
                                        clearInterval(validateTokenTimer); 
                                    }
                                    showSessionTimeoutPopup();
                                    break;
                                
                                case 'RFRESH_TOKEN':
                                    checkAndValidateToken();
                                default:
        
                            }
                            
                        });
    
                    }, 500);
                }
            };

            init();

    }];

    return {
        restrict: 'EA',
        require: '^ngModel',
        controller: sessionTimeoutCtrl
    };

});
