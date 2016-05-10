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
				zestStationSettings: function(zsGeneralSrv) {
					return zsGeneralSrv.fetchSettings();
				},

				/**
				** $translateProvider will be only available inside config
				** If someone has better solution to set language, please inform
				** The resolve is expecting some promise, 
				** so before resolving promise we will set the translation data.
				** There may be cleaner way to set to translate provider in a cleaner way.
				** Due to lack of time, i am leaving this as below.
				* */
				fetchFrenchTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/fr.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('fr', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
			    //fetch language files in the starting itself
				//so as to speeden the process laterwards
			    fetchEnglishTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/en.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('en', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
			    fetchFrenchTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/fr.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('fr', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
				fetchGermanTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/de.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('de', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
			    fetchSpanishTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/es.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('es', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
			    fetchCastellanoTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/cl.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('cl', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
			    fetchItalianTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/it.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('it', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    },
			    fetchDutchTranslations: function($q, $http) {

			        // Set up a promise to return
			        var deferred = $q.defer();
			        var url =  '/api/locales/nl.json';
			        $http.get(url).success(function(response) {
			      		$translateProvider.translations('nl', response.data);
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
					return deferred.promise;
			    }
				
			}
		});

		$stateProvider.state('zest_station.home', {
			url: '/home',
			templateUrl: '/assets/partials_v2/zsHomePage.html',
			controller: 'zsHomeCtrl',
			resolve: {
				waitforParentDependencies: 
				function(cssMappings,$q,zestStationSettings,fetchEnglishTranslations,fetchFrenchTranslations,fetchGermanTranslations,fetchSpanishTranslations,fetchCastellanoTranslations,fetchItalianTranslations,fetchDutchTranslations) {
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