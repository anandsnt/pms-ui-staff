sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    'RVreportsSubSrv',
    'RVReportUtilsFac',
    'RVReportMsgsConst',
    '$timeout',
    'RVReportApplyIconClass',
    'RVReportApplyFlags',
    'RVReportSetupDates',
    function($scope, $rootScope, $filter, reportsSrv, reportsSubSrv, reportUtils, reportMsgs, $timeout, applyIconClass, applyFlags, setupDates) {

        BaseCtrl.call(this, $scope);

        var REPORT_LIST_SCROLL = 'report-list-scroll',
            REPORT_FILTERS_SCROLL = 'report-filters-scroll';

        $scope.refreshFilterScroll = function(scrollUp) {
            $scope.refreshScroller(REPORT_FILTERS_SCROLL);
            if ( !!scrollUp && $scope.myScroll.hasOwnProperty(REPORT_FILTERS_SCROLL) ) {
                $scope.myScroll[REPORT_FILTERS_SCROLL].scrollTo(0, 0, 100);
            };
        }

        $scope.refreshAllScroll = function() {
            $scope.refreshScroller(REPORT_LIST_SCROLL);
            if ( $scope.myScroll.hasOwnProperty(REPORT_LIST_SCROLL) ) {
                $scope.myScroll[REPORT_LIST_SCROLL].scrollTo(0, 0, 100);
            };
            $scope.refreshFilterScroll();
        };

        var setScroller = function() {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_LIST_SCROLL, scrollerOptions);
            $scope.setScroller(REPORT_FILTERS_SCROLL, scrollerOptions);
        };

        setScroller();

        /**
         *   Post processing fetched data to modify and add additional data
         *   @param {Array} - report: which points to $scope.$parent.report, see end of this function
         */
        var postProcess = function(report) {
            for (var i = 0, j = report.length; i < j; i++) {

                report[i].filteredOut = false;

                // apply icon class based on the report name
                applyIconClass.init( report[i] );

                // apply certain flags based on the report name
                applyFlags.init( report[i] );

                // add users filter for needed reports
                // unfortunately this is not sent from server
                reportUtils.addIncludeUserFilter( report[i] );

                setupDates.init( report[i] );
                _.each(report[i]['filters'], function(filter) {
                    setupDates.execFilter( report[i], filter );
                });

                // to process the filters for this report
                reportUtils.processFilters(report[i], {
                    'guaranteeTypes'   : $scope.$parent.guaranteeTypes,
                    'markets'          : $scope.$parent.markets,
                    'sources'          : $scope.$parent.sources,
                    'origins'          : $scope.$parent.origins,
                    'codeSettings'     : $scope.$parent.codeSettings,
                    'holdStatus'       : $scope.$parent.holdStatus,
                    'chargeNAddonGroups' : $scope.$parent.chargeNAddonGroups,
                    'chargeCodes'      : $scope.$parent.chargeCodes,
                    'addons'           : $scope.$parent.addons,
                    'reservationStatus': $scope.$parent.reservationStatus,
                    'assigned_departments': $scope.$parent.assigned_departments,
                    'activeUserList'   : $scope.$parent.activeUserList
                });

                // to reorder & map the sort_by to report details columns - for this report
                // re-order must be called before processing
                reportUtils.reOrderSortBy( report[i] );

                // to process the sort by for this report
                // processing must be called after re-odering
                reportUtils.processSortBy( report[i] );

                // to assign inital date values for this report
                // reportUtils.initDateValues( report[i] );

                // to process the group by for this report
                reportUtils.processGroupBy( report[i] );


                // CICO-8010: for Yotel make "date" default sort by filter
                if ($rootScope.currentHotelData === 'Yotel London Heathrow') {
                    var sortDate = _.find(report[i].sortByOptions, function(item) {
                        return item.value === 'DATE';
                    });
                    if (!!sortDate) {
                        report[i].chosenSortBy = sortDate.value;
                    };
                };
            };

            // SUPER forcing scroll refresh!
            // 2000 is the delay for slide anim, so firing again after 2010
            $timeout( $scope.refreshAllScroll, 2010 );
        };

        postProcess( $scope.$parent.reportList );



        // show hide filter toggle
        $scope.toggleFilter = function(e, report) {
            if ( e ) {
                e.preventDefault();
                e.stopPropagation();
            };

            var callback = function() {
                if ( !! $scope.$parent.uiChosenReport ) {
                    $scope.$parent.uiChosenReport.uiChosen = false;
                }

                report.uiChosen = true;
                $scope.$parent.uiChosenReport = report;

                $scope.setViewCol( $scope.viewCols[1] );

                $timeout(function() {
                    $scope.refreshFilterScroll('scrollUp');
                    $scope.$emit( 'hideLoader' );
                }, 1000);
            };

            $scope.$emit( 'showLoader' );
            if ( !! report.allFiltersProcessed ) {
                callback();
            } else {
                reportUtils.findFillFilters( report, $scope.$parent.reportList )
                    .then( callback );
            };
        };

        $scope.setnGenReport = function(report) {
            var lastReportID  = reportsSrv.getChoosenReport().id,
                mainCtrlScope = $scope.$parent;

            // if the two reports are not the same, just call
            // 'resetSelf' on printOption to clear out any method
            // that may have been created a specific report ctrl
            // READ MORE: rvReportsMainCtrl:L#:61-75
            if ( lastReportID != report.id ) {
                mainCtrlScope.printOptions.resetSelf();
            };
            reportsSrv.setChoosenReport( report );
            mainCtrlScope.genReport();
        };

        /** event when backbutton clicked, fixing as part of CICO-31031 */
        var serveRefresh = $scope.$on(reportMsgs['REPORT_LIST_SCROLL_REFRESH'], function() {
            $timeout( $scope.refreshScroller.bind($scope, REPORT_LIST_SCROLL), 200 );
        });

        //removing event listners when scope is destroyed
        $scope.$on( '$destroy', serveRefresh );


    }

]);
