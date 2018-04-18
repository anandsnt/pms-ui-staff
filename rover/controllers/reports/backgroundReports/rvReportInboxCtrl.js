angular.module('sntRover').controller('RVReportsInboxCtrl', [
    '$rootScope',
    '$scope', 
    'RVReportsInboxSrv',
    'generatedReportsList',
    '$state',
    '$filter',
    'sntActivity',
    '$timeout',
    function (
        $rootScope, 
        $scope,
        RVReportsInboxSrv,
        generatedReportsList,
        $state,
        $filter,
        sntActivity,
        $timeout ) {

        BaseCtrl.call(this, $scope);

        const REPORT_INBOX_SCROLLER = 'report-inbox-scroller',
            REPORT_FILTERS_PROC_ACTIVITY = 'report_filters_proc_activity',
            PAGINATION_ID = 'report_inbox_pagination';
        

        // Navigate to new report request section
        $scope.createNewReport = () => {
            $state.go('rover.reports.dashboard', {
                fromReportInbox: true
            });
        };

        /**
         * Decides when to disable the report inbox item
         * @param {Object} report selected generated report
         * @return {Boolean} true/fals based on the status
         */
        $scope.shouldDisableInboxItem = (report) => {
            return report.message || report.status.value === 'IN_PROGRESS';
        };

        /**
         * Get color based on the generated report status
         * @param {Object} report selected generated report
         * @color {String} color for the given report status         
         */
        $scope.getColorCodeForReportStatus = (report) => {
            let color = "";

            if (report.message) {
                color = 'red';
            } else if (report.status.value === 'IN_PROGRESS') {
                color = 'blue';
            }

            return color;
        };

        /**
         * Get generated report status
         * @param {Object} report selected generated report
         * @return {String} status status of the report
         */
        $scope.getRequestedReportStatus = (report) => {
            let status = report.message;

            if (report.status.value === 'IN_PROGRESS') {
                status = report.status.description;
            }

            return status;            
        };

        var processFilters = (filters) => {
            _.each(filters, function(filter) {

            });

        };

        /**
         * Show the report details like the filter which was used to run the report
         * @param {Object} report selected generated report from the inbox
         * @return {void}
         */
        $scope.showReportDetails = (report) => {
            if (!report.isExpanded) {
               sntActivity.start(REPORT_FILTERS_PROC_ACTIVITY);
               RVReportsInboxSrv.processFilters(report.filters).then(function(formatedFilters) {
                $scope.filters = formatedFilters;
                report.isExpanded = !report.isExpanded;
                sntActivity.stop(REPORT_FILTERS_PROC_ACTIVITY);

                }); 
            } else {
                report.isExpanded = !report.isExpanded;
            } 
            $timeout(() =>  {
                refreshScroll();
            }, 100);            
        };

        // Set scroller for report inbox
        let setScroller = () => {            
                var scrollerOptions = {
                    tap: true,
                    preventDefault: false
                };

                $scope.setScroller(REPORT_INBOX_SCROLLER, scrollerOptions);            
            },
            // Refreshes the scroller
            refreshScroll = () => {
                $scope.refreshScroller(REPORT_INBOX_SCROLLER);            
            };


        // Create date dropdown for the filter section
        let createDateDropdownData = () => {            
            let hotelBusinessDate = new tzIndependentDate($rootScope.businessDate),
                hotelYesterday = new tzIndependentDate(hotelBusinessDate),
                hotelDayBeforeYesterday = new tzIndependentDate(hotelBusinessDate),
                hotelFourDaysBefore = new tzIndependentDate(hotelBusinessDate);

            hotelYesterday.setDate(hotelYesterday.getDate() - 1);
            hotelDayBeforeYesterday.setDate(hotelDayBeforeYesterday.getDate() - 2);
            hotelFourDaysBefore.setDate(hotelFourDaysBefore.getDate() - 3);

            let dateDropDown = [
                {
                    name: 'Today(' + $filter('date')(hotelBusinessDate, $rootScope.dateFormat) + ')',
                    value: $filter('date')(hotelBusinessDate, 'yyyy/MM/dd') 
                },
                {
                    name: 'Yesterday(' + $filter('date')(hotelYesterday, $rootScope.dateFormat) + ')',
                    value: $filter('date')(hotelYesterday, 'yyyy/MM/dd') 
                },
                {
                    name:  $filter('date')(hotelDayBeforeYesterday, $rootScope.dateFormat),
                    value: $filter('date')(hotelDayBeforeYesterday, 'yyyy/MM/dd') 
                },
                {
                    name:  $filter('date')(hotelFourDaysBefore, $rootScope.dateFormat),
                    value: $filter('date')(hotelFourDaysBefore, 'yyyy/MM/dd') 
                }
            ];
            return dateDropDown;

        };

        /**
         * Generate request params for fetching the generated reports
         * @param {Number} pageNo current page no
         * @return {Object} params api request parameter object
         */
        let generateRequestParams = (pageNo) => {
            let params = {
                user_id: $rootScope.userId,
                from_date: '2018-04-09', //$scope.reportInboxData.filter.selectedDate, 
                to_date: '2018-04-19', //$scope.reportInboxData.filter.selectedDate,
                per_page: RVReportsInboxSrv.PER_PAGE,
                page: pageNo
            };

            return params;
        };

        /**
         * Fetches the generated reports
         * @param {Number} pageNo current page no
         * @return {void}
         */
        let fetchGeneratedReports = (pageNo) => {

            let onReportsFetchSuccess = (data) => {
                    $scope.reportInboxData.generatedReports = getFormatedGeneratedReports(data.results, $scope.reportList);
                    $scope.totalResultCount = data.total_count;
                    refreshPagination();
                    refreshScroll();
                },
                onReportsFetchFailure = (error) => {

                },
                options = {
                    onSuccess: onReportsFetchSuccess,
                    onFailure: onReportsFetchFailure,
                    params: generateRequestParams(pageNo)
                };

            $scope.callAPI(RVReportsInboxSrv.fetchReportInbox, options);

        };

        // Set page options for the pagination directive
        let setPageOptions = () => {
                $scope.pageOptions = {
                    id: PAGINATION_ID,
                    api: fetchGeneratedReports,
                    perPage: RVReportsInboxSrv.PER_PAGE
                };
            },
            // Refresh pagination controls
            refreshPagination = () => {
                $scope.refreshPagination(PAGINATION_ID);
            };

        /**
         * Fill the necessary data from the report list into each of the generated report
         * @param {Array} generatedReportList array of generated reports
         * @param {Array} reportList - array of reports available
         * @return {Array} array of processed generated reports
         *
         */
        let getFormatedGeneratedReports = (generatedReportList, reportList) => {
            return RVReportsInboxSrv.formatReportList(generatedReportList, reportList);
        };

        // Decides whether the report listing area should be shown or not
        $scope.shouldShowReportList = () => {
            return $scope.totalResultCount > 0;
        };

        $scope.refreshReportInbox = () => {
            fetchGeneratedReports(1);
        };

        $scope.shouldShowPagination = () => {
            return $scope.totalResultCount > RVReportsInboxSrv.PER_PAGE;
        };

        // Initialize
        var init = () => {
            $scope.reportInboxData = {
                selectedReportAppliedFilters: {},
                generatedReports: [],
                filter: {
                    selectedDate: $filter('date')($rootScope.businessDate, 'yyyy/MM/dd')
                }
            };

            $scope.dateDropDown = createDateDropdownData();
            setPageOptions();

            setScroller();

            RVReportsInboxSrv.processReports($scope.reportList);
            $scope.reportInboxData.generatedReports = getFormatedGeneratedReports(generatedReportsList.results, $scope.reportList);
            $scope.totalResultCount = generatedReportsList.total_count;

            refreshPagination();

            refreshScroll();          
        };

        init();
        
    }
]);
