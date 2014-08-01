//angular.module('reportsModule', ['mgcrea.ngStrap.datepicker'])
angular.module('reportsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.reports', {
        url: '/reports',
        templateUrl: '/assets/partials/reports/rvReports.html',
        controller: 'RVReportsMainCtrl',
        resolve: {
            reportsResponse: function(RVreportsSrv) {
                return RVreportsSrv.fetchReportList();
            }
        }
    });

    // set update date settings
    // angular.extend($datepickerProvider.defaults, {
    //     dateFormat: 'MM-dd-yyyy',
    //     startWeek: 0,
    //     autoclose: true,
    //     container: 'body'
    // });
});