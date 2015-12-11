// to be deleted

sntGuestWeb.factory('authInterceptor', function ($rootScope, $q,$location) {
	return {
		request: function (config) {
			config.headers = config.headers || {};

			if (typeof $rootScope.accessToken !=="undefined") {

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



sntGuestWeb.run(function($rootScope, $location, $http){

	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){
		$rootScope.title =toState.title;
	});
});
