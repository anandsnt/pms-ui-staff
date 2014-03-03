sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/staff')

		$stateProvider.state('staff', {
			url: '/staff',
			templateUrl: 'partials/rover.html'
		});
		
		$stateProvider.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html'
		});

		// search state
		$stateProvider.state('search', {
			url: '/search',
			templateUrl: 'partials/search.html',
			controller: 'searchController'
		});
	
		$stateProvider.state('guestcard', {
			url: '/guestcard',
			templateUrl: 'partials/guestcard.html',
			controller: 'guestCardController'
		});	
		// let's redirect all undefined states to dashboard state
		
	}
]);