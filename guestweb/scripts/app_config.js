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
        config.timeout = 80000; // set timeout
        return config;
      }
    };
 });

snt.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
	$httpProvider.interceptors.push('timeoutHttpIntercept');
});



snt.run(function($rootScope, $location, $http){

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
		$rootScope.title =toState.title;
	});

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
		if(next === current) {
			// if($rootScope.isCheckedin){
			// 	$location.path('/checkinSuccess');
			// }
			// else if($rootScope.isCheckin){
			// 	$location.path('/checkinConfirmation');
			// }
			// else if($rootScope.isCheckedout){
			// 	$location.path('/checkOutStatus');
			// }
				
			// else if($rootScope.isCheckin && !$rootScope.isCheckedout)
			// 		$location.path('/checkinConfirmation');
			// else if (!$rootScope.isLateCheckoutAvailable)
			// 	    $location.path('/checkOutConfirmation');
			// 	else{
			// 		$location.path('/');

			// 	}
		}
	});
});
