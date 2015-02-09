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
            companyList: function(RVreportsSrv) {
                return RVreportsSrv.fetchCompanies();
            },
            travelAgentList: function(RVreportsSrv) {
                return RVreportsSrv.fetchTravelAgents();
            },
            groupList: function(RVreportsSrv) {
                return RVreportsSrv.fetchGroups();
            },
            guaranteeTypes: function(RVreportsSrv) {
                return RVreportsSrv.fetchGuaranteeTypes();
            }
        }
    });
});