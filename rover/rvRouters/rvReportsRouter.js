angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {
            directivesJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets('directives');
            },             
            reportsAssets: function(jsMappings, mappingList, directivesJsAssets) {
                return jsMappings.fetchAssets('rover.reports', ['ngReact']);
            },
            payload: function(RVreportsSrv, reportsAssets) {
                return RVreportsSrv.reportApiPayload();
            }

            // removed other resolves from here
        }
    });
});
