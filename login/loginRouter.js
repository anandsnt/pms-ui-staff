login.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        // dashboard state
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('top', {
            url: '/',
            onEnter: [
                '$window', 'sessionInfo', function($window, sessionInfo) {
                    if (sessionInfo && sessionInfo.is_sp_admin) {
                        $window.location.href = '/login?select_property=true';
                    } else if (sessionInfo && sessionInfo.redirect_url) {
                        $window.location.href = sessionInfo.redirect_url;
                    } else {
                        $window.location.href = '/login';
                    }
                }],
            resolve: {
                sessionInfo: [
                    'loginSrv', function(loginSrv) {
                        return loginSrv.checkSession();
                    }]
            }
        });

        $stateProvider.state('login?select_property', {
            url: '/login',
            templateUrl: '/ui/pms-ui/login/partials/login.html',
            controller: 'loginCtrl',
            title: 'Login',
            onEnter: [
                '$window', '$state', function($window, $state) {
                    if (location.href.match('select_property=true')) {
                        $state.go('selectProperty');
                    } else {
                        $window.localStorage.removeItem('jwt');
                    }
                }],
            resolve: {
                errors: [
                    'resetSrv', function (resetSrv) {
                        if (location.href.match('activation_period_expired=true')) {
                            return resetSrv.handleRedirectErrors('activation_period_expired');
                        }
                    }]
            }
        });

        $stateProvider.state('stationlogin', {
            url: '/stationlogin',
            templateUrl: '/ui/pms-ui/login/partials/stationLogin.html',
            controller: 'stationLoginCtrl',
            title: 'Zest Station Login'
        });
        $stateProvider.state('resetpassword', {
            url: '/reset/:token/:notifications?status',
            templateUrl: '/ui/pms-ui/login/partials/reset.html',
            controller: 'resetCtrl',
            title: 'Reset Password'
        });

        $stateProvider.state('activateuser', {
            url: '/activate/:token/:user/:username',
            templateUrl: '/ui/pms-ui/login/partials/activate.html',
            controller: 'activateCtrl',
            title: 'Activate User'
        });

        $stateProvider.state('selectProperty', {
            url: '/property',
            templateUrl: '/ui/pms-ui/login/partials/selectProperty.html',
            controller: 'selectPropertyCtrl',
            title: 'Select Property'
        });
    }
]);
