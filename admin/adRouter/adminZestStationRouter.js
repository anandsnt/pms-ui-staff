angular.module('adminZestStationRouter', []).config(function($stateProvider) {
    $stateProvider.state('admin.zestStationLanguageSelection', {
        url: '/admin/zest_station_lang_selection',
        templateUrl: '/assets/partials/zestStation/adZestStationLanguageConfig.html',
        controller: 'adZestStationLanguageConfigCtrl'
    });

    $stateProvider.state('admin.zestStationConfig', {
        templateUrl: '/assets/partials/zestStation/adZestStationCfg.html',
        controller: 'ADZestStationCtrl',
        url: '/zestStationConfig',
        resolve: {
            configurableImagesData: function(ADZestStationSrv) {
                return ADZestStationSrv.getImages();
            }
        }
    });
    $stateProvider.state('admin.ZestStationCheckin', {
        templateUrl: '/assets/partials/zestStation/adZestStationCheckin.html',
        controller: 'ADZestStationCheckInCtrl',
        url: '/zestStationCheckin'
    });
    $stateProvider.state('admin.ZestStationCheckout', {
        templateUrl: '/assets/partials/zestStation/adZestStationCheckout.html',
        controller: 'ADZestStationCheckOutCtrl',
        url: '/zestStationCheckout'
    });
    $stateProvider.state('admin.ZestStationPickUpKeys', {
        templateUrl: '/assets/partials/zestStation/adZestStationPickUpKeys.html',
        controller: 'ADZestStationPickUpKeysCtrl',
        url: '/zestStationPickUpKeys'
    });

    $stateProvider.state('admin.ZestStationRoomUpsells', {
        templateUrl: '/assets/partials/zestStation/adZestStationRoomUpsell.html',
        controller: 'ADZestStationRoomUpsellCtrl',
        url: '/zestStationRoomUpsell',
        resolve: {
            roomUpsellData: function(ADZestStationSrv) {
                return ADZestStationSrv.fetch();
            }
        }
    });
    
    $stateProvider.state('admin.stationGetMobilePhoneKeyEmail', {
        templateUrl: '/assets/partials/zestStation/adZestStationMobilePhoneKeyEmailSetup.html',
        controller: 'ADZestStationMobilePhoneKeyEmailSetupCtrl',
        url: '/zestStationMobilePhoneKeyEmailSetup'
    });
});
