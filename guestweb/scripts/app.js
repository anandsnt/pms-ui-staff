
var snt = angular.module('snt',['ngRoute','ui.bootstrap']);

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
	$routeProvider.when('/serverError', {
		templateUrl: '/assets/shared/serverErrorView .html',
	});

	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]);

snt.controller('rootController', ['$rootScope','$scope','$attrs', 'UserService','$location','$window','authenticationService', function($rootScope,$scope,$attrs, UserService,$location,$window,authenticationService) {

	
	if ($window.sessionStorage.token)
		delete $window.sessionStorage.token

	//store basic details as rootscope variables

	$rootScope.reservationID  = $attrs.reservationId
	$rootScope.hotelName     = $attrs.hotelName
	$rootScope.userName      = $attrs.userName
	$rootScope.checkoutDate  = $attrs.checkoutDate
	$rootScope.checkoutTime  = $attrs.checkoutTime
	$rootScope.userCity   	 = $attrs.city
	$rootScope.userState     = $attrs.state
	$rootScope.roomNo        = $attrs.roomNo
	$rootScope.isLateCheckoutAvailable  = ($attrs.isLateCheckoutAvailable  === 'true') ? true : false;
	$rootScope.emailAddress    = $attrs.emailAddress

	$rootScope.hotelPhone      = $attrs.hotelPhone
	$rootScope.isCheckedout   = ($attrs.isCheckedout === 'true') ? true : false;


	//if chekout is already done
 	if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

	//if late chekout is unavailable navigate to checkout now page

	else if (!$rootScope.isLateCheckoutAvailable) 
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


snt.run(function($rootScope,$location,$http){
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
    
    if(next === current)
    	$location.path('/')
 
});
});


(function() {
	var checkOutLandingController = function($rootScope,$location) {
		//if checkout is already done

 	if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

	else if (!$rootScope.isLateCheckoutAvailable) 
			$location.path('/checkOutNow')
	};


	var dependencies = [
	'$rootScope','$location',
	checkOutLandingController
	];

	snt.controller('checkOutLandingController', dependencies);
})();