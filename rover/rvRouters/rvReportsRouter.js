angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {
            reportsAssets: function(jsMappings) {
                return jsMappings.fetchAssets('rover.reports', ['ngReact']);
            },
            payload: function(RVreportsSrv, reportsAssets) {
                return RVreportsSrv.reportApiPayload();
            }

            // removed other resolves from here
        }
    });
});
