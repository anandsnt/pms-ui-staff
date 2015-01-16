sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    function($scope, $rootScope, $filter, RVreportsSrv) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller( 'report-list-scroll', {preventDefault: false} );

        // until date is business date and from date is a week ago
        var businessDate  = $filter('date')($rootScope.businessDate, 'yyyy-MM-dd'),
            dateParts     = businessDate.match(/(\d+)/g),
            fromDate      = new Date(dateParts[0], dateParts[1] - 1, dateParts[2] - 7),
            untilDate     = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]),
            hasFauxSelect = false,
            hasDisplaySelect= false;

        /**
        * inorder to refresh after list rendering
        */
        $scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event){            
            $scope.refreshScroller( 'report-list-scroll');
        });

        /**
        *   Post processing fetched data to modify and add additional data
        *   Note: This is a self executing function
        *   
        *   @param {Array} - reportList: which points to $scope.$parent.reportList, see end of this function
		*/
		var postProcess = function(reportList) {

            // re-cal just it case (totally useless in my opinon)
            businessDate  = $filter('date')($rootScope.businessDate, 'yyyy-MM-dd');
            dateParts     = businessDate.match(/(\d+)/g);
            fromDate      = new Date(dateParts[0], dateParts[1] - 1, dateParts[2] - 7);
            untilDate     = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            hasFauxSelect = false;

            for (var i = 0, j = reportList.length; i < j; i++) {

                // limit what values the users can pick from datepicker
                reportList[i]['hasDateLimit'] = true;

                // add report icon class
                switch (reportList[i]['title']) {
                    case 'Check In / Check Out':
                        reportList[i]['reportIconCls'] = 'icon-report icon-check-in-check-out';
                        break;

                    case 'Upsell':
                        reportList[i]['reportIconCls'] = 'icon-report icon-upsell';
                        break;

                    case 'Web Check Out Conversion':
                        reportList[i]['reportIconCls'] = 'icon-report icon-check-out';
                        break;

                    case 'Web Check In Conversion':
                        reportList[i]['reportIconCls'] = 'icon-report icon-check-in';
                        break;

                    case 'Late Check Out':
                        reportList[i]['reportIconCls'] = 'guest-status late-check-out';
                        break;

                    case 'In-House Guests':
                        reportList[i]['reportIconCls'] = 'guest-status inhouse';
                        break;

                    case 'Arrival':
                        reportList[i]['reportIconCls'] = 'guest-status check-in';
                        reportList[i]['hasDateLimit']  = false;
                        break;

                    case 'Departure':
                        reportList[i]['reportIconCls'] = 'guest-status check-out';
                        reportList[i]['hasDateLimit']  = false;
                        break;

                    case 'Cancelation & No Show':
                        reportList[i]['reportIconCls'] = 'guest-status cancel';
                        reportList[i]['hasDateLimit']  = false;
                        reportList[i]['canRemoveDate'] = true;
                        reportList[i]['showRemove']    = true;
                        break;

                    case 'Booking Source & Market Report':
                        reportList[i]['reportIconCls'] = 'icon-report icon-booking';
                        reportList[i]['hasSourceMarketFilter'] = true;                        
                    break;

                    default:
                        reportList[i]['reportIconCls'] = 'icon-report';                        
                        break;
                };

                reportList[i]['show_filter'] = false;

                // going around and taking a note on filtes
                _.each(reportList[i]['filters'], function(item) {
                    
                    // check for date filter and keep a ref to that item
                    if ( item.value === 'DATE_RANGE' ) {
                        reportList[i]['hasDateFilter'] = item;

                        // for 'Cancelation & No Show' report the description should be 'Arrival Date Range'
                        // rather than the default 'Date Range'
                        if ( reportList[i]['title'] == 'Cancelation & No Show' ) {
                            reportList[i]['hasDateFilter']['description'] = 'Arrival Date Range';
                        };

                        // for 'Booking Source & Market Report' report the description should be 'Booked Date'
                        if ( reportList[i]['title'] == 'Booking Source & Market Report' ) {
                            reportList[i]['hasDateFilter']['description'] = 'Booked Date';
                        };
                    };

                    // check for cancellation date filter and keep a ref to that item
                    if ( item.value === 'CANCELATION_DATE_RANGE' ) {
                        reportList[i]['hasCancelDateFilter'] = item;
                    };

                    // check for arrival date filter and keep a ref to that item (introduced in 'Booking Source & Market Report' filters)
                    if ( item.value === 'ARRIVAL_DATE_RANGE' ) {
                        reportList[i]['hasArrivalDateFilter'] = item;
                    };

                    // check for time filter and keep a ref to that item
                    // create std 15min stepped time slots
                    if ( item.value === 'TIME_RANGE' ) {
                        reportList[i]['hasTimeFilter']     = item;
                        reportList[i]['timeFilterOptions'] = $_createTimeSlots();
                    };

                    // check for CICO filter and keep a ref to that item
                    // create the CICO filter options
                    if ( item.value === 'CICO' ) {
                        reportList[i]['hasCicoFilter'] = item;
                        reportList[i]['cicoOptions'] = [{
                            value: 'BOTH',
                            label: 'Show Check Ins and  Check Outs'
                        }, {
                            value: 'IN',
                            label: 'Show only Check Ins'
                        }, {
                            value: 'OUT',
                            label: 'Show only Check Outs'
                        }];
                    };

                    // check for user filter and keep a ref to that item
                    if ( item.value === 'USER' ) {
                        reportList[i]['hasUserFilter'] = item;
                    };

                    // check for include notes filter and keep a ref to that item
                    if ( item.value === 'INCLUDE_NOTES' ) {
                        reportList[i]['hasIncludeNotes'] = item;
                        hasFauxSelect = true;
                    };

                    // check for vip filter and keep a ref to that item
                    if ( item.value === 'VIP_ONLY' ) {
                        reportList[i]['hasIncludeVip'] = item;
                        hasFauxSelect = true;
                    };

                    // check for source and markets filter
                    if ( item.value === 'INCLUDE_MARKET' ) {
                        reportList[i]['hasMarket'] = item;
                        hasDisplaySelect = true;
                    };

                    if ( item.value === 'INCLUDE_SOURCE' ) {
                        reportList[i]['hasSource'] = item;
                        hasDisplaySelect = true;
                    };


                    // check for include cancelled filter and keep a ref to that item
                    if ( item.value === 'INCLUDE_CANCELED' ) {
                        reportList[i]['hasIncludeCancelled'] = item;
                        hasFauxSelect = true;

                        if ( reportList[i].title == 'Cancelation & No Show' ) {
                            reportList[i]['chosenIncludeCancelled'] = true;
                        };
                    };

                    // check for include no show filter and keep a ref to that item
                    if ( item.value === 'INCLUDE_NO_SHOW' ) {
                        reportList[i]['hasIncludeNoShow'] = item;
                        hasFauxSelect = true;
                    };
                });

                // NEW! faux select DS and logic
                if ( hasFauxSelect ) {
                    reportList[i]['fauxSelectOpen'] = false;
                    reportList[i]['fauxTitle']      = 'Select';
                };

                if(hasDisplaySelect) {
                    reportList[i]['selectDisplayOpen'] = false;
                    reportList[i]['displayTitle']      = 'Select';
                };

                // sort by options
                if ( reportList[i]['sort_fields'] && reportList[i]['sort_fields'].length ) {
                    _.each(reportList[i]['sort_fields'], function(item, index, list) {
                        item['sortDir'] = undefined;
                        if ( index == (list.length - 1) ) {
                            item['colspan'] = 2;
                        };
                    });
                    reportList[i].sortByOptions = reportList[i]['sort_fields'];
                };

                // for (arrival, departure) report the sort by items must be
                // ordered in a specific way as per the design
                // [date - name - room] > TO > [room - name - date]
                if ( reportList[i].title == 'Arrival' || reportList[i].title == 'Departure' ) {
                    var dateSortBy = angular.copy( reportList[i].sortByOptions[0] ),
                        roomSortBy = angular.copy( reportList[i].sortByOptions[2] );

                    dateSortBy['colspan'] = 2;
                    roomSortBy['colspan'] = 0;

                    reportList[i].sortByOptions[0] = roomSortBy;
                    reportList[i].sortByOptions[2] = dateSortBy;
                };

                // for in-house report the sort by items must be
                // ordered in a specific way as per the design
                // [name - room] > TO > [room - name]
                if ( reportList[i].title == 'In-House Guests' ) {
                    var nameSortBy = angular.copy( reportList[i].sortByOptions[0] ),
                        roomSortBy = angular.copy( reportList[i].sortByOptions[1] );

                    nameSortBy['colspan'] = 2;
                    roomSortBy['colspan'] = 0;

                    reportList[i].sortByOptions[0] = roomSortBy;
                    reportList[i].sortByOptions[1] = nameSortBy;
                };

                // CICO-8010: for Yotel make "date" default sort by filter
                if ( $rootScope.currentHotelData == 'Yotel London Heathrow' ) {
                    var sortDate = _.find(reportList[i].sortByOptions, function(item) {
                        return item.value === 'DATE';
                    });
                    if ( !!sortDate ) {
                        reportList[i].chosenSortBy = sortDate.value;
                    };
                };
                
                // set the from and untill dates as business date (which is untilDate)
                if ( reportList[i].title == 'Arrival' || reportList[i].title == 'Departure' ) {
                    reportList[i].fromDate  = untilDate;
                    reportList[i].untilDate = untilDate;
                } else {
                    // set the from and untill dates
                    reportList[i].fromDate        = fromDate;
                    reportList[i].fromCancelDate  = fromDate;
                    reportList[i].fromArrivalDate  = fromDate;
                    reportList[i].untilDate       = untilDate;
                    reportList[i].untilCancelDate = untilDate;
                    reportList[i].untilArrivalDate = untilDate;
                };
            };

            $scope.refreshScroller( 'report-list-scroll' );
        }( $scope.$parent.reportList );

        // show hide filter toggle
        $scope.toggleFilter = function() {
            this.item.show_filter = this.item.show_filter ? false : true;
            $scope.refreshScroller( 'report-list-scroll' );
        };

        $scope.setnGenReport = function() {
            RVreportsSrv.setChoosenReport( this.item );
            $scope.genReport();
        };


        // little helpers
        function $_createTimeSlots () {
            var _ret  = [],
                _hh   = '',
                _mm   = '',
                _step = 15;

            var i = m = 0,
                h = -1;

            for (i = 0; i < 96; i++) {
                if ( i % 4 == 0 ) {
                    h++;
                    m = 0;
                } else {
                    m += _step;
                }

                _hh = h < 10 ? '0' + h : h;
                _mm = m < 10 ? '0' + m : m;

                _ret.push({
                    'value' : _hh + ':' + _mm,
                    'name' : _hh + ':' + _mm
                });
            };

            return _ret;
        };


    }
]);