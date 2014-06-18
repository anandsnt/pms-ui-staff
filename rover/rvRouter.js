sntRover.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider) {
        
        $translateProvider.useStaticFilesLoader({
          prefix: '/assets/rvLocales/',
          suffix: '.json'
        });
        // dashboard state
        $urlRouterProvider.otherwise('/staff/dashboard');

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
                }
            }
        });
        
    }
]);