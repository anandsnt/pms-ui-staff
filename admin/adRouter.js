admin.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider) {
        $translateProvider.useStaticFilesLoader({
          prefix: '/assets/adLocales/',
          suffix: '.json'
        });
        $translateProvider.fallbackLanguage('EN');
        // dashboard state
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('top', {
            url: '/admin/',
            controller: 'adTopCtrl'
        });

        $stateProvider.state('snt', {
            url: '/admin/snt',
            controller: 'adTopCtrl'
        });

        $stateProvider.state('admin', {
            abstract: true,
            url: '/',
            templateUrl: '/assets/partials/adApp.html',
            controller: 'ADAppCtrl',
            resolve: {
                adminMenuData: function(ADAppSrv) {
                    return ADAppSrv.fetch();
                },
                businessDate: function(ADAppSrv) {
                    return ADAppSrv.fetchHotelBusinessDate();
                },
                adminDashboardConfigData: function(ADAppSrv) {
                    return ADAppSrv.fetchDashboardConfig();
                }
            }
        });
    }
]);
