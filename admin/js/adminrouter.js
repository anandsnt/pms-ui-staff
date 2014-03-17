admin.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/admin/dashboard');

		$stateProvider.state('admin', {
			abstract: true,
			url: '/admin/dashboard',
			templateUrl: 'partials/landing.html',
			controller: 'adminController'
		});


		
		
	}
]);