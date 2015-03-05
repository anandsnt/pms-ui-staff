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

        // until date is business date and from date is a week ago
        // untill date fute is business date + 7, a week after
        var businessDate = $filter('date')($rootScope.businessDate, 'yyyy-MM-dd'),
            dateParts    = businessDate.match(/(\d+)/g),

            _year  = parseInt( dateParts[0] ),
            _month = parseInt( dateParts[1] ) - 1,
            _date  = parseInt( dateParts[2] ),

            fromDate        = new Date(_year, _month, _date - 7),
            untilDate       = new Date(_year, _month, _date),
            untilDateFuture = new Date(_year, _month, _date + 7),
            yesterDay       = new Date(_year, _month, _date - 1),

            hasFauxSelect      = false,
            hasDisplaySelect   = false,
            hasMarketSelect    = false,
            hasGuaranteeSelect = false;

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

            // re-cal just in case (totally useless in my opinon)
            businessDate = $filter('date')($rootScope.businessDate, 'yyyy-MM-dd');
            dateParts    = businessDate.match(/(\d+)/g);

            _year  = parseInt( dateParts[0] );
            _month = parseInt( dateParts[1] ) - 1;
            _date  = parseInt( dateParts[2] );

            fromDate        = new Date(_year, _month, _date - 7);
            untilDate       = new Date(_year, _month, _date);
            untilDateFuture = new Date(_year, _month, _date + 7);
            yesterDay       = new Date(_year, _month, _date - 1);

            hasFauxSelect      = false,
            hasDisplaySelect   = false,
            hasMarketSelect    = false,
            hasGuaranteeSelect = false;


            for (var i = 0, j = reportList.length; i < j; i++) {

                // limit what values the users can pick from datepicker
                reportList[i]['hasDateLimit'] = true;

                // add report icon class
                reportUtils.applyIconClass( reportList[i] );

                // add required flags this report
                reportUtils.applyFlags( reportList[i] );

                // CICO-10202 start populating the markets list
                if ( reportList[i]['title'] == 'Booking Source & Market Report' ) {
                    populateMarketsList();
                };

                reportList[i]['show_filter'] = false;

                // to process the report filters
                reportUtils.processFilters(reportList[i], {
                    'guaranteeTypes': $scope.$parent.guaranteeTypes
                });

                // sort by options - include sort direction
                if (reportList[i]['sort_fields'] && reportList[i]['sort_fields'].length) {
                    _.each(reportList[i]['sort_fields'], function(item, index, list) {
                        item['sortDir'] = undefined;
                        if (index == (list.length - 1)) {
                            item['colspan'] = 2;
                        };
                    });
                    reportList[i].sortByOptions = reportList[i]['sort_fields'];
                };

                // for (arrival, departure) report the sort by items must be
                // ordered in a specific way as per the design
                // [date - name - room] > TO > [room - name - date]
                if (reportList[i].title == 'Arrival' || reportList[i].title == 'Departure') {
                    var dateSortBy = angular.copy(reportList[i].sortByOptions[0]),
                        roomSortBy = angular.copy(reportList[i].sortByOptions[2]);

                    dateSortBy['colspan'] = 2;
                    roomSortBy['colspan'] = 0;

                    reportList[i].sortByOptions[0] = roomSortBy;
                    reportList[i].sortByOptions[2] = dateSortBy;
                };

                // for in-house report the sort by items must be
                // ordered in a specific way as per the design
                // [name - room] > TO > [room - name]
                if (reportList[i].title == 'In-House Guests') {
                    var nameSortBy = angular.copy(reportList[i].sortByOptions[0]),
                        roomSortBy = angular.copy(reportList[i].sortByOptions[1]);

                    nameSortBy['colspan'] = 2;
                    roomSortBy['colspan'] = 0;

                    reportList[i].sortByOptions[0] = roomSortBy;
                    reportList[i].sortByOptions[1] = nameSortBy;
                };

                // for Login and out Activity report
                // the colspans should be adjusted
                // the sort descriptions should be update to design
                //    THIS MUST NOT BE CHANGED IN BACKEND
                if (reportList[i].title == 'Login and out Activity') {
                    reportList[i].sortByOptions[0]['description'] = 'Date & Time';

                    reportList[i].sortByOptions[0]['colspan'] = 2;
                    reportList[i].sortByOptions[1]['colspan'] = 2;
                };


                // need to reorder the sort_by options
                // for deposit report in the following order
                if (reportList[i].title == 'Deposit Report') {
                    var reservationSortBy = angular.copy(reportList[i].sortByOptions[4]),
                        nameSortBy = angular.copy(reportList[i].sortByOptions[3]),
                        dateSortBy = angular.copy(reportList[i].sortByOptions[0]),
                        dueDateSortBy = angular.copy(reportList[i].sortByOptions[1]),
                        paidDateSortBy = angular.copy(reportList[i].sortByOptions[2]);

                    reportList[i].sortByOptions[0] = reservationSortBy;
                    reportList[i].sortByOptions[1] = nameSortBy;
                    reportList[i].sortByOptions[2] = dateSortBy;
                    reportList[i].sortByOptions[3] = null;
                    reportList[i].sortByOptions[4] = dueDateSortBy;
                    reportList[i].sortByOptions[5] = paidDateSortBy;
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

                // set the from and untill dates as business date (which is untilDate)
                if (reportList[i].title == 'Arrival' || reportList[i].title == 'Departure') {
                    reportList[i].fromDate = untilDate;
                    reportList[i].untilDate = untilDate;
                }
                // for deposit report the arrival dates
                // should be from today to +1 week
                else if (reportList[i].title == 'Deposit Report') {
                    reportList[i].fromArrivalDate = untilDate;
                    reportList[i].untilArrivalDate = untilDateFuture;

                    reportList[i].fromDepositDate = untilDate;
                    reportList[i].untilDepositDate = untilDate;
                } else if (reportList[i].title == 'Occupancy & Revenue Summary') {
                    //CICO-10202
                    reportList[i].fromDate = yesterDay;
                    reportList[i].untilDate = yesterDay;
                } else {
                    // set the from and untill dates
                    reportList[i].fromDate = fromDate;
                    reportList[i].fromCancelDate = fromDate;
                    reportList[i].fromArrivalDate = fromDate;
                    reportList[i].fromCreateDate = fromDate;

                    reportList[i].untilDate = untilDate;
                    reportList[i].untilCancelDate = untilDate;
                    reportList[i].untilArrivalDate = untilDate;
                    reportList[i].untilCreateDate = untilDate;
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
