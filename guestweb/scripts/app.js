var snt = angular.module('snt', ['ngRoute']);

snt.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'assets/landing/landing.html',
		resolve: {
			// load only when urls and user have been loadded
			load: function(UrlService, UserService) {
				return UrlService.fetch() && UserService.fetch();
			}
		}
	});

	$routeProvider.when('/checkoutBalance', {
		templateUrl: 'assets/checkoutnow/partials/checkoutNow.html',
		controller: 'checkOutNowController'
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

	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]);

snt.controller('rootController', ['$scope','$attrs', 'UserService','$location','authenticationService', function($scope,$attrs, UserService,$location,authenticationService) {

	alert("TOKEN------"+$attrs.token+"\n\nID------"+$attrs.reservationid+"\n\nTYPE------"+$attrs.checkouttype)

/* need to work on

	if ($attrs.checkouttype ==  "checkoutNow") 
		$location.path('/checkOutNow')
	else
		//to do 
*/

	
	UserService.fetch().then(function(user) {
		$scope.user = user;
	});

	var authendicationData = {

		"token":$attrs.token,
		"reservationidID":$attrs.reservationid,
		"checkoutType":$attrs.checkouttype
	}

	authenticationService.setAuthenticationDetails(authendicationData)
	alert(authenticationService.reservationidID)

	
}]);