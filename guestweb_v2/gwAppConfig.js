// to be deleted

sntGuestWeb.factory('authInterceptor', function($rootScope, $q, $location) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if (typeof $rootScope.accessToken !== "undefined") {
                config.headers.Authorization = $rootScope.accessToken;
            }
            return config;
        },
        response: function(response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
});


sntGuestWeb.factory('timeoutHttpIntercept', function($rootScope, $q) {
    return {
        'request': function(config) {
            config.timeout = 80000; // set timeout
            return config;
        }
    };
});

sntGuestWeb.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('timeoutHttpIntercept');
});


sntGuestWeb.run(function($rootScope, $state, $stateParams, $window) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        // Hide loading message
        console.error(error);
    });
    // track pageview on state change by  google analytics
    $rootScope.$on('$stateChangeSuccess', function(event) {
        // $window.ga('send', 'pageview', $location.path());
    });
    // the page was getting loaded and scrolled to bottom by default
    // to override that we use the following
    $rootScope.$on('$viewContentLoaded', function() {
        var interval = setInterval(function() {
            if (document.readyState == "complete") {
                $window.scrollTo(0, 0);
                clearInterval(interval);
            }
        }, 20);
    });
});
