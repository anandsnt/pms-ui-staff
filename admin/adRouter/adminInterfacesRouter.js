angular.module('adminInterfacesRouter', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {

  $stateProvider.state('admin.exactOnlineSetup', {
    templateUrl: '/assets/partials/ExactOnline/setup/adExactOnlineSetup.html',
    controller: 'adExactOnlineSetupCtrl',
    url : '/exactonline/setup',
    resolve: {
      exactOnlineSetupValues: ['adExactOnlineSetupSrv', function(adExactOnlineSetupSrv) {
        return adExactOnlineSetupSrv.fetchExactOnLineConfiguration();
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
    url : '/zestWebGlobalSettings'
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

  $stateProvider.state('admin.goMomentIvySetup', {
    templateUrl: '/assets/partials/interfaces/GoMomentIvy/goMomentIvySetup.html',
    controller: 'adGoMomentIvySetupCtrl',
    url : '/gomomentivy/setup',
    resolve: {
      goMomentIvySetupValues: ['adGoMomentIvySetupSrv', function(adGoMomentIvySetupSrv) {
        return adGoMomentIvySetupSrv.fetchGoMomentIvyConfiguration();
      }]
    }
  });


  $stateProvider.state('admin.checkmate', {
    templateUrl: '/assets/partials/interfaces/Checkmate/checkmateSetup.html',
    controller: 'adCheckmateSetupCtrl',
    url : '/checkmate/setup',
    resolve: {
      checkmateSetupValues: ['adCheckmateSetupSrv', function(adCheckmateSetupSrv) {
        return adCheckmateSetupSrv.fetchCheckmateConfiguration();
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

  $stateProvider.state('admin.windsurferCRSSetup', {
    templateUrl: '/assets/partials/WindsurferCRS/setup/adWindsurferCRSSetup.html',
    controller: 'adWindsurferCRSSetupCtrl',
    url : '/windsurfercrs/setup',
    resolve: {
      windsurferCRSSetupValues: ['adWindsurferCRSSetupSrv', function(adWindsurferCRSSetupSrv) {
        return adWindsurferCRSSetupSrv.fetchWindsurferCRSConfiguration();
      }]
    }
  });

  $stateProvider.state('admin.travelClickSetup', {
    templateUrl: '/assets/partials/interfaces/TravelClick/adTravelClickCRSSetup.html',
    controller: 'adTravelClickCRSSetupCtrl',
    url : '/travelclick/setup',
    resolve: {
      CRSConfig: ['adTravelClickCRSSetupSrv', function(adTravelClickCRSSetupSrv) {
        return adTravelClickCRSSetupSrv.fetchCRSConfiguration();
      }]
    }
  });

  $stateProvider.state('admin.ideasSetup',{
    templateUrl: '/assets/partials/interfaces/ideas/adIdeasSetup.html',
    controller: 'adIdeasSetupCtrl',
    url : '/ideas/setup',
    resolve: {
      ideaSetup : ['adIdeasSetupSrv', function(adIdeasSetupSrv){
        return adIdeasSetupSrv.getIdeaSetup();
      }]
    }
  });

  $stateProvider.state('admin.ifcComtrolSetup', {
    templateUrl: '/assets/partials/IFCComtrol/adIFCComtrolSetup.html',
    controller: 'adIFCComtrolSetupCtrl',
    url : '/ifc_comtrol/setup',
    resolve: {
      ifcComtrolSetupValues: ['adIFCComtrolSetupSrv', function(adIFCComtrolSetupSrv) {
        return adIFCComtrolSetupSrv.fetchIFCComtrolConfiguration();
      }]
    }
  });

  $stateProvider.state('admin.gustoPosSetup', {
      templateUrl: '/assets/partials/GustoPOS/adGustoPOSSetup.html',
      controller: 'adGustoPOSSetupCtrl',
      url : '/guestopos/setup',
      resolve: {
          gustoSetupValues: ['adGustoPOSSetupSrv', function(adGustoPOSSetupSrv) {
              return adGustoPOSSetupSrv.fetchGustoPOSConfiguration();
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

  $stateProvider.state('admin.m3BackOfficeExport', {
    templateUrl: '/assets/partials/interfaces/M3BackOffice/ADM3Configuration.html',
    controller: 'ADM3BackOfficeCtrl',
    url : '/backoffice/m3/setup',
    resolve: {
      m3AccountingSetupValues: ['ADM3SetupSrv', function(ADM3SetupSrv) {
        return ADM3SetupSrv.getConfig();
      }]
    }
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

  $stateProvider.state('admin.doorlockInterface', {
    templateUrl: '/assets/partials/doorLockInterface/adDoorLockInterface.html',
    controller: 'ADDoorLockInterfaceCtrl',
    url : '/doorlockinterface'
  });

  $stateProvider.state('admin.sitemindersSetup', {
    templateUrl: '/assets/partials/SiteminderSetup/adSiteminderSetup.html',
    controller: 'adExternalInterfaceCtrl',
    //interface_id: 2,
    interface_id: 'SITEMINDER', //Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    simple_name: 'Siteminder', //Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    url : '/siteminderSetup'
  });

  $stateProvider.state('admin.givexSetup', {
    templateUrl: '/assets/partials/Givex/adGivexSetup.html',
    controller: 'adExternalInterfaceCtrl',
    //interface_id: 4,
    interface_id: 'GIVEX',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    simple_name: 'Givex',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    url : '/siteminderSetup'
  });

  $stateProvider.state('admin.synxisSetup', {
    templateUrl: '/assets/partials/SynxisSetup/adSynxisSetup.html',
    controller: 'adExternalInterfaceCtrl',
    //interface_id: 3,
    interface_id: 'SYNXIS',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    simple_name: 'Synxis',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    url : '/synxisSetup'
  });

  $stateProvider.state('admin.zDirectSetup', {
    templateUrl: '/assets/partials/ZDirectSetup/adZDirectSetup.html',
    controller: 'adExternalInterfaceCtrl',
    //interface_id: 4,
    interface_id: 'ZDIRECT',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    simple_name: 'ZDirect',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    url : '/zDirectSetup'
  });

  $stateProvider.state('admin.travelTripperSetup', {
    templateUrl: '/assets/partials/travelTripperSetup/adtravelTripperSetup.html',
    controller: 'adExternalInterfaceCtrl',
    //interface_id: 4,
    interface_id: 'TRAVELTRIPPER',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    simple_name: 'TravelTripper',//Shahul: I dont what is this exactly, can we do it by passing as statparam or other kind of approaches?
    url : '/travelTripperSetup'
  });

});
