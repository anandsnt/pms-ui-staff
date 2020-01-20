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
            
            /**
             * Show session timeout popup
             */
            var showSessionTimeoutPopup = function() {
                    $rootScope.$broadcast('resetLoader');

                    if (!sessionTimeoutDialog) {
                       sessionTimeoutDialog = ngDialog.open({
                            template: '/assets/partials/rvExtendSessionModal.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            closeByEscape: false
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
                    $scope.hasError = error.status !== 401;
                    if (error.status === 401) {
                        $scope.errorMessage = error.errors[0];
                    } else {
                        $scope.errorMessage = 'Your account has been locked';
                    }

                    $scope.loginData.password = '';
                    sntActivity.stop('API_REQ');
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
                        sessionTimeoutHandlerSrv.setAutoLogoutDelay(response.auto_logout_delay * 60 * 1000);
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

            var init = function () {

                if (!sessionTimeoutHandlerSrv.getWorker()) {
                    sessionTimeoutHandlerSrv.initWorker();
                    $timeout(function () {
                        sessionTimeoutHandlerSrv.getWorker().addEventListener('message', function(event) {
                            var data = event.data;
        
                            switch (data.cmd) {
                                case 'SHOW_TIMEOUT_POPUP': 
                                    showSessionTimeoutPopup();
                                    break;
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
