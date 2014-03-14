
var snt = angular.module('snt',['ngRoute','ui.bootstrap','pickadate']);

snt.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/assets/landing/landing.html',
		controller: 'checkOutLandingController',
		title: 'Checkout'
	});


	//checkout now routings

	$routeProvider.when('/checkoutBalance', {
		templateUrl: '/assets/checkoutnow/partials/checkoutBalance.html',
		controller: 'checkOutBalanceController',
		title: 'Balance - Checkout Now'
	});

	$routeProvider.when('/checkOutNow', {
		templateUrl: '/assets/checkoutnow/partials/checkoutConfirmation.html',
		controller: 'checkOutConfirmationController',
		title: 'Confirm - Checkout Now'
	});

	$routeProvider.when('/checkOutNowSuccess', {
		templateUrl: '/assets/checkoutnow/partials/checkOutStatus.html',
		controller: 'checkOutStatusController',
		title: 'Status - Checkout Now'
	});

	//checkout later routings

	$routeProvider.when('/checkOutLater', {
		templateUrl: '/assets/checkoutlater/partials/checkOutLater.html',
		controller: 'checkOutLaterController',
		title: 'Checkout Later'
	});

	$routeProvider.when('/checkOutLaterSuccess/:id', {
		templateUrl: '/assets/checkoutlater/partials/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Checkout Later'
	})


	// error routings 

	$routeProvider.when('/authFailed', {
		templateUrl: '/assets/shared/authenticationFailedView.html',
		title: 'Login Failed'
	});
	$routeProvider.when('/serverError', {
		templateUrl: '/assets/shared/serverErrorView.html',
		title: 'Server Unreachable'
	});

	//check in routings

	$routeProvider.when('/checkinConfirmation', {
		templateUrl: '/assets/checkin/partials/checkInConfirmation.html',
		controller : 'checkInConfirmationViewController',
		title: 'Check In'
	});

	$routeProvider.when('/checkinDatePicker', {
		templateUrl: '/assets/checkin/partials/checkinDatePicker.html',
		controller : 'checkinDatePickerController',
		title: 'Pick Date - Check In'
	});

	$routeProvider.when('/checkinKeys', {
		templateUrl: '/assets/checkin/partials/checkInKeys.html',
		controller : 'checkInKeysController',
		title: 'Keys - Check In'
	});

	$routeProvider.when('/checkinReservationDetails', {
		templateUrl: '/assets/checkin/partials/checkInReservationDetails.html',
		controller : 'checkInReservationDetails',
		title: 'Details - Check In'
	});

	$routeProvider.when('/checkinUpgrade', {
		templateUrl: '/assets/checkin/partials/checkinUpgradeRoom.html',
	    controller : 'checkinUpgradeRoomContorller',
	    title: 'Upgrade - Check In'
	});

	$routeProvider.when('/checkinSuccess', {
		templateUrl: '/assets/checkin/partials/checkinSuccess.html',
	    title: 'Status - Check In'
	});
	

	$routeProvider.otherwise({
		redirectTo: '/'
	});




}]);








snt.controller('rootController', ['$rootScope','$scope','$attrs', 'UserService','$location','authenticationService', function($rootScope,$scope,$attrs, UserService,$location,authenticationService) {




	//store basic details as rootscope variables

	$rootScope.reservationID = $attrs.reservationId;
	$rootScope.hotelName     = $attrs.hotelName;
	$rootScope.userName      = $attrs.userName;
	$rootScope.checkoutDate  = $attrs.checkoutDate;
	$rootScope.checkoutTime  = $attrs.checkoutTime;
	$rootScope.userCity   	 = $attrs.city;
	$rootScope.userState     = $attrs.state;
	$rootScope.roomNo        = $attrs.roomNo;
	$rootScope.isLateCheckoutAvailable  = ($attrs.isLateCheckoutAvailable  === 'true') ? true : false;
	$rootScope.emailAddress  = $attrs.emailAddress;
	$rootScope.hotelLogo     = $attrs.hotelLogo;

	$rootScope.hotelPhone    = $attrs.hotelPhone
	$rootScope.isCheckedout  = ($attrs.isCheckedout === 'true') ? true : false;
	$rootScope.isCheckin     =   ($attrs.isCheckin ==='true') ? true : false;
	$rootScope.isActiveToken  =   ($attrs.isActiveToken ==='true') ? true : false;

	$rootScope.reservationStatus = $attrs.reservationStatus;
	$rootScope.isCheckedin  = ($attrs.reservationStatus ==='CHECKEDIN')? true :false;
	$rootScope.isActiveToken   = ($attrs.isActiveToken ==='true') ? true : false;


   	// page navigatons if any of following conditions happpens

   	if($attrs.reservationStatus ==='CHECKEDIN')
		$location.path('/checkinSuccess');
	else if($rootScope.isCheckin)
		$location.path('/checkinConfirmation');
	else if($rootScope.isCheckedout)
		$location.path('/checkOutNowSuccess');
	else if($attrs.isLateCheckoutAvailable  === 'false')
		$location.path('/checkOutNow');
	



	if($attrs.accessToken != "undefined")
		$rootScope.accessToken = $attrs.accessToken	;

	console.log($attrs);

}]);

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

	$rootScope.$on("$routeChangeSuccess", function(event, currentRoute, previousRoute){
		//Change page title, based on Route information
		$rootScope.title = currentRoute.title;
	});

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
		if(next === current) {
			if($rootScope.isCheckin && !$rootScope.isCheckedout)
				$location.path('/checkinConfirmation');
				 else if (!$rootScope.isLateCheckoutAvailable) 
			    $location.path('/checkOutNow');
			else
				$location.path('/');
		}
	});
});


(function() {
	var checkOutLandingController = function($rootScope,$location,$scope) {
		//if checkout is already done

	if($rootScope.isCheckedin){
		$scope.pageSuccess = false;
		$location.path('/checkinSuccess');
	}
	else if($rootScope.isCheckin){
		$scope.pageSuccess = false;
		$location.path('/checkinConfirmation');
	}
	else if($rootScope.isCheckedout){
		$scope.pageSuccess = false;
		$location.path('/checkOutNowSuccess');
	}
	else if(!$rootScope.isLateCheckoutAvailable){
		$scope.pageSuccess = false;
		$location.path('/checkOutNow');
	}
	else
		$scope.pageSuccess = true;
	}


	var dependencies = [
	'$rootScope','$location','$scope',
	checkOutLandingController
	];

	snt.controller('checkOutLandingController', dependencies);
})();


snt.filter('customizeLabelText', function () {
    return function (input, scope) {
        return input.substring(0, 1) +" ' "+ input.substring(1, 2).toBold() +" ' "+ input.substring(2);
    }
});




