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

		$stateProvider.state('admin.propertyInterfaceSetup', {
			templateUrl: '/assets/partials/property/propertyInterfaceSetup.html',
			controller: 'ADPropertyInterfaceSetupCtrl',
			url : '/propertyinterface/setup'
		});

		$stateProvider.state('admin.letshareSetup', {
			templateUrl: '/assets/partials/letshare/letShareSetup.html',
			controller: 'adLetShareSetupCtrl',
			url : '/letshare/setup',
			resolve: {
				letsShareSetupValues: ['adLetShareSetupSrv', function(adLetShareSetupSrv) {
					return adLetShareSetupSrv.fetchLetShareConfiguration();
				}]
			}
		});

		$stateProvider.state('admin.lightspeedPosSetup', {
			templateUrl: '/assets/partials/lightspeedPOS/adLightspeedPOSSetup.html',
			controller: 'adLightSpeedPOSSetupCtrl',
			url : '/lightspeedpos/setup',
			resolve: {
				lightSpeedSetupValues: ['adLightSpeedPOSSetupSrv', function(adLightSpeedPOSSetupSrv) {
					return adLightSpeedPOSSetupSrv.fetchLightSpeedPOSConfiguration();
				}]
			}
		});

		$stateProvider.state('admin.britePabXSetup', {
			templateUrl: '/assets/partials/britePabX/britePabXSetup.html',
			controller: 'adBritePabXSetupCtrl',
			url : '/britePabX/setup',
			resolve: {
				britePabXSetupValues: ['adBritePabXSetupSrv', function(adBritePabXSetupSrv) {
					return adBritePabXSetupSrv.fetchBritePabXConfiguration();
				}]
			}
		});

		$stateProvider.state('admin.afasSetup', {
			templateUrl: '/assets/partials/afas/afasSetup.html',
			controller: 'adAfasSetupCtrl',
			url : '/letshare/setup',
			resolve: {
				afasSetupValues: ['adAfasSetupSrv', function(adAfasSetupSrv) {
					return adAfasSetupSrv.fetchAfasConfiguration();
				}]
			}
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

		$stateProvider.state('admin.icare', {
			templateUrl: '/assets/partials/icare/adIcareServices.html',
			controller: 'ADIcareServicesCtrl',
			url : '/icare'
		});

		$stateProvider.state('admin.keyEncoders', {
			templateUrl: '/assets/partials/keyEncoders/adKeyEncoderList.html',
			controller: 'ADKeyEncoderCtrl',
			url : '/encoders'
		});

		$stateProvider.state('admin.emvTerminals', {
			templateUrl: '/assets/partials/emvTerminals/emvTerminalList.html',
			controller: 'ADEmvTerminalCtrl',
			url : '/terminals'
		});

		$stateProvider.state('admin.emvTerminalDetails', {
			templateUrl: '/assets/partials/emvTerminals/emvTerminalDetails.html',
			controller: 'ADEmvTerminalDetailsCtrl',
			url : '/terminaldetails/:itemid'
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
		$stateProvider.state('admin.doorlockInterface', {
			templateUrl: '/assets/partials/doorLockInterface/adDoorLockInterface.html',
			controller: 'ADDoorLockInterfaceCtrl',
			url : '/doorlockinterface'
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


});