sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    'RVReportUtilsFac',
    'RVReportMsgs',
    '$timeout',
    function($scope, $rootScope, $filter, reportsSrv, reportUtils, reportMsgs, $timeout) {

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
         *   Note: This is a self executing function
         *
         *   @param {Array} - reportList: which points to $scope.$parent.reportList, see end of this function
         */
        var postProcess = function(reportList) {
            for (var i = 0, j = reportList.length; i < j; i++) {

                // add icon class to this report
                reportUtils.applyIconClass( reportList[i] );

                // add required flags this report
                reportUtils.applyFlags( reportList[i] );



                // to process the filters for this report
                reportUtils.processFilters(reportList[i], {
                    'guaranteeTypes' : $scope.$parent.guaranteeTypes,
                    'chargeGroups'   : $scope.$parent.chargeGroups,
                    'chargeCodes'    : $scope.$parent.chargeCodes,
                    'markets'        : $scope.$parent.markets,
                    'sources'        : $scope.$parent.sources,
                    'origins'        : $scope.$parent.origins,
                    'codeSettings'   : $scope.$parent.codeSettings,
                    'holdStatus'     : $scope.$parent.holdStatus
                });



                // to reorder & map the sort_by to report details columns - for this report
                // re-order must be called before processing
                reportUtils.reOrderSortBy( reportList[i] );

                // to process the sort by for this report
                // processing must be called after re-odering
                reportUtils.processSortBy( reportList[i] );

                // to assign inital date values for this report
                reportUtils.initDateValues( reportList[i] );

                // to process the group by for this report
                reportUtils.processGroupBy( reportList[i] );




                // CICO-8010: for Yotel make "date" default sort by filter
                if ($rootScope.currentHotelData === 'Yotel London Heathrow') {
                    var sortDate = _.find(reportList[i].sortByOptions, function(item) {
                        return item.value === 'DATE';
                    });
                    if (!!sortDate) {
                        reportList[i].chosenSortBy = sortDate.value;
                    };
                };
            };

            // SUPER forcing scroll refresh!
            // 2000 is the delay for slide anim, so firing again after 2010
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 100 );
            $timeout( $scope.refreshScroller.bind($scope, LIST_ISCROLL_ATTR), 2010 );

        }($scope.$parent.reportList);

        // show hide filter toggle
        $scope.toggleFilter = function() {
            this.item.show_filter = this.item.show_filter ? false : true;
            $scope.refreshScroller( LIST_ISCROLL_ATTR );
        };

        $scope.setnGenReport = function() {
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
