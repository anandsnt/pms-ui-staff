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

        var LIST_ISCROLL_ATTR = 'report-list-scroll';

        var LIST_ISCROLL_ATTR = 'report-list-scroll';

        var REPORT_DASHBOARD_SCROLL = 'report-dashboard-scroll',
            REPORT_LIST_SCROLL = 'report-list-scroll',
            REPORT_FILTERS_SCROLL = 'report-filters-scroll';


        $scope.setScroller(LIST_ISCROLL_ATTR, {
            preventDefault: false
        });
        $scope.setScroller('reportUserFilterScroll');

        /**
         * inorder to refresh after list rendering
         */
        var listRendered = $scope.$on("REPORT_LIST_RENDERED", function() {
            $scope.refreshScroller( LIST_ISCROLL_ATTR );
        });
        
        $scope.$on( '$destroy', listRendered );



        /**
         *   Post processing fetched data to modify and add additional data
         *   @param {Array} - report: which points to $scope.$parent.report, see end of this function
         */
        var postProcess = function(report) {
            for (var i = 0, j = report.length; i < j; i++) {

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
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 100 );
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 2010 );
        };

        postProcess( $scope.$parent.reportList );


        // show hide filter toggle
        $scope.toggleFilter = function(e, reportItem) {
            if ( e ) {
                e.preventDefault();
                e.stopPropagation();
            };

            var toggle = function() {
                reportItem.show_filter = reportItem.show_filter ? false : true;
                $scope.refreshScroller( LIST_ISCROLL_ATTR );

                // close any open 'FAUX_SELECT'
                _.each($scope.$parent.reportList, function(thatReport, index) {
                    if ( thatReport.id != reportItem.id ) {
                        _.each(thatReport, function(value, key) {
                            if ( !!value && value.type === 'FAUX_SELECT' ) {
                                value.show = false;
                            };
                        });
                    };
                });

                $scope.refreshScroller('reportUserFilterScroll');
            };

            var callback = function() {
                $scope.$emit( 'hideLoader' );
                toggle();
            };

            if ( !! reportItem.allFiltersProcessed ) {
                toggle();
            } else {
                $scope.$emit( 'showLoader' );
                reportUtils.findFillFilters( reportItem, $scope.$parent.reportList )
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


        var serveRefresh = $scope.$on(reportMsgs['REPORT_LIST_SCROLL_REFRESH'], function() {
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 100 );
        });

        // removing event listners when scope is destroyed
        $scope.$on( '$destroy', serveRefresh );

        
    }

]);
