angular.module('adminModuleTwo', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
     //define module-specific routes here
        $stateProvider.state('admin.departments', {
			templateUrl: '/assets/partials/departments/adDepartmentsList.html',
			controller: 'ADDepartmentListCtrl',
			url : '/departments'
		});

		$stateProvider.state('admin.holdStatus', {
			templateUrl: '/assets/partials/holdStatus/adHoldStatusList.html',
			controller: 'ADHoldStatusListCtrl',
			url : '/holdStatus'
		});

		$stateProvider.state('admin.segment', {
			templateUrl: '/assets/partials/segments/adSegments.html',
			controller: 'ADReservationSegmentsCtrl',
			url : '/segments'
		});

		$stateProvider.state('admin.rates', {
			templateUrl: '/assets/partials/rates/adRatesList.html',
			controller: 'ADRatesListCtrl',
			url : '/rates'
		});
		$stateProvider.state('admin.channelManager', {
			templateUrl: '/assets/partials/rates/adChannelManager.html',
			controller: 'ADChannelMgrCtrl',
			url : '/channelManager'
		});
		$stateProvider.state('admin.channelManagerEditRates', {
			templateUrl: '/assets/partials/rates/adChannelManagerEditRates.html',
			controller: 'ADChannelMgrEditCtrl',
			url : '/channelManagerEditRates'
		});

		$stateProvider.state('admin.ratetypes', {
			templateUrl: '/assets/partials/rateTypes/adRateTypeList.html',
			controller: 'ADRateTypeCtrl',
			url : '/ratetypes',
			resolve: {
				rateClassifications: function (ADRateTypeSrv) {
					return ADRateTypeSrv.fetchClassification();
				}
			}
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

		$stateProvider.state('admin.roomclasses', {
			templateUrl: '/assets/partials/roomClass/adRoomClassList.html',
			controller: 'ADRoomClassListCtrl',
			url : '/roomclasses'
		});

		$stateProvider.state('admin.floorsetups', {
			templateUrl: '/assets/partials/floorSetups/adFloors.html',
			controller: 'ADFloorsListCtrl',
			url : '/floors'
		});

		$stateProvider.state('admin.addFloor', {
			templateUrl: '/assets/partials/floorSetups/adFloorDetails.html',
			controller: 'ADFloorDetailsCtrl',
			url : '/floors/add',
			resolve: {
				floorDetails: ['ADFloorSetupSrv', '$stateParams',
					function(ADFloorSetupSrv, $stateParams) {
						return [];
				}]
			}
		});
		$stateProvider.state('admin.editFloor', {
			templateUrl: '/assets/partials/floorSetups/adFloorDetails.html',
			controller: 'ADFloorDetailsCtrl',
			url : '/floors/:id',
			resolve: {
				floorDetails: ['ADFloorSetupSrv', '$stateParams',
					function(ADFloorSetupSrv, $stateParams) {
						var params = {
							floorID: $stateParams.id
						};
						return ADFloorSetupSrv.getFloorDetails(params);
				}]
			}
		});

		$stateProvider.state('admin.billingGroups', {
			templateUrl: '/assets/partials/billingGroups/adBillingGroupList.html',
			controller: 'ADBillingGroupCtrl',
			url : '/billingGroups'
		});
		$stateProvider.state('admin.accountsReceivables', {
			templateUrl: '/assets/partials/accountReceivables/adAccountReceivables.html',
			controller: 'ADAccountReceivablesCtrl',
			url : '/accountReceivables'
		});

		$stateProvider.state('admin.reservationTypes', {
			templateUrl: '/assets/partials/reservationTypes/adReservationTypeList.html',
			controller: 'ADReservationTypeListController',
			url : '/reservationtypes'
		});

		$stateProvider.state('admin.interfaceMessages', {
			templateUrl: '/assets/partials/interfaces/adInterfaceMessages.html',
			controller: 'adExternalInterfaceCtrl',
			url : '/interfaceMessages'
		});


		$stateProvider.state('admin.reservationTools', {
			templateUrl: '/assets/partials/reservationTools/adReservationToolsList.html',
			controller: 'ADReservationTypeToolsMainCtrl',
			url : '/reservationTools'
		});

		$stateProvider.state('admin.balanceInventory', {
			templateUrl: '/assets/partials/reservationTools/adBalanceInventory.html',
			controller: 'ADBalanceInventoryCtrl',
			url : '/balanceInventory',
			resolve: {
                allJobs: function(ADReservationToolsSrv) {
                    return ADReservationToolsSrv.fetchAllJobs();
                }
            }
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
			url : '/addNewRate',
			resolve: {
				rateInitialData: function(ADRatesAddDetailsSrv) {
					return ADRatesAddDetailsSrv.fetchRateTypes();
				},
				rateDetails: function(){
					return {};
				}
			}
		});

		$stateProvider.state('admin.rateDetails', {
			templateUrl: '/assets/partials/rates/adNewRate.html',
			controller: 'ADAddnewRate',
			url : '/ratedetails/:rateId',
			resolve: {
				rateInitialData: function(ADRatesAddDetailsSrv) {
					return ADRatesAddDetailsSrv.fetchRateTypes();
				},
				rateDetails: function(ADRatesSrv, $stateParams) {
                 	var params = {
			 		  	rateId: $stateParams.rateId
		 		  	};
                    return ADRatesSrv.fetchDetails(params);
                }
			}
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
			url : '/checkin',
			resolve: {
				rateCodeData: function(adCheckinSrv) {
					return adCheckinSrv.getRateCodes();
				},
				blockCodeData : function(adCheckinSrv){
					return adCheckinSrv.getBlockCodes();
				},
				roomTypes:function(ADRoomTypesSrv){
					return ADRoomTypesSrv.fetch();
				}
			}
		});

		$stateProvider.state('admin.checkout', {
			templateUrl: '/assets/partials/checkout/adCheckout.html',
			controller: 'ADCheckoutCtrl',
			url : '/checkout',
			resolve:{
				roomTypes:function(ADRoomTypesSrv){
					return ADRoomTypesSrv.fetch();
				}
			}
		});

		$stateProvider.state('admin.cmscomponentSettings', {
			templateUrl: '/assets/partials/contentManagement/adContentManagement.html',
			controller: 'ADContentManagementCtrl',
			url : '/contentManagement'
		});

		$stateProvider.state('admin.contentManagementSectionDetails', {
			templateUrl: '/assets/partials/contentManagement/adContentManagementSectionDetail.html',
			controller: 'ADContentManagementSectionDetailCtrl',
			url : '/contentManagement/section/:id'
		});

		$stateProvider.state('admin.contentManagementCategoryDetails', {
			templateUrl: '/assets/partials/contentManagement/adContentManagementCategoryDetail.html',
			controller: 'ADContentManagementCategoryDetailCtrl',
			url : '/contentManagement/category/:id'
		});
		$stateProvider.state('admin.contentManagementItemDetails', {
			templateUrl: '/assets/partials/contentManagement/adContentManagementItemDetail.html',
			controller: 'ADContentManagementItemDetailCtrl',
			url : '/contentManagement/item/:id'
		});


		$stateProvider.state('admin.checkinEmail', {
			templateUrl: '/assets/partials/emailList/adCheckinCheckoutemail.html',
			controller: 'ADCheckinEmailCtrl',
			url : '/checkinEmail'
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
			url : '/rates_addons',
			resolve:{
				activeRates: function(ADPromotionsSrv) {
					return ADPromotionsSrv.getActiveRates();
				}
			}
		});

		$stateProvider.state('admin.ratesSequence', {
			templateUrl: '/assets/partials/rateSequence/adRatesSequence.html',
			controller: 'ADRatesSequenceCtrl',
			url : '/rates_sequence'
		});

		$stateProvider.state('admin.promotions', {
			templateUrl: '/assets/partials/rates/adPromotions.html',
			controller: 'ADPromotionsCtrl',
			url : '/promotions',
			resolve:{
				activeRates: function(ADPromotionsSrv) {
					return ADPromotionsSrv.getActiveRates();
				}
			}
		});

		$stateProvider.state('admin.userRoles', {
			templateUrl: '/assets/partials/UserRoles/adUserRoles.html',
			controller: 'ADUserRolesCtrl',
			url : '/UserRoles',
			resolve: {
				userRolesData: function(ADUserRolesSrv) {
					return ADUserRolesSrv.fetchUserRoles();
				}
			}
		});


		$stateProvider.state('admin.reservationSettings', {
			templateUrl: '/assets/partials/reservations/adReservationSettings.html',
			controller: 'ADReservationSettingsCtrl',
			url : '/reservationSettings',
			resolve: {
				reservationSettingsData: function(ADReservationSettingsSrv) {
					return ADReservationSettingsSrv.fetchReservationSettingsData();
				}
			}
		});


		$stateProvider.state('admin.ibeaconSettings', {
			templateUrl: '/assets/partials/iBeaconSettings/adibeaconSettings.html',
			controller: 'ADiBeaconSettingsCtrl',
			url : '/ibeaconSettings'
		});

		$stateProvider.state('admin.earlyCheckin', {
			templateUrl: '/assets/partials/earlyCheckin/adEarlyCheckin.html',
			controller: 'ADEarlyCheckinCtrl',
			url : '/earlyCheckin',
			resolve: {
				blockCodeData : function(adCheckinSrv){
					return adCheckinSrv.getBlockCodes();
				}
			}
		});

		$stateProvider.state('admin.iBeaconDetails', {
			templateUrl: '/assets/partials/iBeaconSettings/adiBeaconDetails.html',
			controller: 'ADiBeaconDetailsCtrl',
			url : '/iBeaconDetails/:action',
			resolve: {
				beaconNeighbours: function(adiBeaconSettingsSrv){
					return adiBeaconSettingsSrv.fetchBeaconList();
				},
				triggerTypes: function(adiBeaconSettingsSrv) {
					return adiBeaconSettingsSrv.fetchBeaconTriggerTypes();
				},
				beaconTypes: function(adiBeaconSettingsSrv) {
					return adiBeaconSettingsSrv.fetchBeaconTypes();
				},
				beaconDetails: function(adiBeaconSettingsSrv, $stateParams) {
                 	var params = {
			 		  	"id":$stateParams.action
		 		  	};
                    return adiBeaconSettingsSrv.fetchBeaconDetails(params);
                },
                defaultBeaconDetails: function() {
                    return {};
                }
			}
		});

		$stateProvider.state('admin.iBeaconNewDetails', {
			templateUrl: '/assets/partials/iBeaconSettings/adiBeaconDetails.html',
			controller: 'ADiBeaconDetailsCtrl',
			url : '/iBeaconDetails/:action',
			resolve: {
				beaconNeighbours: function(adiBeaconSettingsSrv){
					return adiBeaconSettingsSrv.fetchBeaconList();
				},
				triggerTypes: function(adiBeaconSettingsSrv) {
					return adiBeaconSettingsSrv.fetchBeaconTriggerTypes();
				},
				beaconTypes: function(adiBeaconSettingsSrv) {
					return adiBeaconSettingsSrv.fetchBeaconTypes();
				},
				beaconDetails: function() {
                    return {};
                },
                defaultBeaconDetails: function(adiBeaconSettingsSrv) {
                    return adiBeaconSettingsSrv.fetchBeaconDeafultDetails();
          	   }
			}
		});

		$stateProvider.state('admin.settingsAndParams', {
			templateUrl: '/assets/partials/settingsAndParams/adSettingsAndParams.html',
			controller: 'settingsAndParamsCtrl',
			url : '/settingsAndParams',
			resolve: {
				settingsAndParamsData: function(settingsAndParamsSrv) {
					return settingsAndParamsSrv.fetchsettingsAndParams();
				},
				chargeCodes: function(settingsAndParamsSrv){
					return settingsAndParamsSrv.fetchChargeCodes();
				}
			}
		});

                $stateProvider.state('admin.dailyWorkAssignment', {
                        templateUrl: '/assets/partials/housekeeping/adDailyWorkAssignment.html',
                        controller: 'ADDailyWorkAssignmentCtrl',
                        url: '/daily_work_assignment'
                });

		$stateProvider.state('admin.checkoutEmail', {
			templateUrl: '/assets/partials/emailList/adCheckinCheckoutemail.html',
			controller: 'ADCheckoutEmailCtrl',
			url : '/checkoutEmail'
		});

		$stateProvider.state('admin.deviceMapping', {
			templateUrl: '/assets/partials/deviceMapping/adDeviceMappingList.html',
			controller: 'ADDeviceMappingsCtrl',
			url : '/deviceMappingsList'
		});

		$stateProvider.state('admin.externalMappings', {
			templateUrl: '/assets/partials/mapping/adExternalMappingItems.html',
			controller: 'ADMappingCtrl',
			url : '/intefaceMappingsList'
		});

		$stateProvider.state('admin.backOfficeSetup', {
			templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
			controller: 'ADInterfaceSubMenuCtrl',
			url : '/backOfficeInterfaces'
		});

		$stateProvider.state('admin.centralReservationSystemGroup', {
			templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
			controller: 'ADInterfaceSubMenuCtrl',
			url : '/backOfficeInterfaces'
		});

		$stateProvider.state('admin.textMessagingGroup', {
			templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
			controller: 'ADInterfaceSubMenuCtrl',
			url : '/textMessagingInterfaces'
		});

		$stateProvider.state('admin.stationary', {
			templateUrl: '/assets/partials/stationary/adStationary.html',
			controller: 'ADStationaryCtrl',
			url : '/stationary',
			resolve : {
				availableGuestLanguages : function(ADTranslationSrv) {
					return ADTranslationSrv.getGuestLanguages();
				},
				availableHoldStatus : function(ADHoldStatusSrv) {
					return ADHoldStatusSrv.fetch();
				}
			}
		});

		$stateProvider.state('admin.languages', {
			templateUrl: '/assets/partials/languages/adLanguages.html',
			controller: 'ADLanguagesCtrl',
			url : '/languages'
		});

		$stateProvider.state('admin.analyticsSetup', {
			templateUrl: '/assets/partials/AnalyticSetup/adAnalyticSetup.html',
			controller: 'adAnalyticSetupCtrl',
			url : '/analyticSetup'
		});

		$stateProvider.state('admin.zestAddons', {
			templateUrl: '/assets/partials/zestAddonSetup/adZestAddonSetup.html',
			controller: 'adZestAddonSetupCtrl',
			url : '/zestAddonSetup'
		});
		$stateProvider.state('admin.zestStationConfig', {
			templateUrl: '/assets/partials/zestStation/adZestStationCfg.html',
			controller: 'ADZestStationCtrl',
			url : '/zestStationConfig'
		});
		$stateProvider.state('admin.ZestStationCheckin', {
			templateUrl: '/assets/partials/zestStation/adZestStationCheckin.html',
			controller: 'ADZestStationCheckInCtrl',
			url : '/zestStationCheckin'
		});
		$stateProvider.state('admin.ZestStationCheckout', {
			templateUrl: '/assets/partials/zestStation/adZestStationCheckout.html',
			controller: 'ADZestStationCheckOutCtrl',
			url : '/zestStationCheckout'
		});
		$stateProvider.state('admin.ZestStationColorsGraphics', {
			templateUrl: '/assets/partials/zestStation/adZestStationColorsAndGraphics.html',
			controller: 'ADZestStationColorsAndGraphicsCtrl',
			url : '/zestStationColorsAndGraphics'
		});
		$stateProvider.state('admin.ZestStationPickUpKeys', {
			templateUrl: '/assets/partials/zestStation/adZestStationPickUpKeys.html',
			controller: 'ADZestStationPickUpKeysCtrl',
			url : '/zestStationPickUpKeys'
		});

		$stateProvider.state('admin.emailBlacklist', {
			templateUrl: '/assets/partials/EmailBlackList/adEmailBlackList.html',
			controller: 'ADEmailBlackListCtrl',
			url : '/emailBlacklist'
		});

		$stateProvider.state('admin.invoices', {
			templateUrl: '/assets/partials/invoices/adInvoiceSettings.html',
			controller: 'ADInvoiceSettingsCtrl',
			url : '/invoiceSettings',
			resolve : {
				invoiceSettingsData : function(ADInvoiceSettingsSrv) {
					return ADInvoiceSettingsSrv.fetchInvoiceSettings();
				}
			}
		});

		$stateProvider.state('admin.translations', {
			templateUrl: '/assets/partials/translation/adTranslation.html',
			controller: 'ADTranslationCtrl',
			url : '/translation',
			resolve : {
				availableLanguages : function(ADTranslationSrv) {
					return ADTranslationSrv.getGuestLanguages();
				},
				menuDetails : function(ADTranslationSrv) {
					return ADTranslationSrv.getMenuOptionDetails();
				}
			}
		});
});
