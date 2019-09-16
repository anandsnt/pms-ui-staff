angular.module('adminInterfacesRouter', []).config(function($stateProvider) {

    $stateProvider.state('admin.accountview', {
        templateUrl: '/assets/partials/interfaces/accountview/adAccountview.html',
        controller: 'adAccountviewCtrl',
        url: '/accountview',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('accountview');
            }]
        }
    });

    $stateProvider.state('admin.comtrol', {
        templateUrl: '/assets/partials/interfaces/comtrol/adComtrol.html',
        controller: 'adComtrolCtrl',
        url: '/comtrol',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('comtrol');
            }]
        }
    });

    $stateProvider.state('admin.comtrolKey', {
        templateUrl: '/assets/partials/interfaces/comtrol/adComtrol.html',
        controller: 'adComtrolCtrl',
        url: '/comtrol_key',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('comtrol');
            }]
        }
    });

    $stateProvider.state('admin.exactOnlineSetup', {
        templateUrl: '/assets/partials/interfaces/exactonline/adExactonline.html',
        controller: 'adExactOnlineSetupCtrl',
        url: '/exactonline/setup',
        resolve: {
            endPoints: ['adExactOnlineSetupSrv', function(adExactOnlineSetupSrv) {
                return adExactOnlineSetupSrv.fetchEndpointsList();
            }],
            config: ['adExactOnlineSetupSrv', function (adExactOnlineSetupSrv) {
                return adExactOnlineSetupSrv.fetchExactOnLineConfiguration();
            }]
        }
    });

    $stateProvider.state('admin.twinfieldSetup', {
        templateUrl: '/assets/partials/interfaces/twinfield/adTwinfieldSetup.html',
        controller: 'adTwinfieldSetupCtrl',
        url: '/twinfield/setup',
        resolve: {
            twinfieldSetupValues: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('twinfield');
            }],
            paymentChargeCodes: ['adTwinfieldSetupSrv', function(adTwinfieldSetupSrv) {
                return adTwinfieldSetupSrv.getPaymentChargeCodes();
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

    $stateProvider.state('admin.booker25Setup', {
        templateUrl: '/assets/partials/booker25/booker25Setup.html',
        controller: 'adBooker25SetupCtrl',
        url: '/booker25/setup',
        resolve: {
            booker25SetupValues: ['adBooker25SetupSrv', function(adBooker25Srv) {
                return adBooker25Srv.fetchBooker25Configuration();
            }]
        }
    });

    $stateProvider.state('admin.goMomentIvySetup', {
        templateUrl: '/assets/partials/interfaces/gomomentivy/adGoMomentIvy.html',
        controller: 'adGoMomentIvySetupCtrl',
        url: '/gomomentivy/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('gomomentivy');
            }]
        }
    });

    $stateProvider.state('admin.checkmate', {
        templateUrl: '/assets/partials/interfaces/checkmate/adCheckmateSetup.html',
        controller: 'adCheckmateSetupCtrl',
        url: '/checkmate/setup',
        resolve: {
            config: ['adInterfacesSrv', function (adInterfacesSrv) {
                return adInterfacesSrv.getSettings('checkmate');
            }]
        }
    });

    $stateProvider.state('admin.quicktext', {
        templateUrl: '/assets/partials/interfaces/QuickText/adQuickTextSetup.html',
        controller: 'adQuickTextSetupCtrl',
        url: '/quicktext/setup',
        resolve: {
            quicktextSetupValues: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('quicktext');
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
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'windsurfer'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('windsurfer');
            }]
        }
    });

    $stateProvider.state('admin.travelClickSetup', {
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'travelclick'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('travelclick');
            }]
        }
    });

    $stateProvider.state('admin.cubilisSetup', {
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'cubilis'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('cubilis');
            }]
        }
    });

    $stateProvider.state('admin.derbysoftSetup', {
        templateUrl: '/assets/partials/interfaces/DerbySoft/adDerbySoftSetup.html',
        controller: 'ADDerbySoftSetupCtrl',
        url: '/derbysoft/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('derbysoft');
            }],
            mappingTypes: [
                'adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchMappingTypes('derbysoft');
                }]
        }
    });

    $stateProvider.state('admin.verticalBookingSetup', {
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'verticalbooking'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('verticalbooking');
            }]
        }
    });

    $stateProvider.state('admin.ideasSetup', {
        templateUrl: '/assets/partials/interfaces/ideas/adIdeas.html',
        controller: 'adIdeasSetupCtrl',
        url: '/ideas/setup',
        resolve: {
            config: ['adInterfacesSrv', function (adInterfacesSrv) {
                return adInterfacesSrv.getSettings('ideas');
            }],
            chargeGroups: ['ADChargeGroupsSrv', function (ADChargeGroupsSrv) {
                return ADChargeGroupsSrv.fetch();
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
        templateUrl: '/assets/partials/interfaces/delphi/adDelphi.html',
        controller: 'adDelphiCtrl',
        url: '/delphi',
        resolve: {
            config: ['adInterfacesSrv', function (adInterfacesSrv) {
                return adInterfacesSrv.getSettings('delphi');
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

    $stateProvider.state('admin.cendynSetup', {
        templateUrl: '/assets/partials/interfaces/Cendyn/adCendynSetup.html',
        controller: 'adCendynSetupCtrl',
        url: '/cendyn/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('cendyn');
            }]
        }
    });

    $stateProvider.state('admin.digitalalchemySetup', {
        templateUrl: '/assets/partials/interfaces/digitalalchemy/adDigitalalchemy.html',
        controller: 'adDigitalalchemySetupCtrl',
        url: '/digitalalchemy/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('digitalalchemy');
            }]
        }
    });

    $stateProvider.state('admin.salesforceSetup', {
        templateUrl: '/assets/partials/interfaces/salesforce/adSalesforce.html',
        controller: 'adSalesforceSetupCtrl',
        url: '/salesforce/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('salesforce');
            }]
        }
    });

    $stateProvider.state('admin.vectronSetup', {
        templateUrl: '/assets/partials/interfaces/Vectron/adVectronSetup.html',
        controller: 'ADVectronSetupCtrl',
        url: '/vectron',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('vectron');
            }]
        }
    });

    $stateProvider.state('admin.ifc_revenue_centers', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolRevenueCenter.html',
        controller: 'adComtrolRevenueCenterCtrl',
        url: '/ifc_comtrol/revenueCenter'
    });

    $stateProvider.state('admin.ifc_charge_codes', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolChargeCodes.html',
        controller: 'adComtrolChargeCodeMappingCtrl',
        url: '/ifc_comtrol/chargeCodeMappings'
    });

    $stateProvider.state('admin.ifc_generic_mappings', {
        templateUrl: '/assets/partials/interfaces/Comtrol/adComtrolGenericMappings.html',
        controller: 'adComtrolGenericMappingCtrl',
        url: '/ifc_comtrol/genericMappings'
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
            britePabXSetupValues: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('brite');
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
        templateUrl: '/assets/partials/interfaces/m3as/adM3as.html',
        controller: 'ADM3asCtrl',
        url: '/m3as/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('m3as');
            }]
        }
    });

    $stateProvider.state('admin.mapping', {
        templateUrl: '/assets/partials/mapping/adExternalMapping.html',
        controller: 'ADMappingCtrl',
        url: '/mapping',
        params: {
            hotelId: undefined
        }
    });

    // hotel_id will be removed from the following stateProvider URL's (external-mappings, add-external-mapping, edit-external-mapping)
    $stateProvider.state('admin.external-mappings', {
        templateUrl: '/assets/partials/interfaces/ExternalMappings/adExternalMappingsList.html',
        controller: 'ADExternalMappingsListCtrl',
        url: '/mappings/show',
        params: {
            interface_id: undefined,
            interface_name: undefined
        }
    });

    $stateProvider.state('admin.add-external-mapping', {
        templateUrl: '/assets/partials/interfaces/ExternalMappings/adExternalMappingsAdd.html',
        url: '/mappings/add',
        controller: 'ADExternalMappingsAddCtrl',
        params: {
            mapping_type: undefined,
            interface_id: undefined,
            interface_name: undefined
        },
        resolve: {
            mappingTypes: ['ADInterfaceMappingSrv', '$stateParams',
                function(ADInterfaceMappingSrv, $stateParams) {
                    return ADInterfaceMappingSrv.fetchInterfaceMappingTypes({
                        interface_type_id: $stateParams.interface_id
                    });
                }
            ]
        }
    });

    $stateProvider.state('admin.edit-external-mapping', {
        templateUrl: '/assets/partials/interfaces/ExternalMappings/adExternalMappingsEdit.html',
        url: '/mappings/add',
        params: {
            mapping_type: undefined,
            interface_id: undefined,
            interface_name: undefined,
            mapping_id: undefined
        },
        controller: 'ADExternalMappingsEditCtrl',
        resolve: {
            mappingTypes: ['ADInterfaceMappingSrv', '$stateParams',
                function(ADInterfaceMappingSrv, $stateParams) {
                    return ADInterfaceMappingSrv.fetchInterfaceMappingTypes({
                        interface_type_id: $stateParams.interface_id
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
        url: '/terminaldetails',
        params: {
            itemid: undefined
        }
    });

    $stateProvider.state('admin.doorlockInterface', {
      templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
      controller: 'ADInterfaceSubMenuCtrl',
      url: '/doorlockinterface'
    });

    $stateProvider.state('admin.directInterface', {
        templateUrl: '/assets/partials/doorLockInterface/adDoorLockInterface.html',
        controller: 'ADDoorLockInterfaceCtrl',
        url: '/directinterface'
    });

    $stateProvider.state('admin.mobileKey', {
      templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
      controller: 'ADInterfaceSubMenuCtrl',
      url: '/directinterface'
    });

    $stateProvider.state('admin.keypr', {
        templateUrl: '/assets/partials/interfaces/keypr/adKeypr.html',
        controller: 'adKeyprSetupCtrl',
        url: '/keypr/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('keypr');
            }]
        }
    });

    $stateProvider.state('admin.sitemindersSetup', {
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'siteminder'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('siteminder');
            }]
        }
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
        templateUrl: '/assets/partials/interfaces/CRS/adCRSCommonSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'synxis'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('synxis');
            }]
        }
    });

    $stateProvider.state('admin.axbase3000', {
        templateUrl: '/assets/partials/interfaces/axbase3000/adAxbase.html',
        controller: 'adAXbaseCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'axbase3000'
        },
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('axbase3000');
            }]
        }
    });

    $stateProvider.state('admin.rainmakerSetup', {
        templateUrl: '/assets/partials/interfaces/Rainmaker/adRainmakerSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'rainmaker'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('rainmaker');
            }]
        }
    });

    $stateProvider.state('admin.juyoSetup', {
        templateUrl: '/assets/partials/interfaces/Juyo/adJuyoSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'juyo'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('juyo');
            }]
        }
    });

    $stateProvider.state('admin.vismaSetup', {
        templateUrl: '/assets/partials/interfaces/visma/adVisma.html',
        controller: 'adVismaCtrl',
        url: '/visma/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('visma');
            }]
        }
    });

    $stateProvider.state('admin.infrasecSetup', {
        templateUrl: '/assets/partials/interfaces/Infrasec/adInfrasecSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'infrasec'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('infrasec');
            }]
        }
    });

    $stateProvider.state('admin.easiSetup', {
        templateUrl: '/assets/partials/interfaces/easi/adEasi.html',
        controller: 'adEasiCtrl',
        url: '/easi/setup/',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('easi');
                // return adInterfacesCommonConfigSrv.fetchConfiguration('easi');
            }],
            chargeGroups: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                // use mappings/additional_setting?
                return adInterfacesCommonConfigSrv.fetchChargeGroups();
            }],
            taxChargeCodes: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                // use mappings/additional_setting?
                return adInterfacesCommonConfigSrv.fetchTaxChargeCodes();
            }]
        }
    });

    $stateProvider.state('admin.pmiSetup', {
        templateUrl: '/assets/partials/interfaces/pmi/adPMI.html',
        controller: 'adPmiCtrl',
        url: '/pmi/setup/',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('pmi');
            }]
        }
    });

    $stateProvider.state('admin.avidaSetup', {
        templateUrl: '/assets/partials/interfaces/avida/adAvida.html',
        controller: 'adAvidaCtrl',
        url: '/avida/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('avida');
            }]
        }
    });

    $stateProvider.state('admin.baswareSetup', {
        templateUrl: '/assets/partials/interfaces/basware/adBasware.html',
        controller: 'adBaswareCtrl',
        url: '/basware/setup',
        resolve: {
            config: ['adInterfacesSrv', function(adInterfacesSrv) {
                return adInterfacesSrv.getSettings('basware');
            }]
        }
    });

    $stateProvider.state('admin.hogiaSetup', {
        templateUrl: '/assets/partials/interfaces/hogia/adHogia.html',
        controller: 'adHogiaCtrl',
        url: '/hogia',
        resolve: {
            config: [
                'adInterfacesSrv', function(adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('hogia');
                }],
            mappingTypes: [
                'adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchMappingTypes('hogia');
                }]
        }
    });

    $stateProvider.state('admin.safeaccounting', {
        templateUrl: '/assets/partials/interfaces/safeaccounting/configuration.html',
        controller: 'adSafeaccountingCtrl',
        url: '/safeaccounting',
        resolve: {
            config: [
                'adInterfacesSrv', function(adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('safeaccounting');
                }]
        }
    });

    $stateProvider.state('admin.sieSetup', {
       templateUrl: '/assets/partials/interfaces/sie/adSie.html',
       controller: 'adSieCtrl',
       url: '/sie',
       resolve: {
           config: [
               'adInterfacesSrv', function(adInterfacesSrv) {
                   return adInterfacesSrv.getSettings('sie');
               }],
           mappingTypes: [
               'adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                   return adInterfacesCommonConfigSrv.fetchMappingTypes('sie');
               }]
       }
    });

    $stateProvider.state('admin.sunaccountingSetup', {
        templateUrl: '/assets/partials/interfaces/SunAccounting/adSunAccountingConfiguration.html',
        controller: 'adInterfaceConfigurationCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'sunaccounting'
        },
        resolve: {
            config: [
                'adInterfacesSrv', function (adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('sunaccounting');
                }],
            mappingTypes: [
                'adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchMappingTypes('sunaccounting');
                }]
        }
    });

    $stateProvider.state('admin.turkishinvoiceSetup', {
        templateUrl: '/assets/partials/interfaces/turkishinvoice/adTurkishinvoice.html',
        controller: 'adTurkishinvoiceCtrl',
        url: '/turkishinvoice',
        resolve: {
            config: [
                'adInterfacesSrv', function (adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('turkishinvoice');
                }]
        }
    });

    $stateProvider.state('admin.revControlSetup', {
        templateUrl: '/assets/partials/interfaces/Revcontrol/adRevcontrolSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/',
        params: {
            id: 'revcontrol'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('revcontrol');
            }]
        }
    });

    $stateProvider.state('admin.siteminderMessageExchangeSetup', {
        templateUrl: '/assets/partials/interfaces/Sitemindermx/adSitemindermxSetup.html',
        controller: 'adCRSCommonCtrl',
        url: '/interfaces/setup',
        params: {
            id: 'sitemindermx'
        },
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('sitemindermx');
            }]
        }
    });

    $stateProvider.state('admin.zDirectSetup', {
        templateUrl: '/assets/partials/ZDirectSetup/adZDirectSetup.html',
        controller: 'adZDirectSetupCtrl',
        url: '/zdirect/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('zdirect');
            }]
        }
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

    $stateProvider.state('admin.snapshotSubGroupMapping', {
        templateUrl: '/assets/partials/snapshotSetup/adSnapshotSubGroupMapping.html',
        controller: 'adsnapshotSubGroupMappingCtrl',
        url: '/snapshotSetup/subGroupMapping'
    });

    $stateProvider.state('admin.monitorScreen', {
        templateUrl: '/assets/partials/interfaces/Monitor/adInterfaceMonitor.html',
        controller: 'ADInterfaceMonitorCtrl',
        url: '/monitorScreen',
        resolve: {
            interfaces: ['ADInterfaceMonitorSrv', function (ADInterfaceMonitorSrv) {
                return ADInterfaceMonitorSrv.fetch();
            }]
        }
    });

    $stateProvider.state('admin.openkey', {
        templateUrl: '/assets/partials/interfaces/MobileKeys/Openkey/adOpenkeySetup.html',
        controller: 'adOpenkeySetupCtrl',
        url: '/openkey/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('openkey');
            }]
        }
    });

    $stateProvider.state('admin.concept4000', {
        templateUrl: '/assets/partials/interfaces/MobileKeys/Concept4000/adConcept4000Setup.html',
        controller: 'adConcept4000SetupCtrl',
        url: '/concept4000/setup',
        resolve: {
            config: ['adInterfacesCommonConfigSrv', function (adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchConfiguration('concept4000');
            }]
        }
    });

    $stateProvider.state('admin.monsciergeSetup', {
        templateUrl: '/assets/partials/monsciergeSetup/adMonsciergeSetup.html',
        controller: 'adMonsciergeSetupCtrl',
        url: '/monsciergeSetup'
    });

    $stateProvider.state('admin.commissionsSetup', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/commissionsSetup'
    });

    $stateProvider.state('admin.tacsSetup', {
        templateUrl: '/assets/partials/interfaces/commissions/adTacsSetup.html',
        controller: 'ADTacsSetupCtrl',
        url: '/tacsSetup',
        resolve: {
            config: ['adCommissionsConfigSrv', function(adCommissionsConfigSrv) {
                return adCommissionsConfigSrv.fetchTacsConfiguration();
            }],
            countryList: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchCountryList();
            }],
            currencyList: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchCurrencyList();
            }]
        }
    });

    $stateProvider.state('admin.onyxSetup', {
        templateUrl: '/assets/partials/interfaces/commissions/adOnyxSetup.html',
        controller: 'ADOnyxSetupCtrl',
        url: '/onyxSetup',
        resolve: {
            config: ['adCommissionsConfigSrv', function(adCommissionsConfigSrv) {
                return adCommissionsConfigSrv.fetchOnyxConfiguration();
            }],
            countryList: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchCountryList();
            }],
            currencyList: ['adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchCurrencyList();
            }]
        }
    });

    $stateProvider.state('admin.datevSetup', {
        templateUrl: '/assets/partials/interfaces/datev/adDatev.html',
        controller: 'adDatevCtrl',
        url: '/datev',
        resolve: {
            config: [
                'adInterfacesSrv', function(adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('datev');
                }]
        }
    });

    $stateProvider.state('admin.igelSetup', {
        templateUrl: '/assets/partials/interfaces/igel/adIgel.html',
        controller: 'adIgelCtrl',
        url: '/igel',
        resolve: {
            config: [
                'adInterfacesSrv', function(adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('igel');
                }],
            mappingTypes: [
                'adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchMappingTypes('igel');
                }],
            paymentChargeCodes: [
                'adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                return adInterfacesCommonConfigSrv.fetchPaymentChargeCodes('igel');
                }],
        }
    });

    $stateProvider.state('admin.fiskaltrustSetup', {
        templateUrl: '/assets/partials/interfaces/fiskaltrust/adFiskaltrust.html',
        controller: 'adFiskaltrustCtrl',
        url: '/fiskaltrust',
        resolve: {
            config: [
                'adInterfacesSrv', function(adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('fiskaltrust');
                }],
            mappingTypes: [
                'adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchMappingTypes('fiskaltrust');
                }],
            paymentChargeCodes: [
                'adInterfacesCommonConfigSrv', function(adInterfacesCommonConfigSrv) {
                    return adInterfacesCommonConfigSrv.fetchPaymentChargeCodes('fiskaltrust');
                }]
        }
    });

    $stateProvider.state('admin.global_feature_toggles', {
        templateUrl: '/assets/partials/interfaces/GlobalFeatureToggles/adGlobalFeatureToggles.html',
        controller: 'adGlobalFeatureTogglesCtrl',
        url: '/admin/global_feature_toggles'
    });

    $stateProvider.state('admin.hotel_feature_toggles', {
        templateUrl: '/assets/partials/interfaces/HotelFeatureToggles/adHotelFeatureToggles.html',
        controller: 'adHotelFeatureTogglesCtrl',
        url: '/admin/hotel_feature_toggles'
    });

    $stateProvider.state('admin.hotel_feature_toggles_edit', {
        templateUrl: '/assets/partials/interfaces/HotelFeatureToggles/adEdit.html',
        controller: 'adHotelFeatureTogglesEditCtrl',
        url: '/admin/hotel_feature_toggles',
        params: {
            id: undefined
        },
        resolve: {
            settings: ['adFeaturesSrv', '$stateParams', function(adFeaturesSrv, $stateParams) {
                return adFeaturesSrv.fetch($stateParams.id);
            }]
        }
    });

    $stateProvider.state('admin.staahSetup', {
        templateUrl: '/assets/partials/interfaces/staah/adStaah.html',
        controller: 'adStaahController',
        url: '/staah',
        resolve: {
            config: [
                'adInterfacesSrv', function (adInterfacesSrv) {
                    return adInterfacesSrv.getSettings('staah');
                }]
        }
    });

});
