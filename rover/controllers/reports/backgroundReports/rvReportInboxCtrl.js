angular.module('sntRover').controller('RVReportsInboxCtrl', [
    '$rootScope',
    '$scope', 
    'RVReportsInboxSrv',
    'generatedReportsList',
    '$state',
    '$filter',
    'sntActivity',
    '$timeout',
    'RVreportsSrv',
    'RVReportNamesConst',
    'RVreportsSubSrv',
    function (
        $rootScope, 
        $scope,
        RVReportsInboxSrv,
        generatedReportsList,
        $state,
        $filter,
        sntActivity,
        $timeout,
        reportsSrv,
        reportNames,
        reportsSubSrv ) {

        var self = this;

        BaseCtrl.call(this, $scope);

        $scope.viewStatus.showDetails = false;

        const REPORT_INBOX_SCROLLER = 'report-inbox-scroller',
            REPORT_FILTERS_PROC_ACTIVITY = 'report_filters_proc_activity',
            PAGINATION_ID = 'report_inbox_pagination';
        

        // Navigate to new report request section
        $scope.createNewReport = () => {
            $state.go('rover.reports.dashboard');
        };

        /**
         * Decides when to disable the report inbox item
         * @param {Object} report selected generated report
         * @return {Boolean} true/fals based on the status
         */
        $scope.shouldDisableInboxItem = (report) => {
            return report.message || report.status.value === 'IN_PROGRESS' || report.status.value === 'REQUESTED';
        };

        /**
         * Get color based on the generated report status
         * @param {Object} report selected generated report
         * @color {String} color for the given report status         
         */
        $scope.getColorCodeForReportStatus = (report) => {
            let color = '';

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

            if (report.status.value === 'IN_PROGRESS' || report.status.value === 'REQUESTED') {
                status = report.status.description;
            }

            return status;            
        };
        

        /**
         * Show the report details like the filter which was used to run the report
         * @param {Object} report selected generated report from the inbox
         * @return {void}
         */
        $scope.showReportDetails = (report) => {
            if (!report.isExpanded) {               
                if (report.filterDetails) {
                    report.isExpanded = !report.isExpanded;
                    self.refreshScroll();
                } else {
                    sntActivity.start(REPORT_FILTERS_PROC_ACTIVITY);
                    RVReportsInboxSrv.processFilters(report).then(function(formatedFilters) {
                        report.filterDetails = formatedFilters;                        
                        report.isExpanded = !report.isExpanded;
                        sntActivity.stop(REPORT_FILTERS_PROC_ACTIVITY);
                        self.refreshScroll();
                    }).catch(function(error) {
                        report.filterDetails = error;
                        report.isExpanded = !report.isExpanded;
                        sntActivity.stop(REPORT_FILTERS_PROC_ACTIVITY);
                        self.refreshScroll();
                    });
                }
               
            } else {
                report.isExpanded = !report.isExpanded;
                self.refreshScroll();                 
            } 
                      
        };

        // Set scroller for report inbox
        self.setScroller = () => {            
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_INBOX_SCROLLER, scrollerOptions);            
        };

        // Refreshes the scroller
        self.refreshScroll = () => {
            $timeout(() => {
                $scope.refreshScroller(REPORT_INBOX_SCROLLER);
                $timeout(() => {
                    $scope.getScroller(REPORT_INBOX_SCROLLER).scrollTo(0, 0);
                }, 200);
            }, 800);
        };


        // Create date dropdown for the filter section
        self.createDateDropdownData = () => {
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
                    value: $filter('date')(hotelBusinessDate, 'yyyy-MM-dd')
                },
                {
                    name: 'Yesterday(' + $filter('date')(hotelYesterday, $rootScope.dateFormat) + ')',
                    value: $filter('date')(hotelYesterday, 'yyyy-MM-dd')
                },
                {
                    name: $filter('date')(hotelDayBeforeYesterday, $rootScope.dateFormat),
                    value: $filter('date')(hotelDayBeforeYesterday, 'yyyy-MM-dd')
                },
                {
                    name: $filter('date')(hotelFourDaysBefore, $rootScope.dateFormat),
                    value: $filter('date')(hotelFourDaysBefore, 'yyyy-MM-dd')
                }
            ];

            return dateDropDown;

        };

        /**
         * Generate request params for fetching the generated reports
         * @param {Number} pageNo current page no
         * @return {Object} params api request parameter object
         */
        self.generateRequestParams = (pageNo) => {
            let params = {
                user_id: $rootScope.userId,
                generated_date: $scope.reportInboxData.filter.selectedDate,
                per_page: RVReportsInboxSrv.PER_PAGE,
                page: pageNo,
                query: $scope.reportInboxData.filter.searchTerm
            };

            return params;
        };
       

        /**
         * Fetches the generated reports
         * @param {Number} pageNo current page no
         * @return {void}
         */
        self.fetchGeneratedReports = (pageNo) => {
            // Keep the current page to restore to the same page later
            $scope.currentPage = pageNo;

            let onReportsFetchSuccess = (data) => {
                    $scope.reportInboxData.generatedReports = self.getFormatedGeneratedReports(data.results, $scope.reportList);
                    $scope.totalResultCount = data.total_count;
                    self.refreshPagination();
                    self.refreshScroll();
                },
                onReportsFetchFailure = (error) => {

                },
                options = {
                    onSuccess: onReportsFetchSuccess,
                    onFailure: onReportsFetchFailure,
                    params: self.generateRequestParams(pageNo)
                };

            $scope.callAPI(RVReportsInboxSrv.fetchReportInbox, options);

        };

        // Set page options for the pagination directive
        self.setPageOptions = () => {
            $scope.pageOptions = {
                id: PAGINATION_ID,
                api: self.fetchGeneratedReports,
                perPage: RVReportsInboxSrv.PER_PAGE
            };
        };
        // Refresh pagination controls
        self.refreshPagination = () => {
            $scope.refreshPagination(PAGINATION_ID);
        };

        /**
         * Fill the necessary data from the report list into each of the generated report
         * @param {Array} generatedReportList array of generated reports
         * @param {Array} reportList - array of reports available
         * @return {Array} array of processed generated reports
         *
         */
        self.getFormatedGeneratedReports = (generatedReportList, reportList) => {
            return RVReportsInboxSrv.formatReportList(generatedReportList, reportList);
        };

        // Decides whether the report listing area should be shown or not
        $scope.shouldShowReportList = () => {
            return $scope.totalResultCount > 0;
        };

        // Refresh report inbox
        $scope.refreshReportInbox = () => {
            self.fetchGeneratedReports(1);
        };

        // Checks whether pagination should be shown or not
        $scope.shouldShowPagination = () => {
            return $scope.totalResultCount > RVReportsInboxSrv.PER_PAGE;
        };

        // Filter the report inbox by name
        $scope.filterByQuery = _.debounce(() => {
            self.fetchGeneratedReports(1);
        }, 100);

        // Clear the report search box
        $scope.clearQuery = function () {
            $scope.reportInboxData.filter.searchTerm = '';
            self.fetchGeneratedReports(1);               
        };
        /*
        * store selected report to service,
        *  Case 1: For Inbox Report, append generatedReportId for choosenReport
        *  Case 2: For normal Report, use default id
        * @params Object Selected report object
        * @return none
        * */
        var setChoosenReport = function (selectedreport) {
            var lastReportID  = reportsSrv.getChoosenReport() ? reportsSrv.getChoosenReport().id : null,
                mainCtrlScope = $scope.$parent,
                choosenReport = _.find($scope.reportList,
                    function(report) {
                        return selectedreport.report_id === report.id;
                    });

            // generatedReportId is required make API call
            choosenReport.generatedReportId = selectedreport.id;
            // if the two reports are not the same, just call
            // 'resetSelf' on printOption to clear out any method
            // that may have been created a specific report ctrl
            // READ MORE: rvReportsMainCtrl:L#:61-75
            if ( lastReportID !== selectedreport.id ) {
                mainCtrlScope.printOptions.resetSelf();
            }
            
            // Setting the raw data containing the filter state while running the report
            // These filter data is used in some of the reports controller 
            choosenReport = _.extend(choosenReport, selectedreport.rawData);
            reportsSrv.setChoosenReport( choosenReport );
        };

        /*
        * handle Show Button action's in report inbox screen
        * @params Object Selected report object
        * @return none
        * */
        $scope.showGeneratedReport = function( selectedreport ) {
            var mainCtrlScope = $scope.$parent;

            setChoosenReport(selectedreport);
            mainCtrlScope.genReport(false, $scope.currentPage);
        };
       
        /*
        * handle Export Button action's in report inbox screen
        * @params Object Selected report object
        * @return none
        * */
        $scope.exportCSV = function( selectedreport ) {
            var mainCtrlScope = $scope.$parent;

            setChoosenReport(selectedreport);
            mainCtrlScope.exportCSV();
        };
        /**
         * Set title and heading
         */
        self.setTitleAndHeading = function() {
            let listTitle = $filter('translate')('MENU_REPORTS_INBOX');
            
            $scope.setTitle(listTitle);
            $scope.$parent.heading = listTitle;
        };

        // Reset the report selection and filters
        self.resetPreviousReportSelection = () => {
            _.map($scope.$parent.reportList,
                function (report) {
                    report.uiChosen = false;
                    _.map(report.filters, (filter) => {
                        if (filter.filled) {
                            filter.filled = false; 
                        }                        
                    });
                }
            );

        };
       

        /**
         * Print the report from the report inbox
         * @params Object report selected generated report
         * @return void
         */
        $scope.printReport = (report) => { 
            var mainCtrlScope = $scope.$parent;

            setChoosenReport(report);
            reportsSrv.setPrintClicked(true);
            mainCtrlScope.genReport(false, 1, 1000); 
        };

        // Initialize
        self.init = () => {            
            $scope.reportInboxData = {
                selectedReportAppliedFilters: {},
                generatedReports: [],
                filter: {
                    selectedDate: $filter('date')($rootScope.businessDate, 'yyyy-MM-dd'),
                    searchTerm: ''
                },
                isReportInboxOpen: false
            };

            $scope.dateDropDown = self.createDateDropdownData();
            self.setPageOptions();
            
            self.setScroller();
            self.setTitleAndHeading();
            
            RVReportsInboxSrv.processReports($scope.reportList);
            $scope.reportInboxData.generatedReports = self.getFormatedGeneratedReports(generatedReportsList.results, $scope.reportList);
            $scope.totalResultCount = generatedReportsList.total_count;
            

            $timeout(function() {
                $scope.$broadcast('updatePagination', PAGINATION_ID);
                $scope.$broadcast('updatePageNo', $state.params.page);
                
            }, 50); 


            self.refreshScroll();  

            self.resetPreviousReportSelection();   

           if (reportsSrv.getChoosenReport()) {
                reportsSrv.getChoosenReport().generatedReportId = null;
            }

        };

        self.init();
        
    }
]);
