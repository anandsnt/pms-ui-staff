angular.module('reportsModule', [])
    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

        $stateProvider.state('rover.reports', {
            url: '/reports',
            abstract: true,
            templateUrl: '/assets/partials/reports/rvReports.html',
            controller: 'RVReportsMainCtrl',
            resolve: {
                payload: function (RVreportsSrv) {
                    return RVreportsSrv.reportApiPayload();
                }
            },
            lazyLoad: function ($transition$) {
                return $transition$.injector().get('jsMappings').
                    fetchAssets(['react.files', 'rover.reports', 'directives'], ['react']);
            }
        });

        $stateProvider.state('rover.reports.dashboard', {
            url: '/list',
            templateUrl: '/assets/partials/reports/rvReportsDashboard.html',
            controller: 'RVReportsDashboardCtrl'            
        });

        $stateProvider.state('rover.reports.show', {
            url: '/view',
            templateUrl: '/assets/partials/reports/rvReportsDetailedView.html',
            controller: 'RVReportDetailsCtrl',
            params: {
                report: null,
                action: {
                    value: '',
                    dynamic: true // INFO https://ui-router.github.io/guide/ng1/migrate-to-1_0#dynamic-parameters
                },
                page: {
                    value: 1,
                    dynamic: true
                }
            }
        });        

        $stateProvider.state('rover.reports.inbox', {
            url: '/inbox',
            templateUrl: '/assets/partials/reports/backgroundReports/rvReportsInbox.html',
            controller: 'RVReportsInboxCtrl',
            resolve: {
                generatedReportsList: function (RVReportsInboxSrv, $filter, $rootScope) {
                    var params = {
                        generated_date: $filter('date')($rootScope.businessDate, 'yyyy-MM-dd'),
                        per_page: RVReportsInboxSrv.PER_PAGE,
                        user_id: $rootScope.userId
                    };
                    
                    return RVReportsInboxSrv.fetchReportInbox(params);
                }
            }            
        });

        $stateProvider.state('rover.reports.scheduleReportsAndExports', {
            url: '/scheduleReportsAndExports',
            templateUrl: '/assets/partials/reports/backgroundReports/rvScheduleReportsAndExports.html',
            controller: 'RVScheduleReportsAndExportsCtrl',
            params: {
                showScheduledReports: false,
                showScheduledExports: false
            }
        });

        
    });
