
var snt = angular.module('snt', ['ngRoute']);

snt.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/assets/landing/landing.html',
		resolve: {
			// load only when urls and user have been loadded
			load: function(UrlService, UserService) {
				return UrlService.fetch() && UserService.fetch();
			}
		}
	});

	$routeProvider.when('/checkoutBalance', {
		templateUrl: 'assets/checkoutnow/partials/checkoutBalance.html',
		controller: 'checkOutBalanceController'
	});

	$routeProvider.when('/checkOutNow', {
		templateUrl: 'assets/checkoutnow/partials/checkoutConfirmation.html',
		controller: 'checkOutConfirmationController'
	});

	$routeProvider.when('/checkOutNowSuccess', {
		templateUrl: 'assets/checkoutnow/partials/checkOutNowSuccess.html'
	});

	$routeProvider.when('/checkOutLater', {
		templateUrl: 'assets/checkoutlater/partials/checkOutLater.html',
		controller: 'checkOutLaterController'
	});

	$routeProvider.when('/checkOutLaterSuccess/:id', {
		templateUrl: 'assets/checkoutlater/partials/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController'
	})
	$routeProvider.when('/authFailed', {
		templateUrl: 'assets/shared/authenticationFailedView.html'
	});

	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]);

snt.controller('rootController', ['$rootScope','$scope','$attrs', 'UserService','$location','$window','authenticationService', function($rootScope,$scope,$attrs, UserService,$location,$window,authenticationService) {

	/* need to work on

	if ($attrs.checkouttype ==  "checkoutNow") 
		$location.path('/checkOutNow')
	else
		//to do 
		*/
	if ($window.sessionStorage.token)
	delete $window.sessionStorage.token


	$rootScope.hotelName   = $attrs.hotelname

	var authenticationData = {

		"token"				: $attrs.token,
		"reservationidID"	: $attrs.reservationid,
		"checkoutType"		: $attrs.checkouttype
	}

	authenticationService.setAuthenticationDetails(authenticationData)
	
	UserService.fetch().then(function(userDetails) {

		$rootScope.checkoutDate 		= userDetails.checkoutDate
		$rootScope.checkoutTime 		= userDetails.checkoutTime
		$rootScope.roomnumber       	= userDetails.roomnumber
		$rootScope.userName 			= userDetails.userName
		$rootScope.userLocation         = userDetails.userLocation
	});

	

	$window.sessionStorage.token = authenticationData.token

	


	
}]);


snt.factory('authInterceptor', function ($rootScope, $q, $window,$location) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
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

snt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});


var hotelNamesEnum = { 
					"Carlyl Suites Hotel"      : 1, 
					"Trump International Hotel": 2, 
					"Four Seasons Hotel"       : 3 
				}
    