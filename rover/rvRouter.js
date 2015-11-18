sntRover.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider) {
        var currentTime = new Date();
        $translateProvider.useStaticFilesLoader({
          prefix: '/assets/rvLocales/',
          suffix: '.json?time='+currentTime
        });
        $translateProvider.fallbackLanguage('EN');

        // default state
        $urlRouterProvider.otherwise('/');

		/*
		 * state added to show single url throughout the app
		 */
		$stateProvider.state('top', {
            url: '/',
            controller: 'topController'
    	});

        $stateProvider.state('rover', {
            abstract: true,
            url: '/staff',
            templateUrl: '/assets/partials/rvRover.html',
            controller: 'roverController',
            resolve: {
                hotelDetails: function(RVHotelDetailsSrv) {
                    return RVHotelDetailsSrv.fetchHotelDetails();
                },
                userInfoDetails: function(RVDashboardSrv) {
                        return RVDashboardSrv.fetchUserInfo();
                },
                permissions: function (rvPermissionSrv) {
                    return rvPermissionSrv.fetchRoverPermissions();
                }
            }


        });

    }
]);