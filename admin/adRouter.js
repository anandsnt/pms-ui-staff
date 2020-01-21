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

        $stateProvider.state('auth', {
            url: '/admin/snt?token',
            onEnter: ['$state', '$stateParams', '$window',  function ($state, $stateParams, $window) {
                if ($stateParams.token) {
                    $window.localStorage.setItem('jwt', $stateParams.token);
                }
                $state.go('snt', {});
            }]
        });

        $stateProvider.state('snt', {
            url: '/admin/snt',
            controller: 'adTopCtrl',
            resolve: {
                adminDashboardConfigData: ['ADAppSrv', function (ADAppSrv) {
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
                },
                features: function (Toggles) {
                    return Toggles.initialize();
                }
            }
        });
    }
]);
