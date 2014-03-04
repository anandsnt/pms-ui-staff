
var snt = angular.module('snt',['ngRoute','ui.bootstrap']);

snt.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/assets/landing/landing.html',
		controller: 'checkOutLandingController'
	});


	//checkout now routings

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

	//checkout later routings

	$routeProvider.when('/checkOutLater', {
		templateUrl: '/assets/checkoutlater/partials/checkOutLater.html',
		controller: 'checkOutLaterController'
	});

	$routeProvider.when('/checkOutLaterSuccess/:id', {
		templateUrl: '/assets/checkoutlater/partials/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController'
	})


	// error routings 

	$routeProvider.when('/authFailed', {
		templateUrl: '/assets/shared/authenticationFailedView.html'
	});
	$routeProvider.when('/serverError', {
		templateUrl: '/assets/shared/serverErrorView.html',
	});

	//check in routings

	$routeProvider.when('/checkinConfirmation', {
		templateUrl: '/assets/checkin/partials/checkInConfirmation.html',
		controller : 'checkInConfirmationViewController'
	});


	//to be deleted and replaced by the code below
	$routeProvider.otherwise({
		redirectTo: '/checkinConfirmation'
	});



// $routeProvider.otherwise({
// redirectTo: '/'
// });
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
		$location.path('/checkOutNowSuccess');

	if($attrs.accessToken != "undefined")
		$window.sessionStorage.accessToken = $attrs.accessToken	;

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



// snt.config(function ($httpProvider) {
// 	$httpProvider.interceptors.push('authInterceptor');
// });

snt.run(function($rootScope,$location,$http){
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
    
     if(next === current){
     	 if (!$rootScope.isLateCheckoutAvailable) 
		    $location.path('/checkOutNow')
		else
			$location.path('/')
	}
 
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


snt.filter('customizeLabelText', function () {
    return function (input, scope) {
        return input.substring(0, 1) +" ' "+ input.substring(1, 2).toBold() +" ' "+ input.substring(2);
    }
});
