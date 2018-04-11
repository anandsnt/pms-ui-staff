angular.module('sntRover').controller('RVReportsInboxCtrl', [
    '$rootScope',
    '$scope', 
    'RVReportsInboxSrv',
    'generatedReportsList',
    '$state'     ,
    function (
        $rootScope, 
        $scope,
        RVReportsInboxSrv,
        generatedReportsList,
        $state) {

        var REPORT_INBOX_SCROLLER = 'report-inbox-scroller';

        /**
         * Process the report list and add the needed details
         * @param {Array} reportsList holding  the list of reports
         * @return {Array} reportsList processed report list
         */
        var processReportList = function(reportsList) {
            let selectedReport;

            _.each(reportsList, function(report) {
                selectedReport = _.find($scope.reportList, {id: report.report_id});
                report.name = selectedReport.title;
                report.reportIconCls = selectedReport.reportIconCls;
                report.shouldShowExport = selectedReport.display_export_button;
                report.isExpanded = false;
            });
            
            return reportsList;
        };

        // Navigate to new report request section
        $scope.createNewReport = function () {
            $state.go('rover.reports.dashboard', {
                fromReportInbox: true
            });
        };

        $scope.shouldDisableInboxItem = function(report) {
            return report.message || report.status.value === 'IN_PROGRESS';
        };

        $scope.getColorCodeForReportStatus = function(report) {
            let color = "";

            if (report.message) {
                color = 'red';
            } else if (report.status.value === 'IN_PROGRESS') {
                color = 'blue';
            }

            return color;
        };

        $scope.getRequestedReportStatus = function(report) {
            let status = report.message;

            if (report.status.value === 'IN_PROGRESS') {
                status = report.status.description;
            }

            return status;            
        };

        var processFilters = function(filters) {
            _.each(filters, function(filter) {

            });

        };

        $scope.showReportDetails = function(report) {
            if (!report.isExpanded) {
               RVReportsInboxSrv.processFilters(report.filters).then(function(formatedFilters) {
                $scope.filters = formatedFilters;
                report.isExpanded = !report.isExpanded;
                }); 
            } else {
                report.isExpanded = !report.isExpanded;
            } 
            refreshScroll();
        };

        var setScroller = function () {            
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_INBOX_SCROLLER, scrollerOptions);            
        };

        

        var refreshScroll = function () {
            $scope.refreshScroller(REPORT_INBOX_SCROLLER);            
        };



        // Initialize
        var init = function() {
            RVReportsInboxSrv.processReports($scope.reportList);
            $scope.generatedReportsList = processReportList(generatedReportsList.results);
            setScroller();            
        };

        init();
        
    }
]);
