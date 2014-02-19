
var snt = angular.module('snt', ['ngRoute']);

snt.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/assets/landing/landing.html',
		controller: 'checkOutLandingController',
		resolve: {
			// load only when urls and user have been loadded
			load: function(UrlService, UserService) {

				return UrlService.fetch() && UserService.fetch();
			}
		}
	});

	$routeProvider.when('/checkoutBalance', {
		templateUrl: '/assets/checkoutnow/partials/checkoutBalance.html',
		controller: 'checkOutBalanceController'
	});

	$routeProvider.when('/checkOutNow', {
		templateUrl: '/assets/checkoutnow/partials/checkoutConfirmation.html',
		controller: 'checkOutConfirmationController'
	});

	$routeProvider.when('/checkOutNowSuccess', {
		templateUrl: '/assets/checkoutnow/partials/checkOutStatus.html',
		controller: 'checkOutStatusController'
	});

	$routeProvider.when('/checkOutLater', {
		templateUrl: '/assets/checkoutlater/partials/checkOutLater.html',
		controller: 'checkOutLaterController'
	});

	$routeProvider.when('/checkOutLaterSuccess/:id', {
		templateUrl: '/assets/checkoutlater/partials/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController'
	})
	$routeProvider.when('/authFailed', {
		templateUrl: '/assets/shared/authenticationFailedView.html'
	});

	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]);

snt.controller('rootController', ['$rootScope','$scope','$attrs', 'UserService','$location','$window','authenticationService', function($rootScope,$scope,$attrs, UserService,$location,$window,authenticationService) {

	
	if ($window.sessionStorage.token)
	delete $window.sessionStorage.token

	$rootScope.reservationID  = $attrs.reservationId

	$rootScope.hotelName     = $attrs.hotelName
	$rootScope.userName      = $attrs.userName
	$rootScope.checkoutDate  = $attrs.checkoutDate
	$rootScope.checkoutTime  = $attrs.checkoutTime
	$rootScope.userCity   	 = $attrs.city
	$rootScope.userState     = $attrs.state
	$rootScope.roomNo        = $attrs.roomNo
	$rootScope.isLateCheckoutAvailable  = $attrs.isLateCheckoutAvailable

if ($rootScope.isLateCheckoutAvailable === 'false') 
		$location.path('/checkOutNow')


if($attrs.accessToken != "undefined")
	$window.sessionStorage.accessToken = $attrs.accessToken	

console.log($attrs)


	
}]);


snt.factory('authInterceptor', function ($rootScope, $q, $window,$location) {
  return {
    request: function (config) {
      config.headers = config.headers || {};

      if ($window.sessionStorage.accessToken) {
      
        config.headers.Authorization = $window.sessionStorage.accessToken;
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


    

(function() {
	var checkOutLandingController = function($rootScope,$location) {

	if ($rootScope.isLateCheckoutAvailable === 'false') 
		 $location.path('/checkOutNow')
};

	var dependencies = [
		'$rootScope','$location',
		checkOutLandingController
	];

	snt.controller('checkOutLandingController', dependencies);
})();