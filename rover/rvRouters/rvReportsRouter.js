angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {
            reportsResponse: function(RVreportsSrv) {
                return RVreportsSrv.fetchReportList();
            },
            activeUserList: function(RVreportsSrv) {
                return RVreportsSrv.fetchActiveUsers();
            },
            guaranteeTypes: function(RVreportsSrv) {
                return RVreportsSrv.fetchGuaranteeTypes();
            },
			chargeGroups: function(RVreportsSrv) {
                return RVreportsSrv.fetchChargeGroups();
            },
			chargeCodes: function(RVreportsSrv) {
                return RVreportsSrv.fetchChargeCodes();
            },
            markets: function(RVreportsSrv) {
                return RVreportsSrv.fetchDemographicMarketSegments();
            },
            sources: function(RVreportsSrv) {
                return RVreportsSrv.fetchSources();
            },
            origins: function(RVreportsSrv) {
                return RVreportsSrv.fetchBookingOrigins();
            },
            codeSettings: function(RVreportsSrv) {
                return RVreportsSrv.fetchCodeSettings();
            }
        }
    });
});
