sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/dashboard')

		$stateProvider.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html'
		});

		// search state
		$stateProvider.state('search', {
			url: '/search',
			templateUrl: 'partials/search.html'
		});

		// let's redirect all undefined states to dashboard state
		
	}
]);