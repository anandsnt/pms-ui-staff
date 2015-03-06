sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    'RVReportUtilsFac',
    function($scope, $rootScope, $filter, RVreportsSrv, reportUtils) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller('report-list-scroll', {
            preventDefault: false
        });

        /**
         * inorder to refresh after list rendering
         */
        $scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event) {
            $scope.refreshScroller('report-list-scroll');
        });

        /**
         * This method helps to populate the markets filter in the reports for the Report and Summary Filter
         */
        var populateMarketsList = function() {
            var callback = function(data) {
                $scope.reportsState.markets = data;
                $scope.$emit('hideLoader');
            }
            $scope.invokeApi(RVreportsSrv.fetchDemographicMarketSegments, {}, callback);
        }

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
                    'guaranteeTypes': $scope.$parent.guaranteeTypes
                });

                // to process the sort_by for this report
                reportUtils.processSortBy( reportList[i] );

                // to reorder & map the sort_by to report details columns - for this report
                reportUtils.reOrderSortBy( reportList[i] );

                // to assign inital date values for this report
                reportUtils.initDateValues( reportList[i] );




                // CICO-10202 start populating the markets list
                if ( reportList[i]['title'] == 'Booking Source & Market Report' ) {
                    populateMarketsList();
                };


                // CICO-8010: for Yotel make "date" default sort by filter
                if ($rootScope.currentHotelData == 'Yotel London Heathrow') {
                    var sortDate = _.find(reportList[i].sortByOptions, function(item) {
                        return item.value === 'DATE';
                    });
                    if (!!sortDate) {
                        reportList[i].chosenSortBy = sortDate.value;
                    };
                };

                // call atleast once
                $scope.fauxOptionClicked(null, reportList[i]);
            };

            $scope.refreshScroller('report-list-scroll');
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

        $scope.sortByChanged = function(item) {
            var _sortBy;

            // un-select sort dir of others
            // and get a ref to the chosen item
            _.each(item.sortByOptions, function(each) {
                if (each && each.value != item.chosenSortBy) {
                    each.sortDir = undefined;
                } else if (each && each.value == item.chosenSortBy) {
                    _sortBy = each;
                }
            });

            // select sort_dir for chosen item
            if (!!_sortBy) {
                _sortBy.sortDir = true;
            };
        };


        // little helpers
        function $_createTimeSlots() {
            var _ret = [],
                _hh = '',
                _mm = '',
                _step = 15;

            var i = m = 0,
                h = -1;

            for (i = 0; i < 96; i++) {
                if (i % 4 == 0) {
                    h++;
                    m = 0;
                } else {
                    m += _step;
                }

                _hh = h < 10 ? '0' + h : h;
                _mm = m < 10 ? '0' + m : m;

                _ret.push({
                    'value': _hh + ':' + _mm,
                    'name': _hh + ':' + _mm
                });
            };

            return _ret;
        };


    }
]);
