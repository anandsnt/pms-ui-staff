angular.module('sntRover').controller('RVReportsInboxCtrl', [
    '$rootScope',
    '$scope', 
    'RVReportsInboxSrv',
    'generatedReportsList',     
    function (
        $rootScope, 
        $scope,
        RVReportsInboxSrv,
        generatedReportsList) {

        /**
         * Process the report list and add the needed details
         * @param {Array} reportsList holding  the list of reports
         * @return {Array} reportsList processed report list
         */
        var processReportList = function(reportsList) {
            let selectedReport;
            for (let report of reportsList) {
                selectedReport = _.find($scope.reportList, {id: report.report_id});
                report.name = selectedReport.title;
                report.reportIconCls = selectedReport.reportIconCls;
            }
            return reportsList;
        };

        // Initialize
        var init = function() {
            RVReportsInboxSrv.processReports($scope.reportList);
            $scope.generatedReportsList = processReportList(generatedReportsList);
        };

        init();
        
    }
]);
