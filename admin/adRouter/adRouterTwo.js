angular.module('adminModuleTwo', []).config(function ($stateProvider) {
    // define module-specific routes here


    $stateProvider.state('admin.departments', {
        templateUrl: '/assets/partials/departments/adDepartmentsList.html',
        controller: 'ADDepartmentListCtrl',
        url: '/departments'
    });

    $stateProvider.state('admin.holdStatus', {
        templateUrl: '/assets/partials/holdStatus/adHoldStatusList.html',
        controller: 'ADHoldStatusListCtrl',
        url: '/holdStatus'
    });

    $stateProvider.state('admin.segment', {
        templateUrl: '/assets/partials/segments/adSegments.html',
        controller: 'ADReservationSegmentsCtrl',
        url: '/segments'
    });

    $stateProvider.state('admin.rates', {
        templateUrl: '/assets/partials/rates/adRatesList.html',
        controller: 'ADRatesListCtrl',
        url: '/rates'
    });

    $stateProvider.state('admin.channelManager', {
        templateUrl: '/assets/partials/rates/adChannelManager.html',
        controller: 'ADChannelMgrCtrl',
        url: '/channelManager'
    });

    $stateProvider.state('admin.channelManagerEditRates', {
        templateUrl: '/assets/partials/rates/adChannelMgrRatesList.html',
        controller: 'ADChannelMgrRatesListCtrl',
        url: '/channelManagerEditRates/:id/:description'
    });

    $stateProvider.state('admin.ratetypes', {
        templateUrl: '/assets/partials/rateTypes/adRateTypeList.html',
        controller: 'ADRateTypeCtrl',
        url: '/ratetypes',
        resolve: {
            rateClassifications: function (ADRateTypeSrv) {
                return ADRateTypeSrv.fetchClassification();
            }
        }
    });

    $stateProvider.state('admin.upselllatecheckout', {
        templateUrl: '/assets/partials/upsellLatecheckout/upsellLatecheckout.html',
        controller: 'ADUpsellLateCheckoutCtrl',
        url: '/upselllatecheckout'
    });


    $stateProvider.state('admin.hotelLoyaltyProgram', {
        templateUrl: '/assets/partials/hotelLoyalty/hotelLoyaltyList.html',
        controller: 'ADHotelLoyaltyCtrl',
        url: '/hotelloyalty'
    });
    $stateProvider.state('admin.roomupsell', {
        templateUrl: '/assets/partials/roomUpsell/roomUpsell.html',
        controller: 'ADRoomUpsellCtrl',
        url: '/roomupsell'
    });

    $stateProvider.state('admin.roomtypes', {
        templateUrl: '/assets/partials/roomTypes/adRoomTypesList.html',
        controller: 'ADRoomTypesCtrl',
        url: '/roomtypes',
        resolve: {
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.roomclasses', {
        templateUrl: '/assets/partials/roomClass/adRoomClassList.html',
        controller: 'ADRoomClassListCtrl',
        url: '/roomclasses'
    });

    $stateProvider.state('admin.floorsetups', {
        templateUrl: '/assets/partials/floorSetups/adFloors.html',
        controller: 'ADFloorsListCtrl',
        url: '/floors'
    });

    $stateProvider.state('admin.addFloor', {
        templateUrl: '/assets/partials/floorSetups/adFloorDetails.html',
        controller: 'ADFloorDetailsCtrl',
        url: '/floors/add',
        resolve: {
            floorDetails: function () {
                return [];
            }
        }
    });

    $stateProvider.state('admin.editFloor', {
        templateUrl: '/assets/partials/floorSetups/adFloorDetails.html',
        controller: 'ADFloorDetailsCtrl',
        url: '/floors/:id',
        resolve: {
            floorDetails: ['ADFloorSetupSrv', '$stateParams',
                function (ADFloorSetupSrv, $stateParams) {
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
        url: '/billingGroups'
    });
    $stateProvider.state('admin.accountsReceivables', {
        templateUrl: '/assets/partials/accountReceivables/adAccountReceivables.html',
        controller: 'ADAccountReceivablesCtrl',
        url: '/accountReceivables'
    });

    $stateProvider.state('admin.reservationTypes', {
        templateUrl: '/assets/partials/reservationTypes/adReservationTypeList.html',
        controller: 'ADReservationTypeListController',
        url: '/reservationtypes'
    });

    $stateProvider.state('admin.interfaceLogs', {
        templateUrl: '/assets/partials/interfaces/Logs/ADInterfaceLogs.html',
        controller: 'ADInterfaceLogsCtrl',
        url: '/interfaceLogs',
        resolve: {
            interfaces: function (ADInterfaceLogsSrv) {
                return ADInterfaceLogsSrv.fetchInterfaces();
            },
            currentTime: function (ADInterfaceLogsSrv) {
                return ADInterfaceLogsSrv.getTime();
            }
        }
    });


    $stateProvider.state('admin.reservationTools', {
        templateUrl: '/assets/partials/reservationTools/adReservationToolsList.html',
        controller: 'ADReservationTypeToolsMainCtrl',
        url: '/reservationTools'
    });

    $stateProvider.state('admin.balanceInventory', {
        templateUrl: '/assets/partials/reservationTools/adBalanceInventory.html',
        controller: 'ADBalanceInventoryCtrl',
        url: '/balanceInventory',
        resolve: {
            allJobs: function (ADReservationToolsSrv) {
                return ADReservationToolsSrv.fetchAllJobs();
            }
        }
    });

    $stateProvider.state('admin.balanceJournal', {
        templateUrl: '/assets/partials/reservationTools/adBalanceJournal.html',
        controller: 'ADBalanceJournalCtrl',
        url: '/balanceJournal',
        resolve: {
            allJobs: function (ADReservationToolsSrv) {
                return ADReservationToolsSrv.fetchAllJobs();
            }
        }
    });

    $stateProvider.state('admin.resyncRates', {
        templateUrl: '/assets/partials/reservationTools/adResyncRates.html',
        controller: 'ADResyncRatesCtrl',
        url: '/resyncRates'
    });

    $stateProvider.state('admin.housekeeping', {
        templateUrl: '/assets/partials/housekeeping/adHousekeeping.html',
        controller: 'adHousekeepingCtrl',
        url: '/housekeeping'
    });

    $stateProvider.state('admin.roomKeyDelivery', {
        templateUrl: '/assets/partials/roomKeyDelivery/roomKeyDelivery.html',
        controller: 'ADRoomKeyDeliveryCtrl',
        url: '/roomKeyDelivery'
    });

    $stateProvider.state('admin.rooms', {
        templateUrl: '/assets/partials/rooms/adRoomList.html',
        controller: 'adRoomListCtrl',
        url: '/rooms'
    });

    $stateProvider.state('admin.roomdetails', {
        templateUrl: '/assets/partials/rooms/adRoomDetails.html',
        controller: 'adRoomDetailsCtrl',

        url: '/roomdetails',
        params: {
            roomId: undefined
        },
        resolve: {
            availableGuestLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.hotellikes', {
        templateUrl: '/assets/partials/Likes/adHotelLikes.html',
        controller: 'ADHotelLikesCtrl',
        url: '/likes'

    });

    $stateProvider.state('admin.items', {
        templateUrl: '/assets/partials/items/adItemList.html',
        controller: 'ADItemListCtrl',
        url: '/items'
    });

    $stateProvider.state('admin.itemdetails', {
        templateUrl: '/assets/partials/items/adItemDetails.html',
        controller: 'ADItemDetailsCtrl',
        url: '/itemdetails/:itemid',
        resolve: {
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });


    $stateProvider.state('admin.chargeGroups', {
        templateUrl: '/assets/partials/chargeGroups/adChargeGroups.html',
        controller: 'ADChargeGroupsCtrl',
        url: '/chargeGroups',
        resolve: {
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.taxExemptTypes', {
        templateUrl: '/assets/partials/taxExempt/adTaxExempts.html',
        controller: 'ADTaxExemptCtrl',
        url: '/taxExempts'
    });

    $stateProvider.state('admin.adTaxExemptDetails', {
        templateUrl: '/assets/partials/taxExempt/adTaxExemptDetails.html',
        controller: 'ADTaxExemptDetailsCtrl',
        url: '/taxExempts/:taxExemptId'
    });    

    $stateProvider.state('admin.paymentMethods', {
        templateUrl: '/assets/partials/paymentMethods/adPaymentMethods.html',
        controller: 'ADPaymentMethodsCtrl',
        url: '/paymentMethods'
    });

    $stateProvider.state('admin.chargeCodes', {
        templateUrl: '/assets/partials/chargeCodes/adChargeCodes.html',
        controller: 'ADChargeCodesCtrl',
        url: '/chargeCodes',
        resolve: {
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.externalPmsConnectivity', {
        templateUrl: '/assets/partials/externalPms/adExternalPmsConnectivity.html',
        controller: 'ADExternalPmsConnectivityCtrl',
        url: '/externalPmsConnectivity'
    });

    $stateProvider.state('admin.addRate', {
        templateUrl: '/assets/partials/rates/adNewRate.html',
        controller: 'ADAddnewRate',
        url: '/addNewRate',
        resolve: {
            rateInitialData: function (ADRatesAddDetailsSrv) {
                return ADRatesAddDetailsSrv.fetchRateTypes();
            },
            rateDetails: function () {
                return {};
            },
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.rateDetails', {
        templateUrl: '/assets/partials/rates/adNewRate.html',
        controller: 'ADAddnewRate',
        url: '/ratedetails/:rateId',
        resolve: {
            rateInitialData: function (ADRatesAddDetailsSrv) {
                return ADRatesAddDetailsSrv.fetchRateTypes();
            },
            rateDetails: function (ADRatesSrv, $stateParams) {
                var params = {
                    rateId: $stateParams.rateId
                };

                return ADRatesSrv.fetchDetails(params);
            },
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.rulesRestrictions', {
        templateUrl: '/assets/partials/rulesRestriction/adRulesRestriction.html',
        controller: 'ADRulesRestrictionCtrl',
        url: '/restriction_types',
        resolve: {
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }
        }
    });

    $stateProvider.state('admin.sociallobbysettings', {
        templateUrl: '/assets/partials/hotelSocialLobbySettings/adHotelSocialLobbySettings.html',
        controller: 'ADSocialLobbySettingsCtrl',
        url: '/sociallobbysettings'
    });

    $stateProvider.state('admin.guestreviewsetup', {
        templateUrl: '/assets/partials/reviews_setups/adGuestReviewSetup.html',
        controller: 'ADGuestReviewSetupCtrl',
        url: '/guestreviewsetup'
    });

    $stateProvider.state('admin.checkin', {
        templateUrl: '/assets/partials/checkin/adCheckin.html',
        controller: 'ADCheckinCtrl',
        url: '/checkin'
    });

    $stateProvider.state('admin.checkout', {
        templateUrl: '/assets/partials/checkout/adCheckout.html',
        controller: 'ADCheckoutCtrl',
        url: '/checkout',
        resolve: {
            roomTypes: function (ADRoomTypesSrv) {
                return ADRoomTypesSrv.fetch();
            }
        }
    });

    $stateProvider.state('admin.cmscomponentSettings', {
        templateUrl: '/assets/partials/contentManagement/adContentManagement.html',
        controller: 'ADContentManagementCtrl',
        url: '/contentManagement'
    });

    $stateProvider.state('admin.contentManagementSectionDetails', {
        templateUrl: '/assets/partials/contentManagement/adContentManagementSectionDetail.html',
        controller: 'ADContentManagementSectionDetailCtrl',
        url: '/contentManagement/section/:id'
    });

    $stateProvider.state('admin.contentManagementCategoryDetails', {
        templateUrl: '/assets/partials/contentManagement/adContentManagementCategoryDetail.html',
        controller: 'ADContentManagementCategoryDetailCtrl',
        url: '/contentManagement/category/:id'
    });
    $stateProvider.state('admin.contentManagementItemDetails', {
        templateUrl: '/assets/partials/contentManagement/adContentManagementItemDetail.html',
        controller: 'ADContentManagementItemDetailCtrl',
        url: '/contentManagement/item/:id'
    });


    $stateProvider.state('admin.checkinEmail', {
        templateUrl: '/assets/partials/emailList/adCheckinCheckoutemail.html',
        controller: 'ADCheckinEmailCtrl',
        url: '/checkinEmail'
    });
    $stateProvider.state('admin.maintenanceReasons', {
        templateUrl: '/assets/partials/maintenanceReasons/adMaintenanceReasons.html',
        controller: 'ADMaintenanceReasonsCtrl',
        url: '/maintenanceReasons'
    });

    $stateProvider.state('admin.markets', {
        templateUrl: '/assets/partials/markets/adMarkets.html',
        controller: 'ADMarketsCtrl',
        url: '/markets'
    });

    $stateProvider.state('admin.sources', {
        templateUrl: '/assets/partials/sources/adSources.html',
        controller: 'ADSourcesCtrl',
        url: '/sources'
    });

    $stateProvider.state('admin.bookingOrigins', {
        templateUrl: '/assets/partials/origins/adOrigins.html',
        controller: 'ADOriginsCtrl',
        url: '/origins'
    });

    $stateProvider.state('admin.ratesAddons', {
        templateUrl: '/assets/partials/rates/adRatesAddons.html',
        controller: 'ADRatesAddonsCtrl',
        url: '/rates_addons',
        resolve: {
            addonUpsellSettings: function (ADUpsellAddonSrv) {
                return ADUpsellAddonSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.ratesAddonDetails', {
        templateUrl: '/assets/partials/rates/adNewAddon.html',
        controller: 'ADRatesAddonDetailsCtrl',
        url: '/rates_addons/:addonId',
        resolve: {
            hotelSettings: function(ADRulesRestrictionSrv) {
                return ADRulesRestrictionSrv.fetchHotelCurrency();
            },
            activeRates: function (ADPromotionsSrv) {
                return ADPromotionsSrv.getActiveRates();
            },
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: false
                });
            },
            singleAddon: function (ADRatesAddonsSrv, $stateParams) {
                if ($stateParams.addonId === "") {
                    return {};
                }
                var addon = ADRatesAddonsSrv.fetchSingle($stateParams.addonId);
                addon.id = $stateParams.addonId;
                return addon;
            }
        }
    });

    $stateProvider.state('admin.ratesSequence', {
        templateUrl: '/assets/partials/rateSequence/adRatesSequence.html',
        controller: 'ADRatesSequenceCtrl',
        url: '/rates_sequence'
    });

    $stateProvider.state('admin.customRatesSequence', {
        templateUrl: '/assets/partials/customRateSequence/adCustomRatesSequence.html',
        controller: 'ADCustomRatesSequenceCtrl',
        url: '/custom_rates_sequence'
    });

    $stateProvider.state('admin.manageCustomRatesSequence', {
        templateUrl: '/assets/partials/customRateSequence/adManageCustomRatesSequence.html',
        controller: 'ADManageCustomRatesSequenceCtrl',
        url: '/custom_rates_sequence'
    });

    $stateProvider.state('admin.promotions', {
        templateUrl: '/assets/partials/rates/adPromotions.html',
        controller: 'ADPromotionsCtrl',
        url: '/promotions',
        resolve: {
            activeRates: function (ADPromotionsSrv) {
                return ADPromotionsSrv.getActiveRates();
            }
        }
    });

    $stateProvider.state('admin.userRoles', {
        templateUrl: '/assets/partials/UserRoles/adUserRoles.html',
        controller: 'ADUserRolesCtrl',
        url: '/UserRoles',
        resolve: {
            userRolesData: function (ADUserRolesSrv) {
                return ADUserRolesSrv.fetchUserRoles();
            }
        }
    });


    $stateProvider.state('admin.reservationSettings', {
        templateUrl: '/assets/partials/reservations/adReservationSettings.html',
        controller: 'ADReservationSettingsCtrl',
        url: '/reservationSettings',
        resolve: {
            reservationSettingsData: function (ADReservationSettingsSrv) {
                return ADReservationSettingsSrv.fetchReservationSettingsData();
            }
        }
    });


    $stateProvider.state('admin.ibeaconSettings', {
        templateUrl: '/assets/partials/iBeaconSettings/adibeaconSettings.html',
        controller: 'ADiBeaconSettingsCtrl',
        url: '/ibeaconSettings'
    });

    $stateProvider.state('admin.earlyCheckin', {
        templateUrl: '/assets/partials/earlyCheckin/adEarlyCheckin.html',
        controller: 'ADEarlyCheckinCtrl',
        url: '/earlyCheckin',
        resolve: {
            blockCodeData: function (adCheckinSrv) {
                return adCheckinSrv.getBlockCodes();
            }
        }
    });

    $stateProvider.state('admin.iBeaconDetails', {
        templateUrl: '/assets/partials/iBeaconSettings/adiBeaconDetails.html',
        controller: 'ADiBeaconDetailsCtrl',
        url: '/iBeaconDetails/:action',
        resolve: {
            beaconNeighbours: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconList();
            },
            triggerTypes: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconTriggerTypes();
            },
            beaconTypes: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconTypes();
            },
            beaconDetails: function (adiBeaconSettingsSrv, $stateParams) {
                var params = {
                    'id': $stateParams.action
                };

                return adiBeaconSettingsSrv.fetchBeaconDetails(params);
            },
            defaultBeaconDetails: function () {
                return {};
            }
        }
    });

    $stateProvider.state('admin.iBeaconNewDetails', {
        templateUrl: '/assets/partials/iBeaconSettings/adiBeaconDetails.html',
        controller: 'ADiBeaconDetailsCtrl',
        url: '/iBeaconDetails/:action',
        resolve: {
            beaconNeighbours: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconList();
            },
            triggerTypes: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconTriggerTypes();
            },
            beaconTypes: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconTypes();
            },
            beaconDetails: function () {
                return {};
            },
            defaultBeaconDetails: function (adiBeaconSettingsSrv) {
                return adiBeaconSettingsSrv.fetchBeaconDeafultDetails();
            }
        }
    });

    $stateProvider.state('admin.settingsAndParams', {
        templateUrl: '/assets/partials/settingsAndParams/adSettingsAndParams.html',
        controller: 'settingsAndParamsCtrl',
        url: '/settingsAndParams',
        resolve: {
            settingsAndParamsData: function (settingsAndParamsSrv) {
                return settingsAndParamsSrv.fetchsettingsAndParams();
            },
            chargeCodes: function (settingsAndParamsSrv) {
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
        url: '/checkoutEmail'
    });

    $stateProvider.state('admin.deviceMapping', {
        templateUrl: '/assets/partials/deviceMapping/adDeviceMappingList.html',
        controller: 'ADDeviceMappingsCtrl',
        url: '/deviceMappingsList'
    });

    $stateProvider.state('admin.externalMappings', {
        templateUrl: '/assets/partials/mapping/adExternalMappingItems.html',
        controller: 'ADMappingCtrl',
        url: '/intefaceMappingsList'
    });

    $stateProvider.state('admin.ifcComtrolSetup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/comtrolSetup'
    });

    $stateProvider.state('admin.backOfficeSetup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/backOfficeInterfaces'
    });

    $stateProvider.state('admin.centralReservationSystemGroup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/backOfficeInterfaces'
    });

    $stateProvider.state('admin.scInterfaces', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/backOfficeInterfaces'
    });

    $stateProvider.state('admin.revenueManagementSystemGroup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/backOfficeInterfaces'
    });

    $stateProvider.state('admin.textMessagingGroup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/textMessagingInterfaces'
    });

    $stateProvider.state('admin.adInterfaceCRM', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/crmInterfaces'
    });
    $stateProvider.state('admin.concierge', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/crmInterfaces'
    });

    $stateProvider.state('admin.stationary', {
        templateUrl: '/assets/partials/stationary/adStationary.html',
        controller: 'ADStationaryCtrl',
        url: '/stationary',
        resolve: {
            availableGuestLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages();
            },
            availableHoldStatus: function (ADHoldStatusSrv) {
                return ADHoldStatusSrv.fetch();
            }
        }
    });

    $stateProvider.state('admin.languages', {
        templateUrl: '/assets/partials/languages/adLanguages.html',
        controller: 'ADLanguagesCtrl',
        url: '/languages'
    });

    $stateProvider.state('admin.ftpservers', {
        templateUrl: '/assets/partials/ftpServers/adFTPServerList.html',
        controller: 'ADFTPServersCtrl',
        url: '/ftpservers'
    });

    $stateProvider.state('admin.ftpserverdetails', {
        templateUrl: '/assets/partials/ftpServers/adFTPServerAdd.html',
        controller: 'ADFTPServersDetailsCtrl',
        url: '/ftpserverdetails/:id'
    });

    $stateProvider.state('admin.analyticsSetup', {
        templateUrl: '/assets/partials/AnalyticSetup/adAnalyticSetup.html',
        controller: 'adAnalyticSetupCtrl',
        url: '/analyticSetup'
    });

    $stateProvider.state('admin.emailBlacklist', {
        templateUrl: '/assets/partials/EmailBlackList/adEmailBlackList.html',
        controller: 'ADEmailBlackListCtrl',
        url: '/emailBlacklist'
    });

    $stateProvider.state('admin.financialSettings', {
        templateUrl: '/assets/partials/invoices/adInvoiceSettings.html',
        controller: 'ADInvoiceSettingsCtrl',
        url: '/financialSettings',
        resolve: {
            invoiceSettingsData: function (ADInvoiceSettingsSrv) {
                return ADInvoiceSettingsSrv.fetchInvoiceSettings();
            }
        }
    });

    $stateProvider.state('admin.translations', {
        templateUrl: '/assets/partials/translation/adTranslation.html',
        controller: 'ADTranslationCtrl',
        url: '/translation',
        resolve: {
            availableLanguages: function (ADTranslationSrv) {
                return ADTranslationSrv.getGuestLanguages();
            },
            menuDetails: function (ADTranslationSrv) {
                return ADTranslationSrv.getMenuOptionDetails();
            }
        }
    });

    $stateProvider.state('admin.zestWebCommon', {
        templateUrl: '/assets/partials/zestwebCommonSettings/adZestwebCommonSettings.html',
        controller: 'ADZestwebCommonSettingsCtrl',
        url: '/zestWebCommonSettings',
        resolve: {
            zestWebCommonSettings: function (ADzestwebCommonSettingsSrv) {
                return ADzestwebCommonSettingsSrv.fetchSettings();
            },
            initialFooterSettings: function (ADzestwebCommonSettingsSrv) {
                return ADzestwebCommonSettingsSrv.fetchInitialFooterSettings();
            }
        }
    });

    $stateProvider.state('admin.zestWebRoomReadyEmailSetup', {
        templateUrl: '/assets/partials/zestSetup/adZestWebRoomReadyEmailSetup.html',
        controller: 'ADZestWebRoomReadyEmailSetupCtrl',
        url: '/zestWebRoomReadyEmailSetup',
        resolve: {
            data: function (ADZestWebRoomReadyEmailSetupSrv) {
                return ADZestWebRoomReadyEmailSetupSrv.getRoomReayEmailSettings();
            }
        }
    });


    $stateProvider.state('admin.upsellAddonSettings', {
        templateUrl: '/assets/partials/upsellAddons/adUpsellAddons.html',
        controller: 'adUpsellAddonSettingsCtrl',
        url: '/upsellAddons',
        resolve: {
            upsellData: function (ADUpsellAddonSrv) {
                return ADUpsellAddonSrv.getSettings();
            },
            availableLanguages: function(ADTranslationSrv) {
                return ADTranslationSrv.getActiveGuestLanguages({
                    show_only_active_languages: true
                });
            }

        }
    });


    $stateProvider.state('admin.zestWebAddons', {
        templateUrl: '/assets/partials/checkin/adZestWebAddons.html',
        controller: 'ADZestWebAddonCtrl',
        url: '/zestWebAddons',
        resolve: {
             addonUpsellSettings: function (ADUpsellAddonSrv) {
                return ADUpsellAddonSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestStationAddons', {
        templateUrl: '/assets/partials/zestStation/adZestStationAddons.html',
        controller: 'ADZestStationAddonCtrl',
        url: '/zestStationAddons',
        resolve: {
            addonUpsellSettings: function(ADUpsellAddonSrv) {
                return ADUpsellAddonSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.stationHueSettings', {
        templateUrl: '/assets/partials/zestStation/adZestStationHueSettings.html',
        controller: 'adZestStationHueSettingsCtrl',
        url: '/upsellAddons',
        resolve: {
            kioskSettings: function (ADZestStationSrv) {
                return ADZestStationSrv.fetch();
            }
        }
    });

    $stateProvider.state('admin.stationWalkInReservations', {
        templateUrl: '/assets/partials/zestStation/adStationWalkInReservations.html',
        controller: 'adStationWalkInReservationsCtrl',
        url: '/zestWalkin',
        resolve: {
            kioskSettings: function(ADZestStationSrv) {
                return ADZestStationSrv.fetch();
            },
            marketSegments: function(ADMarketsSrv) {
                return ADMarketsSrv.fetch();
            },
            bookingSources: function(ADSourcesSrv) {
                return ADSourcesSrv.fetch();
            },
            bookingOrigins: function(ADOriginsSrv) {
                return ADOriginsSrv.fetch();
            },
            rateCodes: function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchRatesMinimal();
            }
        }
    });
    
    // =================================================================================================

    $stateProvider.state('admin.emailTemplatesSettingsGroup', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestEmailTemplateList.html',
        controller: 'ADZestEmailMenuCtrl',
        url: '/emailTemplates'
    });

    $stateProvider.state('admin.zestEmailGeneralSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestEmailGeneralSettings.html',
        controller: 'ADZestEmailGeneralSettingsCtrl',
        url: '/generalSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestPreCheckinEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestEmailPrecheckinSettingsCtrl',
        url: '/precheckinSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestCheckinEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestCheckinEmailSettingsCtrl',
        url: '/checkinSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestCheckoutEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestCheckoutEmailSettingsCtrl',
        url: '/checkoutSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestLateCheckoutEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestLateCheckoutEmailSettingsCtrl',
        url: '/lateCheckoutSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });
    $stateProvider.state('admin.zestKeyDeliveryCommonSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestKeyDeliveryCommonSettings.html',
        controller: 'ADZestKeyDeliveryCommonCtrl',
        url: '/keyCommonSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestTextKeyDeliveryEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestTextKeyDeliverySettingsCtrl',
        url: '/keyTextEmailSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestQRKeyDeliveryEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestQRKeyDeliverySettingsCtrl',
        url: '/keyQREmailSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    $stateProvider.state('admin.zestMobileKeyEmailSettings', {
        templateUrl: '/assets/partials/zestEmailTemplates/adZestCommonEmailSettings.html',
        controller: 'ADZestMobileKeyEmailSettingsCtrl',
        url: '/mobileKeyEmailSettings',
        resolve: {
            data: function(adZestEmailTemplateSrv) {
                return adZestEmailTemplateSrv.getSettings();
            }
        }
    });

    // =================================================================================================
    
    $stateProvider.state('admin.propertyGroups', {
        templateUrl: '/assets/partials/chainAdmins/adPropertyGroups.html',
        controller: 'ADPropertyGroupsCtrl',
        url: '/propertyGroups'
    });

    $stateProvider.state('admin.webhooks', {
        templateUrl: '/assets/partials/webhookSettings/adWebhookList.html',
        controller: 'ADWebhookListCtrl',
        url: '/webhook',
        resolve: {
            webHooks: ['ADWebhookSrv', function (ADWebhookSrv) {
                return ADWebhookSrv.fetchWebHooks();
            }]
        }
    });

    $stateProvider.state('admin.houseKeepingSections', {
        templateUrl: '/assets/partials/hkSections/adHkSections.html',
        controller: 'ADHKSectionListCtrl',
        url: '/hkSections'
    });

    $stateProvider.state('admin.addHKSection', {
        templateUrl: '/assets/partials/hkSections/adSectionDetails.html',
        controller: 'ADHKSectionDetailsCtrl',
        url: '/hkSectionDetails',
        resolve: {
            sectionDetails: function () {
                return {};
            }
        }
    });
    $stateProvider.state('admin.editHKSection', {
        templateUrl: '/assets/partials/hkSections/adSectionDetails.html',
        controller: 'ADHKSectionDetailsCtrl',
        url: '/hkSectionDetails/:sectionId',
        resolve: {
            sectionDetails: function (ADHKSectionSrv, $stateParams) {
                return ADHKSectionSrv.getHkSectionDetails($stateParams.sectionId);
            }
        }
    });

    $stateProvider.state('admin.appServices', {
        templateUrl: '/assets/partials/menuList/adMenuList.html',
        controller: 'ADMenuListCtrl',
        url: '/Services',
        data: {
            'title': 'Services'
        }
    });

    $stateProvider.state('admin.appVersions', {
        templateUrl: '/assets/partials/sntApps/adSntAppsVersions.html',
        controller: 'ADSntAppsListCtrl',
        url: '/appVersions',
        resolve: {
            appTypes: function(adDebuggingSetupSrv) {
                return adDebuggingSetupSrv.retrieveAppTypes();
            }
        }
    });

    $stateProvider.state('admin.registeredDevices', {
        templateUrl: '/assets/partials/installedDevices/adDevicesList.html',
        controller: 'ADDevicesListCtrl',
        url: '/registeredDevices',
        resolve: {
            appTypes: function(adDebuggingSetupSrv) {
                return adDebuggingSetupSrv.retrieveAppTypes();
            }
        }
    });

    $stateProvider.state('admin.guestDataRemoval', {
        templateUrl: '/assets/partials/guestDataRemoval/adGuestDataRemoval.html',
        controller: 'ADGuestDataRemovalCtrl',
        url: '/hkSections'
    });

    $stateProvider.state('admin.featureToggles', {
        templateUrl: '/assets/partials/featureToggles/adFeaturesList.html',
        controller: 'ADFeatureToggleListCtrl',
        url: '/features'
    });

    $stateProvider.state('admin.configFeature', {
        templateUrl: '/assets/partials/featureToggles/adFeaturesConfig.html',
        controller: 'ADFeatureToggleConfigCtrl',
        url: '/features/:feature',
        resolve: {
            feature: ['ADFeatureToggleSrv', '$stateParams', function (ADFeatureToggleSrv, $stateParams) {
                return ADFeatureToggleSrv.show($stateParams['feature']);
            }]
        }
    });

    $stateProvider.state('admin.idCollection', {
      templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
      controller: 'ADInterfaceSubMenuCtrl',
      url: '/idCollection'
    });

    $stateProvider.state('admin.archivalTransfer', {
      templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
      controller: 'ADInterfaceSubMenuCtrl',
      url: '/archivalTransfer'
    });

    $stateProvider.state('admin.cotaMandatoryFields', {
      templateUrl: '/assets/partials/cards/coTaMandatoryFields.html',
      controller: 'ADCoTaMandatoryFieldsCtrl',
      url: '/coTaMandatoryFields'
    });

    $stateProvider.state('admin.guestCardFields', {
      templateUrl: '/assets/partials/cards/guestCardFields.html',
      controller: 'ADGuestCardFieldsCtrl',
      url: '/adGuestCardFields'
    });

    $stateProvider.state('admin.oracleDataCenters', {
      templateUrl: '/assets/partials/dataCenters/adOracleDataCenters.html',
      controller: 'ADOracleDataCentersCtrl',
      url: '/oracleDataCenters'
    });

    $stateProvider.state('admin.dropboxAccounts', {
        templateUrl: '/assets/partials/dropbox/adDropboxAccountList.html',
        controller: 'ADDropboxAccountListCtrl',
        url: '/dropboxaccounts'
    });

    $stateProvider.state('admin.dropboxAccountDetails', {
        templateUrl: '/assets/partials/dropbox/adDropboxAccountDetails.html',
        controller: 'ADDropboxAccountDetailsCtrl',
        url: '/dropboxaccountdetails/:id',
        params: {
            id: '',
            data: null
        }
    });

    $stateProvider.state('admin.googledriveAccounts', {
        templateUrl: '/assets/partials/googleDrive/adGoogleDriveAccountList.html',
        controller: 'ADGoogleDriveAccountListCtrl',
        url: '/googledriveaccounts',
        params: {
            updated: null
        },
        resolve: {
            storageConfig: function (ACGIIntegrationSrv) {
                return ACGIIntegrationSrv.fetchConfiguration();
            }
        }
    });
    
    $stateProvider.state('admin.policeExportDefaults', {
        templateUrl: '/assets/partials/policeExportDefaults/adPoliceExportDefaults.html',
        controller: 'ADPoliceExportDefaultsCtrl',
        url: '/policeExportDefaults',
        resolve: {
            defaultSettings: function (adPoliceExportDefaultSrv) {
                return adPoliceExportDefaultSrv.fetchCountry();
            }
        }
    });

    $stateProvider.state('admin.googledriveAccounts.details', {
        templateUrl: '/assets/partials/googleDrive/adGoogleDriveAccountDetails.html',
        controller: 'ADGoogleDriveAccountDetailsCtrl',
        url: '/googleaccountdetails/:id',
        params: {
            id: '',
            data: null
        }
    });

});
