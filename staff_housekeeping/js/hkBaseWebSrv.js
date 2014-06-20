/**
* Interceptor which handles OWS connectivity error
* Set the flag in rootscope for OWS error
*/
hkRover.factory('owsCheckInterceptor', function ($rootScope, $q,$location) {
	return {
		request: function (config) {
			return config;
		},
		response: function (response) {
    		return response || $q.when(response);
		},
		responseError: function(rejection) {
			if(rejection.status == 520 && 
				rejection.config.url !== '/admin/test_pms_connection') {
				$rootScope.showOWSError();
			}
			return $q.reject(rejection);
		}
	};
});


hkRover.config(function ($httpProvider) {
	$httpProvider.interceptors.push('owsCheckInterceptor');
});