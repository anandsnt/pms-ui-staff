hkRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// let's redirect all undefined states to dashboard state
		$urlRouterProvider.otherwise('/staff_house/dashboard');

		$stateProvider.state('hk', {
			abstract : true,
			url: '/staff_house',
			templateUrl: '/assets/partials/hkApp.html',
			controller: 'HKappCtrl'
		});

		$stateProvider.state('hk.navmain', {
			abstract: true,
			url: '',
			templateUrl: '/assets/partials/hkNav.html',
			controller: 'HKnavCtrl'
		});
	
		$stateProvider.state('hk.navmain.dashboard', {
			url: '/' + ROUTES.dashboard,
			templateUrl: '/assets/partials/hkDashboard.html',
			controller: 'HKDashboardCtrl'
		});

		// search state
		$stateProvider.state('hk.navmain.search', {
			url: '/' + ROUTES.search,
			templateUrl: '/assets/partials/hkSearch.html',
			controller: 'HKSearchCtrl'
		});	

		$stateProvider.state('hk.roomDetails', {
			url: '/' + ROUTES.roomDetails + '/:id',
			templateUrl: '/assets/partials/hkRoomDetails.html',
			controller: 'HKRoomDetailsCtrl'
		});
		
		
	}
]);
