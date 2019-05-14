sntZestStation.config(['$stateProvider', '$urlRouterProvider', '$translateProvider',
	function($stateProvider, $urlRouterProvider, $translateProvider) {


		$urlRouterProvider.otherwise('/zest_station/h/');

        $stateProvider.state('top', {
            url: '/zest_station/h/:uuid?state',
            controller: 'zsTopCtrl'
        });

		$stateProvider.state('zest_station', {
			abstract: true,
			url: '/',
			templateUrl: '/assets/partials_v2/zsRoot.html',
			controller: 'zsRootCtrl',
			resolve: {
				zestStationSettings: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchSettings();
				},
				languages: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchLanguages();
				},
				languageTranslations: function(zsGeneralSrv, languages, $translate) {
					var languages = languages.languages.length ? languages.languages : [{'name': 'english', 'position': 1}];

					var sortedLanguages = _.sortBy(languages, 'position'),
						defaultLanguage = sortedLanguages[0],
						defaultLangShortCode = defaultLanguage.name;

					return zsGeneralSrv.fetchTranslations(sortedLanguages)
						.then(function(translationFiles) {
							zsGeneralSrv.$translateProvider = $translateProvider;
							zsGeneralSrv.refToLatestPulledTranslations = translationFiles;

							for (var langShortCode in translationFiles) {
								$translateProvider.translations(langShortCode, translationFiles[langShortCode]);
							}


							$translate.use(defaultLangShortCode);
						});
				},
				hotelTimeData: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchHotelTime();
				},
				cssMappings: function(zsCSSMappings) {
					return zsCSSMappings.fetchCSSMappingList();
				},
				hotelLanguages: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchHotelLanguageList();
				},
				hotelTranslations: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchHotelTranslations();
				},
				defaultTranslations: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchDefaultTranslations();
				},
				configurableImagesData: function(zsGeneralSrv) {
					return zsGeneralSrv.getImages();
				}
			}
		});

		$stateProvider.state('zest_station.home', {
			url: '/home',
			templateUrl: '/assets/partials_v2/zsHomePage.html',
			controller: 'zsHomeCtrl',
         	jumper: true,
	        section: 'General',
	        label: 'Home',
	        icon: 'home.png',
	        tags: []
		});

        $stateProvider.state('zest_station.speakToStaff', {
            url: '/speakToStaff',
            params: {
                message: ''
            },
            templateUrl: '/assets/partials_v2/zsSpeakToStaff.html',
            controller: 'zsSpeakToStaffCtrl',
         	jumper: true,
	        section: 'General',
	        label: 'Speak to Staff',
	        icon: 'speak_to_staff.png',
	        tags: ['talk']
        });

        $stateProvider.state('zest_station.admin', {
             url: '/find_reservation',
             controller: 'zsAdminCtrl',
             templateUrl: '/assets/partials_v2/zsAdminSettings.html'
        });

        $stateProvider.state('zest_station.outOfService', {
            url: '/outOfService',
            controller: 'zsOutOfServiceCtrl',
            templateUrl: '/assets/partials_v2/zsOutOfService.html',
         	jumper: true,
	        section: 'General',
	        label: 'Out of Service',
	        icon: 'out_of_service.png',
	        tags: ['sleepy']
        });

        $stateProvider.state('zest_station.manualKeyPickup', {
        	url: '/manualKeyPickUp',
            params: {
                reservation_id: '',
                room_no: '',
                first_name: '',
                guest_id: '',
                email: '',
                mode: ''
            },
            templateUrl: '/assets/partials_v2/zsManualKeyPickup.html',
            controller: 'zsManualKeyPickUpCtrl'
        });

        $stateProvider.state('zest_station.sntIDScan', {
        	url: '/sntIDScan',
            params: {
                params: ''
            },
            templateUrl: '/assets/partials_v2/idScan/zsIDScanMain.html',
            controller: 'zsSntIDScanCtrl'
        });

	}
]);
