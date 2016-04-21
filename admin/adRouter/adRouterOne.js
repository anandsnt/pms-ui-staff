angular.module('adminModuleOne', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
     //define module-specific routes here
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

		$stateProvider.state('admin.permissions', {
			templateUrl: '/assets/partials/hotel/adUserRolePermissions.html',
			controller: 'ADUserRolePermissionsCtrl',
			url : '/hoteldetails/permissions'
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
			url : '/user/:page/:id/:hotelId/:isUnlocking'
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

		$stateProvider.state('admin.templateconfiguration', {
			templateUrl: '/assets/partials/templateConfiguration/adListHotel.html',
			controller: 'ADTemplateConfigurationCtrl',
			url : '/templateconfiguration'
		});

		$stateProvider.state('admin.smsconfiguration', {
			templateUrl: '/assets/partials/smsConfiguration/adConfigSms.html',
			controller: 'ADSMSConfigurationCtrl',
			url : '/smsconfiguration'
		});

		$stateProvider.state('admin.campaigns', {
			templateUrl: '/assets/partials/campaigns/adCampaignsList.html',
			controller: 'ADCampaignsListCtrl',
			url : '/campaigns'
		});

		$stateProvider.state('admin.addCampaign', {
			templateUrl: '/assets/partials/campaigns/adAddCampaign.html',
			controller: 'ADAddCampaignCtrl',
			url : '/campaigns/:id/:type'
		});

		$stateProvider.state('admin.zest_shortcode', {
			templateUrl: '/assets/partials/zestSetup/adSmsSetup.html',
			controller: 'ADZestSmsShortcodeCtrl',
			url : '/zestshortcode'
		});
		$stateProvider.state('admin.zest_setup_email', {
			templateUrl: '/assets/partials/zestSetup/adCheckinEmailSetup.html',
			controller: 'ADZestCheckinEmailCtrl',
			url : '/zestsetupemail'
		});
		$stateProvider.state('admin.zest_setup_direct', {
			templateUrl: '/assets/partials/zestSetup/adCheckinDirectUrlEmailSetup.html',
			controller: 'ADZestCheckinDirectUrlEmailCtrl',
			url : '/zestsetupdirect',
			resolve: {
				directUrlData: function(adZestCheckinCheckoutSrv) {
					return adZestCheckinCheckoutSrv.fetchDirectSetup();
				},
				diretUrls : function(adZestCheckinCheckoutSrv){
					var data = {"application":"URL","guest_web_url_type":"CHECKIN"};
					return adZestCheckinCheckoutSrv.fetchDirectUrlList(data);
				}
			}
		});

        $stateProvider.state('admin.reports', {
			templateUrl: '/assets/partials/reports/ADReportsList.html',
			controller: 'ADReportsListCtrl',
			url : '/reports',
            resolve: {
                reports: function(adReportsSrv){
                    return adReportsSrv.fetchReportsList();
                }
            }
		});

		$stateProvider.state('admin.serviceProviders', {
			templateUrl: '/assets/partials/serviceProviders/adServiceProviderList.html',
			controller: 'ADServiceProviderListCtrl',
			url : '/serviceProviders'
		});

		$stateProvider.state('admin.sntserviceproviderdetails', {
			templateUrl: '/assets/partials/serviceProviders/adServiceProviderDetails.html',
			controller: 'ADServiceProviderDetailsCtrl',
			url : '/serviceproviderdetails/:action/:id'
		});

		$stateProvider.state('admin.autoSyncInventory', {
			templateUrl: '/assets/partials/tools/adTools.html',
			controller: 'ADToolsCtrl',
			url : '/adTools'
		});

		$stateProvider.state('admin.zestSortedCountryList', {
			templateUrl: '/assets/partials/zestSetup/adCountrySorting.html',
			controller: 'ADCountrySortCtrl',
			url : '/countrySort'
		});

});
