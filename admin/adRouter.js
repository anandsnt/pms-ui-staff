admin.config([	
	'$stateProvider',
	'$urlRouterProvider',
	'$translateProvider',
	function($stateProvider, $urlRouterProvider, $translateProvider) {
		$translateProvider.useStaticFilesLoader({
		  prefix: '/assets/adLocales/',
		  suffix: '.json'
		});
		// dashboard state
		$urlRouterProvider.otherwise('/admin/dashboard/0');

		$stateProvider.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: '/assets/partials/adApp.html',
			controller: 'ADAppCtrl',
			resolve: {
                adminMenuData: function(ADAppSrv) {
                    return ADAppSrv.fetch();
                }
            }
		});

		
		


	}
]);
