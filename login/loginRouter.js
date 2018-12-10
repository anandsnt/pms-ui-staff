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
                'sessionInfo', function(sessionInfo) {
                    if (sessionInfo && sessionInfo.is_sp_admin) {
                        location.href = '/login?select_property=true';
                    } else if (sessionInfo && sessionInfo.redirect_url) {
                        location.href = sessionInfo.redirect_url;
                    } else {
                        location.href = '/login';
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
            templateUrl: '/assets/partials/login.html',
            controller: 'loginCtrl',
            title: 'Login',
            onEnter: [
                '$window', '$state', function($window, $state) {
                    if (location.href.match('select_property=true')) {
                        $state.go('selectProperty');
                    } else {
                        $window.localStorage.removeItem('jwt');
                    }
                }]
        });

        $stateProvider.state('stationlogin', {
            url: '/stationlogin',
            templateUrl: '/assets/partials/stationLogin.html',
            controller: 'stationLoginCtrl',
            title: 'Zest Station Login'
        });
        $stateProvider.state('resetpassword', {
            url: '/reset/:token/:notifications',
            templateUrl: '/assets/partials/reset.html',
            controller: 'resetCtrl',
            title: 'Reset Password'
        });

        $stateProvider.state('activateuser', {
            url: '/activate/:token/:user/:username',
            templateUrl: '/assets/partials/activate.html',
            controller: 'activateCtrl',
            title: 'Activate User'
        });

        $stateProvider.state('selectProperty', {
            url: '/property',
            templateUrl: '/assets/partials/selectProperty.html',
            controller: 'selectPropertyCtrl',
            title: 'Select Property'
        });
    }
]);
