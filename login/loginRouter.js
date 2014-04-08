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

	}
]);
