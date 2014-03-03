sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/staff/dashborad')

		$stateProvider.state('rover', {
			url: '/staff',
			templateUrl: 'partials/rover.html',
			controller: 'roverController'
		});
		
		$stateProvider.state('rover.dashboard', {
			url: '/dashborad',
			templateUrl: 'partials/dashboard.html'
		});
/*
		// search state
		$stateProvider.state('search', {
			url: '/search',
			templateUrl: 'partials/search.html',
			controller: 'searchController'
		});*/

		// let's redirect all undefined states to dashboard state
		
	}
]);