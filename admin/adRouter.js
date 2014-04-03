admin.config([	
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/admin/dashboard/0');

		$stateProvider.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: '/assets/partials/adApp.html',
			controller: 'ADAppCtrl'
		});

		$stateProvider.state('admin.dashboard', {
			url: '/dashboard/:menu',
			templateUrl: '/assets/partials/dashboard/adDashboard.html',
			controller: 'ADDashboardCtrl'

		});

		$stateProvider.state('admin.hoteldetails', {
			templateUrl: '/assets/partials/hotel/adHotelDetails.html',
			controller: 'ADHotelDetailsCtrl',
			url : '/hoteldetails/edit'
		});
		
		$stateProvider.state('admin.snthoteldetails', {
			templateUrl: '/assets/partials/hotel/adHotelDetails.html',
			controller: 'ADHotelDetailsCtrl',
			url : '/hoteldetails/:action/:id'
		});
		
		$stateProvider.state('admin.users', {
			templateUrl: '/assets/partials/users/adUserList.html',
			controller: 'ADUserListCtrl',
			url : '/users/:id'
		});

		$stateProvider.state('admin.chains', {
			templateUrl: '/assets/partials/chains/adChainList.html',
			controller: 'ADChainListCtrl',
			url : '/chains'
		});

		
		
		
		
		$stateProvider.state('admin.userdetails', {
			templateUrl: '/assets/partials/users/adUserDetails.html',
			controller: 'ADUserDetailsCtrl',
			url : '/user/:page/:id'
		});
		
		$stateProvider.state('admin.linkexisting', {
			templateUrl: '/assets/partials/users/adLinkExistingUser.html',
			controller: 'ADLinkExistingUserCtrl',
			url : '/linkexisting/:id'
		});


		
		$stateProvider.state('admin.hotels', {
			templateUrl: '/assets/partials/hotel/adHotelList.html',
			controller: 'ADHotelListCtrl',
			url : '/hotels'
		});

		$stateProvider.state('admin.brands', {
			templateUrl: '/assets/partials/brands/adBrandList.html',
			controller: 'ADBrandCtrl',
			url : '/brands'
		});
		
		$stateProvider.state('admin.mapping', {
			templateUrl: '/assets/partials/mapping/adExternalMapping.html',
			controller: 'ADMappingCtrl',
			url : '/mapping/:hotelId'
		});
		$stateProvider.state('admin.ffp', {
			templateUrl: '/assets/partials/frequentFlyerProgram/adFFPList.html',
			controller: 'ADFrequentFlyerProgramCtrl',
			url : '/ffp'
		});
		
		$stateProvider.state('admin.departments', {
			templateUrl: '/assets/partials/departments/adDepartmentsList.html',
			controller: 'ADDepartmentListCtrl',
			url : '/departments'
		});


		$stateProvider.state('admin.upselllatecheckout', {
			templateUrl: '/assets/partials/upsellLatecheckout/upsellLatecheckout.html',
			controller: 'ADUpsellLateCheckoutCtrl',
			url : '/upselllatecheckout'
		});
		

		$stateProvider.state('admin.hotelLoyaltyProgram', {
			templateUrl: '/assets/partials/hotelLoyalty/hotelLoyaltyList.html',
			controller: 'ADHotelLoyaltyCtrl',
			url : '/hotelloyalty'
		});
		$stateProvider.state('admin.roomupsell', {
			templateUrl: '/assets/partials/roomUpsell/roomUpsell.html',
			controller: 'ADRoomUpsellCtrl',
			url : '/roomupsell'
		});
		
		$stateProvider.state('admin.roomtypes', {
			templateUrl: '/assets/partials/roomTypes/adRoomTypesList.html',
			controller: 'ADRoomTypesCtrl',
			url : '/roomtypes'
		});
		




		$stateProvider.state('admin.rooms', {
			templateUrl: '/assets/partials/rooms/adRoomList.html',
			controller: 'adRoomListCtrl',
			url : '/rooms'
		});		
		$stateProvider.state('admin.roomdetails', {
			templateUrl: '/assets/partials/rooms/adRoomDetails.html',
			controller: 'adRoomDetailsCtrl',
			url : '/roomdetails/:roomId'
		});

		$stateProvider.state('admin.hotellikes', {
			templateUrl: '/assets/partials/Likes/adHotelLikes.html',
			controller: 'ADHotelLikesCtrl',
			url : '/likes'

		});

	}
]);
