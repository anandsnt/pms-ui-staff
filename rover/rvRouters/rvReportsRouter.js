angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {
            reportsAssets: function(mappingList, $ocLazyLoad) {
                return $ocLazyLoad.load(
                {
                    serie: true,
                    files: mappingList['rover.reports']
                }).then(function(){
                    $ocLazyLoad.inject('ngReact');
                });
            },
            payload: function(RVreportsSrv, reportsAssets) {
                return RVreportsSrv.reportApiPayload();
            }

            // removed other resolves from here
        }
    });
});
