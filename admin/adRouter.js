admin.config([	
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/admin/dashboard');

		$stateProvider.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: '/assets/partials/adApp.html',
			controller: 'ADAppCtrl'
		});

		$stateProvider.state('admin.dashboard', {
			url: '/dashboard',
			templateUrl: '/assets/partials/dashboard/adDashboard.html',
			controller: 'ADDashboardCtrl'

		});

		$stateProvider.state('admin.hoteldetails', {
			templateUrl: '/assets/partials/hotel/hotelDetails.html',
			controller: 'ADHotelDetailsCtrl',
			url : '/hoteldetails/:id'
		});
		
		$stateProvider.state('admin.users', {
			templateUrl: '/assets/partials/users/adUserList.html',
			controller: 'ADUserListCtrl',
			url : '/users'
		});

		$stateProvider.state('admin.chains', {
			templateUrl: '/assets/partials/chains/adChainList.html',
			controller: 'ADChainListCtrl',
			url : '/chains'
		});

		
		// $stateProvider.state('admin.useredit', {
			// templateUrl: '/assets/partials/users/adUserEdit.html',
			// controller: 'ADUserListCtrl',
			// url : '/useredit'
		// });
		
		$stateProvider.state('admin.userdetails', {
			templateUrl: '/assets/partials/users/adUserEdit.html',
			controller: 'ADUserListCtrl',
			url : '/user/:page'
		});
		


		
		$stateProvider.state('admin.hotels', {
			templateUrl: '/assets/partials/hotel/adHotelList.html',
			controller: 'ADHotelListCtrl',
			url : '/hotels'
		});
		
		$stateProvider.state('admin.mapping', {
			templateUrl: '/assets/partials/hotel/externalMapping.html',
			controller: 'ADMappingCtrl',
			url : '/mapping/:hotel_id'
		});
	}
]);
