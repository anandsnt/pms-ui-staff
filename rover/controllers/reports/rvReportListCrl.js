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

                // checking if has date filter
                reportList[i]['hasDateFilter'] = _.find(reportList[i]['filters'], function(item) {
                    return item.value === 'DATE_RANGE';
                });

                // checking if has time filter
                reportList[i]['hasTimeFilter'] = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'TIME_RANGE';
                });
                if ( !!reportList[i]['hasTimeFilter'] ) {
                    reportList[i]['hasTimeFilter'] = true;
                    reportList[i]['timeFilterOptions'] = $_createTimeSlots();
                };

                // checking if has cico filter
                // TODO: addiing the 'cicoOptions' can be done on server and provided as such
                reportList[i]['hasCicoFilter'] = _.find(reportList[i]['filters'], function(item) {
                    return item.value === 'CICO';
                });
                if ( reportList[i]['hasCicoFilter'] ) {
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

                // checking if has include notes
                reportList[i]['hasIncludeNotes'] = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'INCLUDE_NOTES';
                });

                // checking if has include vip
                reportList[i]['hasIncludeVip'] = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'VIP_ONLY';
                });

                // checking if has include cancelled
                reportList[i]['hasIncludeCancelled'] = _.find($scope.reportList[i]['filters'], function(item) {
                    return item.value === 'INCLUDE_CANCELED';
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

                // // CICO-8010: for Yotel make "date" default sort by filter
                // sortDate = _.find(reportList[i]['sort_fields'], function(item) {
                //     return item.value === 'DATE';
                // });
                // if ( !!sortDate ) {
                //     reportList[i].chosenSortBy = sortDate.value;
                // };
                
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