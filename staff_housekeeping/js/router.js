hkRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// let's redirect all undefined states to dashboard state
		$urlRouterProvider.otherwise('/staff_house/dashboard');

		$stateProvider.state('hk', {
			abstract : true,
			url: '/staff_house',
			templateUrl: '/assets/partials/hk_main.html',
			controller: 'appController'
		});

		$stateProvider.state('hk.navmain', {
			abstract: true,
			url: '',
			templateUrl: '/assets/partials/nav_main.html',
			controller: 'HKnavCtrl'
		});
	
		$stateProvider.state('hk.navmain.dashboard', {
			url: '/dashboard',
			templateUrl: '/assets/partials/dashboard.html',
			controller: 'DashboardController'
		});

		// search state
		$stateProvider.state('hk.navmain.search', {
			url: '/search',
			templateUrl: '/assets/partials/search.html',
			controller: 'searchController'
		});	

		$stateProvider.state('hk.roomDetails', {
			url: '/room_details',
			templateUrl: '/assets/partials/room_details.html',
			controller: 'roomDetailsController'
		});
		
		
	}
]);
