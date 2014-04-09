login.config([	
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/login');
		
		$stateProvider.state('login', {
			url: '/login',
			templateUrl: '/assets/partials/login.html',
			controller: 'loginCtrl'
		});
		
		$stateProvider.state('resetpassword', {
			url: '/reset/:token',
			templateUrl: '/assets/partials/reset.html',
			controller: 'resetCtrl'
		});

	}
]);
