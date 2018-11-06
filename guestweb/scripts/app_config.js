// to be deleted

sntGuestWeb.factory('authInterceptor', function ($rootScope, $q, $location) {
	return {
		request: function (config) {
			config.headers = config.headers || {};

			if (typeof $rootScope.accessToken !== "undefined") {

				config.headers.Authorization = $rootScope.accessToken;
			}

			return config;
		},
		response: function (response) {

			if (response.status === 401) {
        // handle the case where the user is not authenticated
    }

    return response || $q.when(response);
}
};
});


sntGuestWeb.factory('timeoutHttpIntercept', function ($rootScope, $q) {
    return {
      'request': function(config) {
        config.timeout = 80000; // set timeout
        return config;
      }
    };
 });

sntGuestWeb.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
	$httpProvider.interceptors.push('timeoutHttpIntercept');
});


sntGuestWeb.run(function($rootScope, $location, $http, $window) {

	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams) {

		if (toState.name === 'noOptionAvailable' && (fromState.name === 'emailVerification' || fromState.name === 'resetPassword')) {
			event.preventDefault();
		} else {
			$rootScope.title = toState.title;
		}	
		
	});
	
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // Hide loading message
      
      console.log(error);
      // TODO: Log the error in proper way
    });

	if ($rootScope.trackingID && $rootScope.trackingID.length > 0) {
		// track pageview on state change
		$rootScope.$on('$stateChangeSuccess', function() {
			$window.ga('send', 'pageview', $location.path());
		});
	}
});
