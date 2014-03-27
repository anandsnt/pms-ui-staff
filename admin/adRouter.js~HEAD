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
			url : '/hoteldetails'
		});
		
		$stateProvider.state('admin.users', {
			templateUrl: '/assets/partials/users/adUserList.html',
			controller: 'ADUserListCtrl',
			url : '/users'
		});
		
		$stateProvider.state('admin.useredit', {
			templateUrl: '/assets/partials/users/adUserEdit.html',
			controller: 'ADUserListCtrl',
			url : '/useredit'
		});
		
		$stateProvider.state('admin.departments', {
			templateUrl: '/assets/partials/departments/adDepartmentsList.html',
			controller: 'ADDepartmentListCtrl',
			url : '/departments'
		});
		

		
		
	}
]);
