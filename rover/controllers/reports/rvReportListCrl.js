sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    function($scope, $rootScope, $filter, RVreportsSrv) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller( 'report-list-scroll', {preventDefault: false} );

        /**
        *   Post processing fetched data to modify and add additional data
        *   Note: This is a self executing function
        *   
        *   @param {Array} - reportList: which points to $scope.$parent.reportList, see end of this function
		*/
		var postProcess = function(reportList) {
            var hasDateFilter,
                hasTimeFilter,
                hasCicoFilter,
                hasUserFilter,
                hasSortDate,
                hasSortUser,
                hasIncludeNotes,
                hasIncludeVip,
                hasIncludeCancelled;

            // until date is business date and from date is a week ago
            var businessDate = $filter('date')($rootScope.businessDate, 'yyyy-MM-dd'),
                dateParts    = businessDate.match(/(\d+)/g),
                fromDate     = new Date(dateParts[0], dateParts[1] - 1, dateParts[2] - 7),
                untilDate    = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

            for (var i = 0, j = reportList.length; i < j; i++) {

                // add report icon class
                switch (reportList[i]['title']) {
                    case 'Check In / Check Out':
                        reportList[i]['reportIconCls'] = 'icon-check-in-check-out';
                        break;

                    case 'Upsell':
                        reportList[i]['reportIconCls'] = 'icon-upsell';
                        break;

                    case 'Late Check Out':
                        reportList[i]['reportIconCls'] = 'icon-late-check-out';
                        break;

                    case 'Web Check Out Conversion':
                        reportList[i]['reportIconCls'] = 'icon-check-out';
                        break;

                    case 'Web Check In Conversion':
                        reportList[i]['reportIconCls'] = 'icon-check-in';
                        break;

                    case 'In-House Guests':
                        reportList[i]['reportIconCls'] = 'guest-status inhouse';
                        break;

                    case 'Arrival':
                        reportList[i]['reportIconCls'] = 'guest-status check-in';
                        break;

                    case 'Departure':
                        reportList[i]['reportIconCls'] = 'guest-status check-out';
                        break;

                    case 'Cancelation & No Show':
                        reportList[i]['reportIconCls'] = 'guest-status cancel';
                        break;

                    default:
                        reportList[i]['reportIconCls'] = '';
                        break;
                };

                reportList[i]['show_filter'] = false;

                // going around and taking a note on filtes
                _.each(reportList[i]['filters'], function(item) {
                    
                    // check for date filter and keep a ref to that item
                    if ( item.value === 'DATE_RANGE' ) {
                        reportList[i]['hasDateFilter'] = item;
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
                    };

                    // check for vip filter and keep a ref to that item
                    if ( item.value === 'VIP_ONLY' ) {
                        reportList[i]['hasIncludeVip'] = item;
                    };

                    // check for include cancelled filter and keep a ref to that item
                    if ( item.value === 'INCLUDE_CANCELED' ) {
                        reportList[i]['hasIncludeCancelled'] = item;
                    };
                });

                // sort by options
                reportList[i].sortByOptions = reportList[i]['sort_fields'];
                if ( reportList[i].sortByOptions && reportList[i]['sort_fields'].length ) {
                    for (var k = 0, l = reportList[i].sortByOptions.length; k < l; k++) {
                        reportList[i].sortByOptions[k]['sortDir'] = undefined;
                        if ( k == l - 1 ) {
                            reportList[i].sortByOptions[k]['colspan'] = 2;
                        };
                    };
                };

                // CICO-8010: for Yotel make "date" default sort by filter
                if ( $rootScope.currentHotelData == 'Yotel London Heathrow' ) {
                    var sortDate = _.find(reportList[i]['sort_fields'], function(item) {
                        return item.value === 'DATE';
                    });
                    if ( !!sortDate ) {
                        reportList[i].chosenSortBy = sortDate.value;
                    };
                };
                
                // set the from and untill dates
                reportList[i].fromDate = fromDate;
                reportList[i].untilDate = untilDate;
            }

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