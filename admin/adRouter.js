admin.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/admin/dashboard');

		$stateProvider.state('admin', {
			//abstract: true,
			url: '/admin',
			templateUrl: 'partials/adApp.html',
			controller: 'ADAppCtrl'
		});

		$stateProvider.state('admin.dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard/adDashboard.html',
			controller: 'ADDashboardCtrl'
		});

		
		
	}
]);
