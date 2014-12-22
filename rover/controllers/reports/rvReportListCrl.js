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

                    default:
                        reportList[i]['reportIconCls'] = '';
                        break;
                };

                reportList[i]['show_filter'] = false;

                // checking if has date filter
                hasDateFilter = _.find(reportList[i]['filters'], function(item) {
                    return item.value === 'DATE_RANGE';
                });
                reportList[i]['hasDateFilter'] = hasDateFilter ? true : false;

                // checking if has cico filter
                // TODO: addiing the 'cicoOptions' can be done on server and provided as such
                hasCicoFilter = _.find(reportList[i]['filters'], function(item) {
                    return item.value === 'CICO';
                });
                reportList[i]['hasCicoFilter'] = hasCicoFilter ? true : false;
                if (hasCicoFilter) {
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

                // checking if has user filter
                hasUserFilter = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'USER';
                });
                reportList[i]['hasUserFilter'] = hasUserFilter ? true : false;

                // sort by options
                reportList[i].sortByOptions = reportList[i]['sort_fields']

                // // CICO-8010: for Yotel make "date" default sort by filter
                // sortDate = _.find(reportList[i]['sort_fields'], function(item) {
                //     return item.value === 'DATE';
                // });
                // if ( !!sortDate ) {
                //     reportList[i].chosenSortBy = sortDate.value;
                // };

                hasIncludeNotes = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'INCLUDE_NOTES';
                });
                reportList[i]['hasIncludeNotes'] = hasIncludeNotes ? true : false;

                hasIncludeVip = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'VIP_ONLY';
                });
                reportList[i]['hasIncludeVip'] = hasIncludeVip ? true : false;

                hasIncludeCancelled = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'INCLUDE_CANCELED';
                });
                reportList[i]['hasIncludeCancelled'] = hasIncludeCancelled ? true : false;

                hasTimeFilter = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'TIME_RANGE';
                });
                reportList[i]['hasTimeFilter'] = hasTimeFilter ? true : false;
                if ( !!hasTimeFilter ) {
                    reportList[i]['hasTimeFilter'] = true;
                    reportList[i]['timeFilterOptions'] = $_createTimeSlots();
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