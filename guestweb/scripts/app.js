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
		templateUrl: 'checkoutnow/partials/checkoutNow.html',
		controller: 'checkOutNowController'
	});

	$routeProvider.when('/checkOutNow', {
		templateUrl: 'checkoutnow/partials/checkoutConfirmation.html',
		controller: 'checkOutConfirmationController'
	});


	$routeProvider.when('/checkOutNowSuccess', {
		templateUrl: 'checkoutnow/partials/checkOutNowSuccess.html'
	});

	$routeProvider.when('/checkOutLater', {
		templateUrl: 'checkoutlater/partials/checkOutLater.html',
		controller: 'checkOutLaterController'
	});

	$routeProvider.when('/checkOutLaterSuccess/:id', {
		templateUrl: 'checkoutlater/partials/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController'
	})

	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]);

snt.controller('rootController', ['$scope', 'UserService', function($scope, UserService) {
	UserService.fetch().then(function(user) {
		$scope.user = user;
	});
}]);