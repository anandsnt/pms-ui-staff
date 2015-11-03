sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    'RVreportsSubSrv',
    'RVReportUtilsFac',
    'RVReportMsgsConst',
    '$timeout',
    function($scope, $rootScope, $filter, reportsSrv, reportsSubSrv, reportUtils, reportMsgs, $timeout) {

        BaseCtrl.call(this, $scope);

        var LIST_ISCROLL_ATTR = 'report-list-scroll';

        $scope.setScroller(LIST_ISCROLL_ATTR, {
            preventDefault: false
        });

        /**
         * inorder to refresh after list rendering
         */
        $scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event) {
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 2010 );
        });



        /**
         *   Post processing fetched data to modify and add additional data
         *   @param {Array} - report: which points to $scope.$parent.report, see end of this function
         */
        var postProcess = function(report) {
            for (var i = 0, j = report.length; i < j; i++) {

                // add icon class to this report
                reportUtils.applyIconClass( report[i] );

                // add required flags this report
                reportUtils.applyFlags( report[i] );

                // add users filter for needed reports
                // unfortunately this is not sent from server
                reportUtils.addIncludeUserFilter( report[i] );

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
                    'reservationStatus': $scope.$parent.reservationStatus
                });

                // to reorder & map the sort_by to report details columns - for this report
                // re-order must be called before processing
                reportUtils.reOrderSortBy( report[i] );

                // to process the sort by for this report
                // processing must be called after re-odering
                reportUtils.processSortBy( report[i] );

                // to assign inital date values for this report
                reportUtils.initDateValues( report[i] );

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
        $scope.toggleFilter = function(reportItem) {
            // this.item.show_filter = this.item.show_filter ? false : true;
            // $scope.refreshScroller( LIST_ISCROLL_ATTR );

            var toggle = function() {
                reportItem.show_filter = reportItem.show_filter ? false : true;
                $scope.refreshScroller( LIST_ISCROLL_ATTR );
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

        $scope.setnGenReport = function() {
            var lastReportID  = reportsSrv.getChoosenReport().id,
                mainCtrlScope = $scope.$parent;

            // if the two reports are not the same, just call
            // 'resetSelf' on printOption to clear out any method
            // that may have been created a specific report ctrl
            // READ MORE: rvReportsMainCtrl:L#:61-75
            if ( lastReportID != this.item.id ) {
                mainCtrlScope.printOptions.resetSelf();
            };
            reportsSrv.setChoosenReport( this.item );
            $scope.genReport();
        };


        var serveRefresh = $scope.$on(reportMsgs['REPORT_LIST_SCROLL_REFRESH'], function() {
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 100 );
        });

        // removing event listners when scope is destroyed
        $scope.$on( 'destroy', serveRefresh );

        
    }

]);
