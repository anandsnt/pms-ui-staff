sntZestStation.config(['$stateProvider', '$urlRouterProvider', '$translateProvider',
	function($stateProvider, $urlRouterProvider, $translateProvider) {


		$urlRouterProvider.otherwise('/zest_station/home');

		$stateProvider.state('zest_station', {
			abstract: true,
			url: '/zest_station',
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
						defaultLanguageConfig = zsGeneralSrv.languageValueMappingsForUI[defaultLanguage.name],
						defaultLangShortCode = defaultLanguageConfig.code;

					return zsGeneralSrv.fetchTranslations(sortedLanguages)
						.then(function(translationFiles) {
							for(langShortCode in translationFiles) {
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
				}
			}
		});

		$stateProvider.state('zest_station.home', {
			url: '/home',
			templateUrl: '/assets/partials_v2/zsHomePage.html',
			controller: 'zsHomeCtrl'
		}).state('zest_station.speakToStaff', {
            url: '/speakToStaff/:message',
            templateUrl: '/assets/partials_v2/zsSpeakToStaff.html',
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