sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    'RVReportUtilsFac',
    '$timeout',
    function($scope, $rootScope, $filter, RVreportsSrv, reportUtils, $timeout) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller('report-list-scroll', {
            preventDefault: false
        });

        /**
         * inorder to refresh after list rendering
         */
        $scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event) {
            $timeout($scope.refreshScroller.bind($scope, 'report-list-scroll'), 2001);
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
                    'codeSettings'   : $scope.$parent.codeSettings
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
                if ($rootScope.currentHotelData == 'Yotel London Heathrow') {
                    var sortDate = _.find(reportList[i].sortByOptions, function(item) {
                        return item.value === 'DATE';
                    });
                    if (!!sortDate) {
                        reportList[i].chosenSortBy = sortDate.value;
                    };
                };
            };

            $timeout($scope.refreshScroller.bind($scope, 'report-list-scroll'), 100);
        }($scope.$parent.reportList);

        // show hide filter toggle
        $scope.toggleFilter = function() {
            this.item.show_filter = this.item.show_filter ? false : true;
            $scope.refreshScroller('report-list-scroll');
        };

        $scope.setnGenReport = function() {
            RVreportsSrv.setChoosenReport(this.item);
            $scope.genReport();
        };

    }
]);
