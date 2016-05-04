sntZestStation.config(['$stateProvider', '$urlRouterProvider', '$translateProvider',
	function($stateProvider, $urlRouterProvider, $translateProvider) {


		$urlRouterProvider.otherwise('/zest_station/home');

		$stateProvider.state('zest_station', {
			abstract: true,
			url: '/zest_station',
			templateUrl: '/assets/partials_v2/zsRoot.html',
			controller: 'zsRootCtrl',
			resolve: {
				hotelTimeData: function(zsGeneralSrv){
					return zsGeneralSrv.fetchHotelTime();
				},
				cssMappings: function(zsCSSMappings) {
					return zsCSSMappings.fetchCSSMappingList();
				},
				zestStationSettings: function(zsTabletSrv) {
					return zsTabletSrv.fetchSettings();
				},
				//fetch language files in the starting itself
				//so as to speeden the process laterwards
				fetchTranslations: function(zsHotelDetailsSrv) {

					zsHotelDetailsSrv.fetchTranslationData('en').then(function(translations) {
						$translateProvider.translations('en', translations);
					});
					zsHotelDetailsSrv.fetchTranslationData('fr').then(function(translations) {
						$translateProvider.translations('fr', translations);
					});
					zsHotelDetailsSrv.fetchTranslationData('es').then(function(translations) {
						$translateProvider.translations('es', translations);
					});
					zsHotelDetailsSrv.fetchTranslationData('de').then(function(translations) {
						$translateProvider.translations('de', translations);
					});
					zsHotelDetailsSrv.fetchTranslationData('cl').then(function(translations) {
						$translateProvider.translations('cl', translations);
					});
					zsHotelDetailsSrv.fetchTranslationData('it').then(function(translations) {
						$translateProvider.translations('it', translations);
					});
					zsHotelDetailsSrv.fetchTranslationData('nl').then(function(translations) {
						$translateProvider.translations('nl', translations);
					});
				}
			}
		});

		$stateProvider.state('zest_station.home', {
			url: '/home',
			templateUrl: '/assets/partials_v2/zsHomePage.html',
			controller: 'zsHomeCtrl',
			resolve: {
				waitforParentDependencies: function(cssMappings, zestStationSettings, $q) {
					var deferred = $q.defer();
					setTimeout(function() {
						deferred.resolve();
					}, 10);
					return deferred.promise;
				}
			}
		}).state('zest_station.speakToStaff', {
            url         : '/speakToStaff/:message',
            templateUrl : '/assets/partials_v2/zsSpeakToStaff.html',
            controller: 'zsSpeakToStaffCtrl'
        });

        $stateProvider.state('zest_station.admin', {
             url: '/find_reservation', 
             controller: 'zsAdminCtrl',
             templateUrl: '/assets/partials_v2/zsAdminSettings.html',
        }).state('zest_station.outOfService', {
             url: '/outOfService', 
             controller: 'zsOutOfServiceCtrl',
             templateUrl: '/assets/partials_v2/zsOutOfService.html',
        });

	}
]);