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
			url : '/user/:page/:id/:hotelId'
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

		$stateProvider.state('admin.rates', {
			templateUrl: '/assets/partials/rates/adRatesList.html',
			controller: 'ADRatesListCtrl',
			url : '/rates'
		});

		$stateProvider.state('admin.ratetypes', {
			templateUrl: '/assets/partials/rateTypes/adRateTypeList.html',
			controller: 'ADRateTypeCtrl',
			url : '/ratetypes'
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

		$stateProvider.state('admin.housekeeping', {
			templateUrl: '/assets/partials/housekeeping/adHousekeeping.html',
			controller: 'adHousekeepingCtrl',
			url : '/housekeeping'
		});

		$stateProvider.state('admin.roomKeyDelivery', {
			templateUrl: '/assets/partials/roomKeyDelivery/roomKeyDelivery.html',
			controller: 'ADRoomKeyDeliveryCtrl',
			url : '/roomKeyDelivery'
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


		$stateProvider.state('admin.items', {
			templateUrl: '/assets/partials/items/adItemList.html',
			controller: 'ADItemListCtrl',
			url : '/items'
		});	

		$stateProvider.state('admin.itemdetails', {
			templateUrl: '/assets/partials/items/adItemDetails.html',
			controller: 'ADItemDetailsCtrl',
			url : '/itemdetails/:itemid'
		});				

		
		$stateProvider.state('admin.chargeGroups', {
			templateUrl: '/assets/partials/chargeGroups/adChargeGroups.html',
			controller: 'ADChargeGroupsCtrl',
			url : '/chargeGroups'
		});
		
		$stateProvider.state('admin.paymentMethods', {
			templateUrl: '/assets/partials/paymentMethods/adPaymentMethods.html',
			controller: 'ADPaymentMethodsCtrl',
			url : '/paymentMethods'
		});

		$stateProvider.state('admin.chargeCodes', {
			templateUrl: '/assets/partials/chargeCodes/adChargeCodes.html',
			controller: 'ADChargeCodesCtrl',
			url : '/chargeCodes'
		});
		
		$stateProvider.state('admin.externalPmsConnectivity', {
			templateUrl: '/assets/partials/externalPms/adExternalPmsConnectivity.html',
			controller: 'ADExternalPmsConnectivityCtrl',
			url : '/externalPmsConnectivity'
		});

		$stateProvider.state('admin.addRate', {
			templateUrl: '/assets/partials/rates/adNewRate.html',
		    controller: 'ADAddnewRate',
			url : '/addNewRate'
		});

		$stateProvider.state('admin.rateDetails', {
			templateUrl: '/assets/partials/rates/adNewRate.html',
			controller: 'ADAddnewRate',
			url : '/ratedetails/:rateId'
		});

		$stateProvider.state('admin.rulesRestrictions', {
			templateUrl: '/assets/partials/rulesRestriction/adRulesRestriction.html',
			controller: 'ADRulesRestrictionCtrl',
			url : '/restriction_types'
		});


		$stateProvider.state('admin.hotelannouncementsettings', {
			templateUrl: '/assets/partials/hotelAnnouncementSettings/adHotelAnnounceSettings.html',
			controller: 'ADHotelAnnouncementSettingsCtrl',
			url : '/hotelannouncementsettings'
		});	

		$stateProvider.state('admin.sociallobbysettings', {
			templateUrl: '/assets/partials/hotelSocialLobbySettings/adHotelSocialLobbySettings.html',
			controller: 'ADSocialLobbySettingsCtrl',
			url : '/sociallobbysettings'
		});			

		$stateProvider.state('admin.guestreviewsetup', {
			templateUrl: '/assets/partials/reviews_setups/adGuestReviewSetup.html',
			controller: 'ADGuestReviewSetupCtrl',
			url : '/guestreviewsetup'
		});	

		$stateProvider.state('admin.checkin', {
			templateUrl: '/assets/partials/checkin/adCheckin.html',
			controller: 'ADCheckinCtrl',
			url : '/checkin'
		});

		$stateProvider.state('admin.checkout', {
			templateUrl: '/assets/partials/checkout/adCheckout.html',
			controller: 'ADCheckoutCtrl',
			url : '/checkout'
		});


		$stateProvider.state('admin.checkinCheckoutEmail', {
			templateUrl: '/assets/partials/emailList/adCheckinCheckoutemail.html',
			controller: 'ADCheckinCheckoutCtrl',
			url : '/checkinCheckoutEmail/:from'
		});
        $stateProvider.state('admin.maintenanceReasons', {
			templateUrl: '/assets/partials/maintenanceReasons/adMaintenanceReasons.html',
			controller: 'ADMaintenanceReasonsCtrl',
			url : '/maintenanceReasons'
		});

		$stateProvider.state('admin.markets', {
			templateUrl: '/assets/partials/markets/adMarkets.html',
			controller: 'ADMarketsCtrl',
			url : '/markets'
		});
		$stateProvider.state('admin.sources', {
			templateUrl: '/assets/partials/sources/adSources.html',
			controller: 'ADSourcesCtrl',
			url : '/sources'
		});

		$stateProvider.state('admin.bookingOrigins', {
			templateUrl: '/assets/partials/origins/adOrigins.html',
			controller: 'ADOriginsCtrl',
			url : '/origins'
		});

		$stateProvider.state('admin.ratesAddons', {
			templateUrl: '/assets/partials/rates/adRatesAddons.html',
			controller: 'ADRatesAddonsCtrl',
			url : '/rates_addons'
		});

	}
]);
