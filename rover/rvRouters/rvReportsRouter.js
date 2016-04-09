angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {         
            reportsAssets: function(jsMappings, mappingList) {
                return jsMappings.fetchAssets(['react.files', 'rover.reports', 'directives'], ['react']);
            },
            payload: function(RVreportsSrv, reportsAssets) {
                return RVreportsSrv.reportApiPayload();
            }
        }
    });
});
