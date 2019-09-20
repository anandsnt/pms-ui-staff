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
    'RVReportUtilsFac',
    '$q',
    'RVReportMsgsConst',
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
        reportsSubSrv,
        reportUtils,
        $q, reportMsgs) {

        var self = this;

        BaseCtrl.call(this, $scope);

        $scope.viewStatus.showDetails = false;

        const REPORT_INBOX_SCROLLER = 'report-inbox-scroller',
            REPORT_FILTERS_PROC_ACTIVITY = 'report_filters_proc_activity',
            PAGINATION_ID = 'report_inbox_pagination';
        

        // Navigate to new report request section
        $scope.createNewReport = () => {
            // Reset the report list, this is required because some of the fields
            // eg: sort_fields are formatted and don't work with the current values
            // Hence restored the original list while naviagting to report dashboard
            $scope.$parent.reportList = JSON.parse(JSON.stringify($scope.reportListCopy));
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

        // Refreshes the scroller
        self.refreshScroll = () => {
            $timeout(() => {
                $scope.refreshScroller(REPORT_INBOX_SCROLLER);                
            }, 800);
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
                    }).
                    catch(function(error) {
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

        // Refreshes and set the scroller position
        self.refreshAndAdjustScroll = () => {
            $timeout(() => {
                $scope.refreshScroller(REPORT_INBOX_SCROLLER);
                $timeout(() => {
                    $scope.getScroller(REPORT_INBOX_SCROLLER).scrollTo(0, 0);
                }, 200);
            }, 800);
        };


        // Create date dropdown for the filter section
        self.createDateDropdownData = () => {
            // Using the system date to show the date filter.Sometimes the business date and system date may
            // be different for properties in dev env. 
            let hotelBusinessDate = new tzIndependentDate($rootScope.serverDate),
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
        self.fetchGeneratedReports = (shouldRefreshDropDownDates, pageNo) => {
            $scope.reportInboxPageState.returnPage = pageNo;

            let onReportsFetchSuccess = (data) => {
                    $scope.reportInboxData.generatedReports = self.getFormatedGeneratedReports(data.results, $scope.reportList);
                    $scope.totalResultCount = data.total_count;
                    if (shouldRefreshDropDownDates) {
                        if ($rootScope.serverDate !== data.background_report_default_date) {
                            $rootScope.serverDate = data.background_report_default_date;
                            $scope.dateDropDown = self.createDateDropdownData();
                            $scope.reportInboxData.filter.selectedDate = $filter('date')($rootScope.serverDate, 'yyyy-MM-dd');
                            self.fetchGeneratedReports(false, 1);
                        }
                        
                    }
                    self.refreshPagination();
                    self.refreshAndAdjustScroll();
                },                
                options = {
                    onSuccess: onReportsFetchSuccess,                    
                    params: self.generateRequestParams(pageNo)
                };

            $scope.callAPI(RVReportsInboxSrv.fetchReportInbox, options);

        };

        // Set page options for the pagination directive
        self.setPageOptions = () => {
            $scope.pageOptions = {
                id: PAGINATION_ID,
                api: [self.fetchGeneratedReports, false],
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
            $scope.reportInboxPageState.returnDate = $scope.reportInboxData.filter.selectedDate;
            self.fetchGeneratedReports(true, 1);
        };

        // Checks whether pagination should be shown or not
        $scope.shouldShowPagination = () => {
            return $scope.totalResultCount > RVReportsInboxSrv.PER_PAGE;
        };

        // Filter the report inbox by name
        $scope.filterByQuery = _.debounce(() => {
            $scope.$apply(function() {
                self.fetchGeneratedReports(false, 1);
            });            
        }, 800);

        // Clear the report search box
        $scope.clearQuery = function () {
            $scope.reportInboxData.filter.searchTerm = '';
            self.fetchGeneratedReports(false, 1);               
        };

        // Get master data for configuring the filters for reports
        var getConfigData = () => {
            var config = {
                    'guaranteeTypes': $scope.$parent.guaranteeTypes,
                    'markets': $scope.$parent.markets,
                    'sources': $scope.$parent.sources,
                    'origins': $scope.$parent.origins,
                    'codeSettings': $scope.$parent.codeSettings,
                    'holdStatus': $scope.$parent.holdStatus,
                    'chargeNAddonGroups': $scope.$parent.chargeNAddonGroups,
                    'chargeCodes': $scope.$parent.chargeCodes,
                    'addons': $scope.$parent.addons,
                    'reservationStatus': $scope.$parent.reservationStatus,
                    'assigned_departments': $scope.$parent.assigned_departments,
                    'activeUserList': $scope.$parent.activeUserList,
                    'travel_agent_ids': $scope.$parent.travel_agents
                };

            return config;
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
                    }),
                   deffered = $q.defer();

            choosenReport.usedFilters = selectedreport.filters;
            // generatedReportId is required make API call
            choosenReport.generatedReportId = selectedreport.id;
            // if the two reports are not the same, just call
            // 'resetSelf' on printOption to clear out any method
            // that may have been created a specific report ctrl
            // READ MORE: rvReportsMainCtrl:L#:61-75
            if ( lastReportID !== selectedreport.id ) {
                mainCtrlScope.printOptions.resetSelf();
            }
            reportsSrv.processSelectedReport(choosenReport, getConfigData());

            reportUtils.findFillFilters(choosenReport, $scope.$parent.reportList).
            then(function () {
                // Setting the raw data containing the filter state while running the report
                // These filter data is used in some of the reports controller 
                choosenReport = _.extend(JSON.parse(JSON.stringify(choosenReport)), selectedreport.rawData);
                choosenReport.appliedFilter = selectedreport.appliedFilter;
                reportsSrv.setChoosenReport( choosenReport );
                deffered.resolve();
            });            
            
            return deffered.promise;            
        };

        /*
        * handle Show Button action's in report inbox screen
        * @params Object Selected report object
        * @return none
        * */
        $scope.showGeneratedReport = function( selectedreport ) {
            if ( (selectedreport.shouldShowExport && !selectedreport.shouldDisplayView) || $scope.shouldDisableInboxItem(selectedreport) ) {
                return;
            }
            
            var mainCtrlScope = $scope.$parent;

            setChoosenReport(selectedreport).then(function() {
               mainCtrlScope.genReport(); 
            });
                  
        };
       
        /*
        * handle Export Button action's in report inbox screen
        * @params Object Selected report object
        * @return none
        * */
        $scope.exportCSV = function( selectedreport ) {
            var mainCtrlScope = $scope.$parent;

            setChoosenReport(selectedreport).then(function() {
                 mainCtrlScope.exportCSV();
            });           
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

            setChoosenReport(report).then(function() {
                mainCtrlScope.genReport(false, 1, 99999);
            });
            reportsSrv.setPrintClicked(true);                       
            
        };

        $scope.addListener(reportMsgs['REPORT_API_FAILED'], function(event, data) {
            $scope.errorMessage = data;
        });

        // Initialize
        self.init = () => { 
            var chosenDate = $state.params.date ? $state.params.date : $rootScope.serverDate;

            $scope.reportInboxData = {
                selectedReportAppliedFilters: {},
                generatedReports: [],
                filter: {
                    selectedDate: $filter('date')(chosenDate, 'yyyy-MM-dd'),
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
            $scope.reportInboxPageState.returnDate = $scope.reportInboxData.filter.selectedDate;

            $timeout(function() {
               $scope.$broadcast('updatePagination', PAGINATION_ID);
               $scope.$broadcast('updatePageNo', $state.params.page);
            }, 50);            

            self.refreshAndAdjustScroll();  

            self.resetPreviousReportSelection();   

           if (reportsSrv.getChoosenReport()) {
                reportsSrv.getChoosenReport().generatedReportId = null;
            }

        };

        self.init();
        
    }
]);
