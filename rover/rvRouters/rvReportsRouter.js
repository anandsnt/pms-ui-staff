angular.module('reportsModule', [])
    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

        $stateProvider.state('rover.reports', {
            url: '/reports',
            templateUrl: '/assets/partials/reports/rvReports.html',
            controller: 'RVReportsMainCtrl',
            resolve: {
                reportsAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['react.files', 'rover.reports', 'directives'], ['react']);
                },
                payload: function (RVreportsSrv, reportsAssets) {
                    return RVreportsSrv.reportApiPayload();
                }
            },
            redirectTo: function () {
                return 'rover.reports.dashboard';
            }
        });

        $stateProvider.state('rover.reports.dashboard', {
            url: '/list',
            templateUrl: '/assets/partials/reports/rvReportsDashboard.html'
        });

        $stateProvider.state('rover.reports.show', {
            url: '/view',
            templateUrl: '/assets/partials/reports/rvReportsDetailedView.html',
            controller: 'RVReportDetailsCtrl',
            params: {
                report: null,
                action: {
                    value: '',
                    dynamic: true
                },
                page: {
                    value: 1,
                    dynamic: true
                }
            }
        });

        $stateProvider.state('rover.scheduleReports', {
            url: '/scheduleReports'
        });

        $stateProvider.state('rover.reportCategory', {
            url: '/reportCategory'
        });
    });
