sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/noOptionAvailable");

	$stateProvider.state('noOptionAvailable', {
		url: '/noOptionAvailable',
		templateUrl: '/assets/partials/gwNoOption.html',
		data: {
			pageTitle: 'Feature not available'
		}
	}).state('seeFrontDesk', {
		url: '/seeFrontDesk',
		templateUrl: '/assets/partials/gwErrorPage.html',
		data: {
			pageTitle: 'Error..'
		}
	});

}]);