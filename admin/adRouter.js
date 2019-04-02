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
        $urlRouterProvider.otherwise('/admin/h/');

        $stateProvider.state('top', {
            url: '/admin/h/:uuid?state&params',
            controller: 'adTopCtrl',
            resolve: {
                adminDashboardConfigData: ['ADAppSrv', '$stateParams', function(ADAppSrv, $stateParams) {
                    return ADAppSrv.fetchDashboardConfig($stateParams.uuid);
                }]
            }
        });

        $stateProvider.state('snt', {
            url: '/admin/snt',
            controller: 'adTopCtrl',
            resolve: {
                adminDashboardConfigData: ['ADAppSrv', function(ADAppSrv) {
                    return ADAppSrv.fetchDashboardConfig();
                }]
            }
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
                hotelDetails: function(ADHotelDetailsSrv, $rootScope) {
                    if ( !$rootScope.isSntAdmin) {
                        return ADHotelDetailsSrv.fetchHotelDetails();
                    }
                    return {};
                },
                userInfo: function(ADAppSrv, $rootScope) {
                    if ( !$rootScope.isSntAdmin ) {
                        return ADAppSrv.fetchUserInfo();
                    }
                    return {};
                },
                permissions: function(adPermissionSrv, $rootScope) {
                    if ( !$rootScope.isSntAdmin ) {
                        return adPermissionSrv.fetchRoverPermissions();
                    }
                    return {};
                }
            }
        });
    }
]);
