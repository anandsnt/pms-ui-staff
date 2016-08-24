
login.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/login');

		$stateProvider.state('login', {
			url: '/login',
			templateUrl: '/assets/partials/login.html',
			controller: 'loginCtrl',
			title: 'Login'
		});
                
		$stateProvider.state('stationlogin', {
			url: '/stationlogin',
			templateUrl: '/assets/partials/stationLogin.html',
			controller: 'stationLoginCtrl',
			title: 'Zest Station Login'
		});
		$stateProvider.state('resetpassword', {
			url: '/reset/:token/:notifications',
			templateUrl: '/assets/partials/reset.html',
			controller: 'resetCtrl',
			title: 'Reset Password'
		});

		$stateProvider.state('activateuser', {
			url: '/activate/:token/:user/:username',
			templateUrl: '/assets/partials/activate.html',
			controller: 'activateCtrl',
			title: 'Activate User'
		});

		$stateProvider.state('selectProperty', {
			url: '/property',
			templateUrl: '/assets/partials/selectProperty.html',
			controller: 'selectPropertyCtrl',
			title: 'Select Property'
		});

	}
]);