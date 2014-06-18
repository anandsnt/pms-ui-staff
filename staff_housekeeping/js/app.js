var hkRover = angular.module('hkRover',['ui.router', 'ngTouch']);

hkRover.run(['$rootScope', '$state', '$stateParams', 'ngDialog', 
	function ($rootScope, $state, $stateParams, ngDialog) {

	// It's very handy to add references to $state and $stateParams to the $rootScope
	// so that you can access them from any scope within your applications.For example,
	// <li ui-sref-active="active }"> will set the <li> // to active whenever
	// 'contacts.list' or one of its decendents is active.
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);


/**
* Interceptor to which handles OWS connectivity error
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
			if(rejection.status == 520) {
				$rootScope.showOWSError = true;
			}
			return $q.reject(rejection);
		}
	};
});


hkRover.config(function ($httpProvider) {
	$httpProvider.interceptors.push('owsCheckInterceptor');
});