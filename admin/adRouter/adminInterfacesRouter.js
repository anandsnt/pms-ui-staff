angular.module('adminInterfacesRouter', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {

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
