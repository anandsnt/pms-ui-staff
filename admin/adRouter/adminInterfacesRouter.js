angular.module('adminInterfacesRouter', []).config(function($stateProvider) {

    $stateProvider.state('admin.exactOnlineSetup', {
        templateUrl: '/assets/partials/ExactOnline/setup/adExactOnlineSetup.html',
        controller: 'adExactOnlineSetupCtrl',
        url: '/exactonline/setup',
        resolve: {
            exactOnlineSetupValues: ['adExactOnlineSetupSrv', function(adExactOnlineSetupSrv) {
                return adExactOnlineSetupSrv.fetchExactOnLineConfiguration();
            }],
            journalsList: ['adExactOnlineSetupSrv', function(adExactOnlineSetupSrv) {
                return adExactOnlineSetupSrv.fetchJournalsList();
            }],
            balancingAccounts: ['adExactOnlineSetupSrv', function(adExactOnlineSetupSrv) {
                return adExactOnlineSetupSrv.fetchBalancingAccounts();
            }],
            endPoints: ['adExactOnlineSetupSrv', function(adExactOnlineSetupSrv) {
                return adExactOnlineSetupSrv.fetchEndpointsList();
            }]
        }
    });

    $stateProvider.state('admin.zestWebGlobalSetup', {
        templateUrl: '/assets/partials/zestwebGlobalSettings/adZestWebGlobalSettings.html',
        controller: 'ADzestWebGlobalSettingsCtrl',
        resolve: {
            zestWebGlobalSettings: ['ADzestWebGlobalSettingsSrv', function(ADzestWebGlobalSettingsSrv) {
                return ADzestWebGlobalSettingsSrv.fetchZestwebGlobalSettings();
            }]
        },
        url: '/zestWebGlobalSettings'
    });

    $stateProvider.state('admin.propertyInterfaceSetup', {
        templateUrl: '/assets/partials/property/propertyInterfaceSetup.html',
        controller: 'ADPropertyInterfaceSetupCtrl',
        url: '/propertyinterface/setup'
    });

    $stateProvider.state('admin.letshareSetup', {
        templateUrl: '/assets/partials/letshare/letShareSetup.html',
        controller: 'adLetShareSetupCtrl',
        url: '/letshare/setup',
        resolve: {
            letsShareSetupValues: ['adLetShareSetupSrv', function(adLetShareSetupSrv) {
                return adLetShareSetupSrv.fetchLetShareConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.goMomentIvySetup', {
        templateUrl: '/assets/partials/interfaces/GoMomentIvy/goMomentIvySetup.html',
        controller: 'adGoMomentIvySetupCtrl',
        url: '/gomomentivy/setup',
        resolve: {
            goMomentIvySetupValues: ['adGoMomentIvySetupSrv', function(adGoMomentIvySetupSrv) {
                return adGoMomentIvySetupSrv.fetchGoMomentIvyConfiguration();
            }]
        }
    });


    $stateProvider.state('admin.checkmate', {
        templateUrl: '/assets/partials/interfaces/Checkmate/checkmateSetup.html',
        controller: 'adCheckmateSetupCtrl',
        url: '/checkmate/setup',
        resolve: {
            checkmateSetupValues: ['adCheckmateSetupSrv', function(adCheckmateSetupSrv) {
                return adCheckmateSetupSrv.fetchCheckmateConfiguration();
            }]
        }
    });


    $stateProvider.state('admin.lightspeedPosSetup', {
        templateUrl: '/assets/partials/lightspeedPOS/adLightspeedPOSSetup.html',
        controller: 'adLightSpeedPOSSetupCtrl',
        url: '/lightspeedpos/setup',
        resolve: {
            lightSpeedSetupValues: ['adLightSpeedPOSSetupSrv', function(adLightSpeedPOSSetupSrv) {
                return adLightSpeedPOSSetupSrv.fetchLightSpeedPOSConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.windsurferCRSSetup', {
        templateUrl: '/assets/partials/WindsurferCRS/setup/adWindsurferCRSSetup.html',
        controller: 'adWindsurferCRSSetupCtrl',
        url: '/windsurfercrs/setup',
        resolve: {
            windsurferCRSSetupValues: ['adWindsurferCRSSetupSrv', function(adWindsurferCRSSetupSrv) {
                return adWindsurferCRSSetupSrv.fetchWindsurferCRSConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.travelClickSetup', {
        templateUrl: '/assets/partials/interfaces/TravelClick/adTravelClickCRSSetup.html',
        controller: 'adTravelClickCRSSetupCtrl',
        url: '/travelclick/setup',
        resolve: {
            CRSConfig: ['adTravelClickCRSSetupSrv', function(adTravelClickCRSSetupSrv) {
                return adTravelClickCRSSetupSrv.fetchCRSConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.cubilisSetup', {
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup/:id',
        onEnter: ['$stateParams', function($stateParams) {
            $stateParams.id = 'cubilis';
        }],
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('cubilis');
            }]
        }
    });

    $stateProvider.state('admin.verticalBookingSetup', {
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup/:id',
        onEnter: ['$stateParams', function($stateParams) {
            $stateParams.id = 'verticalbooking';
        }],
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('verticalbooking');
            }]
        }
    });


    $stateProvider.state('admin.ideasSetup', {
        templateUrl: '/assets/partials/interfaces/ideas/adIdeasSetup.html',
        controller: 'adIdeasSetupCtrl',
        url: '/ideas/setup',
        resolve: {
            ideaSetup: ['adIdeasSetupSrv', function(adIdeasSetupSrv) {
                return adIdeasSetupSrv.getIdeaSetup();
            }]
        }
    });

    $stateProvider.state('admin.duettoSetup', {
        templateUrl: '/assets/partials/interfaces/Duetto/adDuettoSetup.html',
        controller: 'adDuettoSetupCtrl',
        url: '/duetto/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('duetto');
            }]
        }
    });

    $stateProvider.state('admin.delphi', {
        templateUrl: '/assets/partials/interfaces/Delphi/adDelphiSetup.html',
        controller: 'adDelphiCtrl',
        url: '/delphi/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('delphi');
            }]
        }
    });

    $stateProvider.state('admin.revinateSetup', {
        templateUrl: '/assets/partials/interfaces/Revinate/adRevinateSetup.html',
        controller: 'adRevinateSetupCtrl',
        url: '/revinate/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                // return {'enabled':true} // uncomment if needing to test UI without IFC connection
                return adInterfacesCommonConfigSrv.fetchConfiguration('revinate');
            }]
        }
    });

    $stateProvider.state('admin.accountViewSetup', {
        templateUrl: '/assets/partials/interfaces/AccountView/adAccountViewSetup.html',
        controller: 'adAccountViewSetupCtrl',
        url: '/revinate/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('accountview');
            }]
        }
    });

    $stateProvider.state('admin.ifc_comtrol_settings', {
        templateUrl: '/assets/partials/IFCComtrol/adIFCComtrolSetup.html',
        controller: 'adIFCComtrolSetupCtrl',
        url: '/ifc_comtrol/setup',
        resolve: {
            ifcComtrolSetupValues: ['adIFCComtrolSetupSrv', function(adIFCComtrolSetupSrv) {
                return adIFCComtrolSetupSrv.fetchIFCComtrolConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.ifc_revenue_centers', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolRevenueCenterConfig.html',
        controller: 'adComtrolRevenueCenterCtrl',
        url: '/ifc_comtrol/revenueCenter',
        resolve: {
            revCenters: ['adComtrolRevenueCenterSrv', function(adComtrolRevenueCenterSrv) {
                return adComtrolRevenueCenterSrv.fetch();
            }]
        }
    });

    $stateProvider.state('admin.ifc_charge_codes', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolChargeCodes.html',
        controller: 'adComtrolChargeCodeMappingCtrl',
        url: '/ifc_comtrol/chargeCodeMappings',
        resolve: {
            mappedChargeCodes: ['adComtrolChargeCodeMappingSrv', function(adComtrolChargeCodeMappingSrv) {
                return adComtrolChargeCodeMappingSrv.fetch();
            }]
        }
    });

    $stateProvider.state('admin.ifc_generic_mappings', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolGenericMappings.html',
        controller: 'adComtrolGenericMappingCtrl',
        url: '/ifc_comtrol/genericMappings',
        resolve: {
            genericMappings: ['adComtrolGenericMappingSrv', function(adComtrolGenericMappingSrv) {
                return adComtrolGenericMappingSrv.fetch();
            }]
        }
    });


    $stateProvider.state('admin.ifc_room_mappings', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolRoomMappings.html',
        controller: 'adComtrolRoomMappingCtrl',
        url: '/ifc_comtrol/setup',
        resolve: {
            roomMappings: ['adComtrolRoomMappingSrv', function(adComtrolRoomMappingSrv) {
                return adComtrolRoomMappingSrv.fetch();
            }]
        }
    });

    $stateProvider.state('admin.gustoPosSetup', {
        templateUrl: '/assets/partials/GustoPOS/adGustoPOSSetup.html',
        controller: 'adGustoPOSSetupCtrl',
        url: '/guestopos/setup',
        resolve: {
            gustoSetupValues: ['adGustoPOSSetupSrv', function(adGustoPOSSetupSrv) {
                return adGustoPOSSetupSrv.fetchGustoPOSConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.britePabXSetup', {
        templateUrl: '/assets/partials/britePabX/britePabXSetup.html',
        controller: 'adBritePabXSetupCtrl',
        url: '/britePabX/setup',
        resolve: {
            britePabXSetupValues: ['adBritePabXSetupSrv', function(adBritePabXSetupSrv) {
                return adBritePabXSetupSrv.fetchBritePabXConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.afasSetup', {
        templateUrl: '/assets/partials/afas/afasSetup.html',
        controller: 'adAfasSetupCtrl',
        url: '/letshare/setup',
        resolve: {
            afasSetupValues: ['adAfasSetupSrv', function(adAfasSetupSrv) {
                return adAfasSetupSrv.fetchAfasConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.m3BackOfficeExport', {
        templateUrl: '/assets/partials/interfaces/M3BackOffice/ADM3Configuration.html',
        controller: 'ADM3BackOfficeCtrl',
        url: '/backoffice/m3/setup',
        resolve: {
            m3AccountingSetupValues: ['ADM3SetupSrv', function(ADM3SetupSrv) {
                return ADM3SetupSrv.getConfig();
            }]
        }
    });

    $stateProvider.state('admin.mapping', {
        templateUrl: '/assets/partials/mapping/adExternalMapping.html',
        controller: 'ADMappingCtrl',
        url: '/mapping/:hotelId'
    });

    $stateProvider.state('admin.external-mappings', {
        templateUrl: '/assets/partials/interfaces/ExternalMappings/adExternalMappingsList.html',
        controller: 'ADExternalMappingsListCtrl',
        url: '/mappings/show/:hotel_id/:interface_id/:interface_name'
    });

    $stateProvider.state('admin.add-external-mapping', {
        templateUrl: '/assets/partials/interfaces/ExternalMappings/adExternalMappingsAdd.html',
        url: '/mappings/add/:mapping_type/:hotel_id/:interface_id/:interface_name',
        controller: 'ADExternalMappingsAddCtrl',
        resolve: {
            mappingTypes: ['ADInterfaceMappingSrv', '$stateParams',
                function(ADInterfaceMappingSrv, $stateParams) {
                    return ADInterfaceMappingSrv.fetchInterfaceMappingTypes({
                        interface_type_id: $stateParams.interface_id,
                        hotel_id: $stateParams.hotel_id
                    });
                }
            ]
        }
    });

    $stateProvider.state('admin.edit-external-mapping', {
        templateUrl: '/assets/partials/interfaces/ExternalMappings/adExternalMappingsEdit.html',
        url: '/mappings/add/:mapping_type/:hotel_id/:interface_id/:interface_name/:mapping_id',
        controller: 'ADExternalMappingsEditCtrl',
        resolve: {
            mappingTypes: ['ADInterfaceMappingSrv', '$stateParams',
                function(ADInterfaceMappingSrv, $stateParams) {
                    return ADInterfaceMappingSrv.fetchInterfaceMappingTypes({
                        interface_type_id: $stateParams.interface_id,
                        hotel_id: $stateParams.hotel_id
                    });
                }
            ],
            mapping: ['ADInterfaceMappingSrv', '$stateParams',
                function(ADInterfaceMappingSrv, $stateParams) {
                    return ADInterfaceMappingSrv.fetchMappingWithId({
                        mapping_id: $stateParams.mapping_id
                    });
                }
            ]
        }
    });


    $stateProvider.state('admin.ffp', {
        templateUrl: '/assets/partials/frequentFlyerProgram/adFFPList.html',
        controller: 'ADFrequentFlyerProgramCtrl',
        url: '/ffp'
    });

    $stateProvider.state('admin.icare', {
        templateUrl: '/assets/partials/icare/adIcareServices.html',
        controller: 'ADIcareServicesCtrl',
        url: '/icare'
    });

    $stateProvider.state('admin.keyEncoders', {
        templateUrl: '/assets/partials/keyEncoders/adKeyEncoderList.html',
        controller: 'ADKeyEncoderCtrl',
        url: '/encoders'
    });

    $stateProvider.state('admin.emvTerminals', {
        templateUrl: '/assets/partials/emvTerminals/emvTerminalList.html',
        controller: 'ADEmvTerminalCtrl',
        url: '/terminals'
    });

    $stateProvider.state('admin.emvTerminalDetails', {
        templateUrl: '/assets/partials/emvTerminals/emvTerminalDetails.html',
        controller: 'ADEmvTerminalDetailsCtrl',
        url: '/terminaldetails/:itemid'
    });

    $stateProvider.state('admin.doorlockInterface', {
        templateUrl: '/assets/partials/doorLockInterface/adDoorLockInterface.html',
        controller: 'ADDoorLockInterfaceCtrl',
        url: '/doorlockinterface'
    });

    $stateProvider.state('admin.sitemindersSetup', {
        templateUrl: '/assets/partials/SiteminderSetup/adSiteminderSetup.html',
        controller: 'adExternalInterfaceCtrl',
        // interface_id: 2,
        interface_id: 'SITEMINDER',
        simple_name: 'Siteminder',
        url: '/siteminderSetup'
    });

    $stateProvider.state('admin.givexSetup', {
        templateUrl: '/assets/partials/Givex/adGivexSetup.html',
        controller: 'adExternalInterfaceCtrl',
        // interface_id: 4,
        interface_id: 'GIVEX',
        simple_name: 'Givex',
        url: '/siteminderSetup'
    });

    $stateProvider.state('admin.synxisSetup', {
        templateUrl: '/assets/partials/SynxisSetup/adSynxisSetup.html',
        controller: 'adExternalInterfaceCtrl',
        // interface_id: 3,
        interface_id: 'SYNXIS',
        simple_name: 'Synxis',
        url: '/synxisSetup'
    });

    $stateProvider.state('admin.zDirectSetup', {
        templateUrl: '/assets/partials/ZDirectSetup/adZDirectSetup.html',
        controller: 'adExternalInterfaceCtrl',
        // interface_id: 4,
        interface_id: 'ZDIRECT',
        simple_name: 'ZDirect',
        url: '/zDirectSetup'
    });

    $stateProvider.state('admin.travelTripperSetup', {
        templateUrl: '/assets/partials/travelTripperSetup/adtravelTripperSetup.html',
        controller: 'adExternalInterfaceCtrl',
        // interface_id: 4,
        interface_id: 'TRAVELTRIPPER',
        simple_name: 'TravelTripper',
        url: '/travelTripperSetup'
    });

    
    $stateProvider.state('admin.snapshotSetup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/snapshotSetup'
    });


    $stateProvider.state('admin.snapshotGeneralSetup', {
        templateUrl: '/assets/partials/snapshotSetup/adSnapshotSetup.html',
        controller: 'adsnapshotSetupCtrl',
        url: '/snapshotSetup/general'
    });

    $stateProvider.state('admin.snapshotChargeGroupMapping', {
        templateUrl: '/assets/partials/snapshotSetup/adSnapshotChargeGroupMapping.html',
        controller: 'adSnapshotChargeGroupMappingCtrl',
        url: '/snapshotSetup/chargeGroupMapping'
    });

    $stateProvider.state('admin.snapshotSubGroupMapping', {
        templateUrl: '/assets/partials/snapshotSetup/adSnapshotSubGroupMapping.html',
        controller: 'adsnapshotSubGroupMappingCtrl',
        url: '/snapshotSetup/subGroupMapping'
    });

});
