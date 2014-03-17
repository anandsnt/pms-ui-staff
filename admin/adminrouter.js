admin.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/admin/dashboard');

		$stateProvider.state('admin', {
			//abstract: true,
			url: '/admin',
			templateUrl: 'views/landing.html',
			controller: 'adminController'
		});

		$stateProvider.state('admin.dashboard', {
			url: '/dashboard',
			templateUrl: 'views/dashboard.html',
			controller: 'dashboardController'
		});

		
		
	}
]);
