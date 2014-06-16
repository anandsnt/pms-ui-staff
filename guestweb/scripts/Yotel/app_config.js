// to be deleted

snt.factory('authInterceptor', function ($rootScope, $q,$location) {
	return {
		request: function (config) {
			config.headers = config.headers || {};

			if ($rootScope.accessToken) {

				config.headers.Authorization = $rootScope.accessToken;
			}
			else{

				$location.path('/authFailed');
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


snt.factory('timeoutHttpIntercept', function ($rootScope, $q) {
    return {
      'request': function(config) {
        config.timeout = 5000; // set timeout
        return config;
      }
    };
 });

snt.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
	$httpProvider.interceptors.push('timeoutHttpIntercept');
});



snt.run(function($rootScope, $location, $http){

	$rootScope.$on("$routeChangeSuccess", function(event, currentRoute, previousRoute){
		//Change page title, based on Route information
		$rootScope.title = currentRoute.title;
	});

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
		if(next === current) {
		if($rootScope.isCheckedin)
			$location.path('/checkinSuccess');
		else if($rootScope.isCheckedout)
			$location.path('/checkOutNowSuccess');
		else if($rootScope.isCheckin && !$rootScope.isCheckedout)
				$location.path('/checkinConfirmation');
		else if (!$rootScope.isLateCheckoutAvailable)
			    $location.path('/checkOutNow');
			else{
				$location.path('/');

			}
		}
	});
});
