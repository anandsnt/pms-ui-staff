hkRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// let's redirect all undefined states to dashboard state
		$urlRouterProvider.otherwise('/staff_house/navmain/dashboard');

		$stateProvider.state('hk', {
			url: '/staff_house',
			templateUrl: 'partials/hk_main.html',
			controller: 'appController'
		});

		$stateProvider.state('hk.navmain', {
			url: '/navmain',
			templateUrl: 'partials/nav_main.html'
		});
	
		$stateProvider.state('hk.navmain.dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html',
			controller: 'dashboardController'
		});

		// search state
		$stateProvider.state('hk.navmain.search', {
			url: '/search',
			templateUrl: 'partials/search.html',
			controller: 'searchController'
		});	

		$stateProvider.state('hk.roomDetails', {
			url: '/room_details',
			templateUrl: 'partials/room_details.html',
			controller: 'roomDetailsController'
		});
		
		
	}
]);