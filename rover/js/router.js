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
			templateUrl: 'partials/search.html',
			controller: 'searchController'
		});

		$stateProvider.state('staycard', {
			url: '/staycard',
			templateUrl: 'partials/staycard.html'
		});		
		$stateProvider.state('staycard.guestcard', {
			url: '/guestcard',
			templateUrl: 'partials/guestcard.html',
			controller: 'guestCardController'
		});	
		// let's redirect all undefined states to dashboard state
		
	}
]);