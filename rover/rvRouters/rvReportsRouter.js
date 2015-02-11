angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {
            reportsResponse: function(RVreportsSrv) {
                if ( !!RVreportsSrv ) {
                    return RVreportsSrv.fetchReportList();
                } else {
                    return {};
                }
            },
            activeUserList: function(RVreportsSrv) {
                return RVreportsSrv.fetchActiveUsers();
            },
            guaranteeTypes: function(RVreportsSrv) {
                return RVreportsSrv.fetchGuaranteeTypes();
            }
        }
    });
});