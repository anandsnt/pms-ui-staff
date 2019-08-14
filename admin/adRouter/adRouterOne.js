angular.module('adminModuleOne', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {
     // define module-specific routes here
        $stateProvider.state('admin.dashboard', {
			url: '/dashboard/:menu',
			templateUrl: '/assets/partials/dashboard/adDashboard.html',
			controller: 'ADDashboardCtrl'

		});

		$stateProvider.state('admin.hoteldetails', {
			templateUrl: '/assets/partials/hotel/adHotelDetails.html',
			controller: 'ADHotelDetailsCtrl',
			url: '/hoteldetails/edit',
			resolve: {
				oracleDataCenters: function() {
					return {};
				}
			}
		});

		$stateProvider.state('admin.permissions', {
			templateUrl: '/assets/partials/hotel/adUserRolePermissions.html',
			controller: 'ADUserRolePermissionsCtrl',
			url: '/hoteldetails/permissions'
		});


    $stateProvider.state('admin.snthoteldetails', {
        templateUrl: '/assets/partials/hotel/adHotelDetails.html',
        controller: 'ADHotelDetailsCtrl',
        url: '/hoteldetails',
        params: {
            action: undefined,
            id: undefined
        },
        resolve: {
            oracleDataCenters: function (ADDataCenterSrv) {
                return ADDataCenterSrv.fetchDataCenters();
            }
        }
    });

		$stateProvider.state('admin.users', {
			templateUrl: '/assets/partials/users/adUserList.html',
			controller: 'ADUserListCtrl',
			url: '/users',
            params: {
			    id: null
            }
		});

		$stateProvider.state('admin.adminUsers', {
			templateUrl: '/assets/partials/adminUsers/adAdminUsersList.html',
			controller: 'ADAdminUserListCtrl',
			url: '/adminusers'
		});

		$stateProvider.state('admin.serviceproviderusers', {
			templateUrl: '/assets/partials/serviceProviders/adServiceProviderUsersList.html',
			controller: 'ADServiceProviderUserListCtrl',
			url: '/serviceprovidersusers/:id/:name'
		});

		$stateProvider.state('admin.serviceprovideruserdetails', {
			templateUrl: '/assets/partials/serviceProviders/adServiceProviderUserDetails.html',
			controller: 'ADServiceProviderUserDetailsCtrl',
			url: '/serviceprovideruserdetails/:serviceProviderId/:name/:userId/:isUnlocking'
		});

		$stateProvider.state('admin.chains', {
			templateUrl: '/assets/partials/chains/adChainList.html',
			controller: 'ADChainListCtrl',
			url: '/chains'
		});


		$stateProvider.state('admin.userdetails', {
			templateUrl: '/assets/partials/users/adUserDetails.html',
			controller: 'ADUserDetailsCtrl',
			url: '/user',
            params: {
                page: undefined,
                id: undefined,
                hotelId: undefined,
                isUnlocking: false,
                manual_id_scan_enabled: false
            }

		});
		
		$stateProvider.state('admin.adminuserdetails', {
			templateUrl: '/assets/partials/adminUsers/adAdminUserDetails.html',
			controller: 'ADAdminUserDetailsCtrl',
			url: '/user',
            params: {
                page: undefined,
                id: undefined,
                hotelId: undefined,
                isUnlocking: undefined,
                manual_id_scan_enabled: undefined
            }
		});

		$stateProvider.state('admin.linkexisting', {
			templateUrl: '/assets/partials/users/adLinkExistingUser.html',
			controller: 'ADLinkExistingUserCtrl',
			url: '/linkexisting/:id'
		});

		$stateProvider.state('admin.hotels', {
			templateUrl: '/assets/partials/hotel/adHotelList.html',
			controller: 'ADHotelListCtrl',
			url: '/hotels'
		});

		$stateProvider.state('admin.notifications', {
			templateUrl: '/assets/partials/notifications/adNotificationsList.html',
			controller: 'ADNotificatinsListCtrl',
			url: '/notifications'
		});
		$stateProvider.state('admin.addeditnotification', {
			templateUrl: '/assets/partials/notifications/adNotifications.html',
			controller: 'ADNotificationCtrl',
			url: '/notification',
            params: {
                id: undefined,
                action: undefined
            }
		});

		$stateProvider.state('admin.brands', {
			templateUrl: '/assets/partials/brands/adBrandList.html',
			controller: 'ADBrandCtrl',
			url: '/brands'
		});

		$stateProvider.state('admin.templateconfiguration', {
			templateUrl: '/assets/partials/templateConfiguration/adListHotel.html',
			controller: 'ADTemplateConfigurationCtrl',
			url: '/templateconfiguration'
		});

		$stateProvider.state('admin.smsconfiguration', {
			templateUrl: '/assets/partials/smsConfiguration/adConfigSms.html',
			controller: 'ADSMSConfigurationCtrl',
			url: '/smsconfiguration'
		});

		$stateProvider.state('admin.campaigns', {
			templateUrl: '/assets/partials/campaigns/adCampaignsList.html',
			controller: 'ADCampaignsListCtrl',
			url: '/campaigns'
		});

		$stateProvider.state('admin.addCampaign', {
			templateUrl: '/assets/partials/campaigns/adAddCampaign.html',
			controller: 'ADAddCampaignCtrl',
			url: '/campaigns',
            params: {
                id: undefined,
                type: undefined
            }
		});

		$stateProvider.state('admin.zest_shortcode', {
			templateUrl: '/assets/partials/zestSetup/adSmsSetup.html',
			controller: 'ADZestSmsShortcodeCtrl',
			url: '/zestshortcode'
		});
		$stateProvider.state('admin.zest_setup_email', {
			templateUrl: '/assets/partials/zestSetup/adCheckinEmailSetup.html',
			controller: 'ADZestCheckinEmailCtrl',
			url: '/zestsetupemail'
		});
		$stateProvider.state('admin.zest_setup_direct', {
			templateUrl: '/assets/partials/zestSetup/adCheckinDirectUrlEmailSetup.html',
			controller: 'ADZestCheckinDirectUrlEmailCtrl',
			url: '/zestsetupdirect',
			resolve: {
				directUrlData: function(adZestCheckinCheckoutSrv) {
					return adZestCheckinCheckoutSrv.fetchDirectSetup();
				},
				diretUrls: function(adZestCheckinCheckoutSrv) {
					var data = {"application": "URL", "guest_web_url_type": "CHECKIN"};

					return adZestCheckinCheckoutSrv.fetchDirectUrlList(data);
				}
			}
		});

        $stateProvider.state('admin.reports', {
			templateUrl: '/assets/partials/reports/ADReportsList.html',
			controller: 'ADReportsListCtrl',
			url: '/reports',
            resolve: {
                reports: function(adReportsSrv) {
                    return adReportsSrv.fetchReportsList();
                }
            }
		});

		$stateProvider.state('admin.serviceProviders', {
			templateUrl: '/assets/partials/serviceProviders/adServiceProviderList.html',
			controller: 'ADServiceProviderListCtrl',
			url: '/serviceProviders'
		});

		$stateProvider.state('admin.sntserviceproviderdetails', {
			templateUrl: '/assets/partials/serviceProviders/adServiceProviderDetails.html',
			controller: 'ADServiceProviderDetailsCtrl',
			url: '/serviceproviderdetails',
			params: {
                id: undefined,
                action: undefined
            }
		});

		$stateProvider.state('admin.autoSyncInventory', {
			templateUrl: '/assets/partials/tools/adTools.html',
			controller: 'ADToolsCtrl',
			url: '/adTools'
		});

		$stateProvider.state('admin.zestSortedCountryList', {
			templateUrl: '/assets/partials/zestSetup/adCountrySorting.html',
			controller: 'ADCountrySortAndRestrictionCtrl',
			url: '/countrySort'
		});

		$stateProvider.state('admin.mobileAppMarketingSettings', {
			templateUrl: '/assets/partials/zestSetup/adMobileAppMarketing.html',
			controller: 'ADZestMobileAppMarketingCtrl',
			url: '/admin/hotel/get_mobile_app_marketing_settings',
			resolve: {
				data: function(adZestMobileAppMarketingSrv) {
					return adZestMobileAppMarketingSrv.getZestMobileAppMarketingData();
				}
			}
		});

        $stateProvider.state('admin.clientSuccessManagers', {
            templateUrl: '/assets/partials/clientSuccessManagers/adClientSuccessManagerList.html',
            controller: 'ADClientSuccessManagerListCtrl',
            url: '/clientSuccessManagers'
        });

        $stateProvider.state('admin.clientSuccessManagerDetails', {
            templateUrl: '/assets/partials/clientSuccessManagers/adClientSuccessManagerAdd.html',
            controller: 'ADClientSuccessManagerDetailsCtrl',
            url: '/clientSuccessManager/:action/:id'
        });

        $stateProvider.state('admin.zestStationIDCollection', {
            templateUrl: '/assets/partials/idCollection/adStationIdCollectionSetup.html',
            controller: 'adStationIdCollectionSetupCtrl',
            url: '/zestStationIDCollection',
            resolve: {
                config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchConfiguration('zestStationIdCollection');
                }]
            }
        });

        $stateProvider.state('admin.archivalTransferSetup', {
            templateUrl: '/assets/partials/archivalSetup/adArchivalTransferSetup.html',
            controller: 'adArchivalTransferSetupCtrl',
            url: '/archivalTransferSetup',
            resolve: {
                config: ['ACGIIntegrationSrv', function (ACGIIntegrationSrv) {
                    return ACGIIntegrationSrv.fetchConfiguration();
                }]
            }
        });

        $stateProvider.state('admin.roverIDCollection', {
            templateUrl: '/assets/partials/idCollection/adRoverIdCollectionSetup.html',
            controller: 'adRoverIdCollectionSetupCtrl',
            url: '/roverIDCollection',
            resolve: {
                config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchConfiguration('roverIdCollection');
                }]
            }
        });

        $stateProvider.state('admin.zestWebIDCollection', {
            templateUrl: '/assets/partials/idCollection/adZestWebIdCollectionSetup.html',
            controller: 'adZestWebIdCollectionSetupCtrl',
            url: '/zestWebIDCollection',
            resolve: {
                config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchConfiguration('zestWebIDCollection');
                }]
            }
        });

});
