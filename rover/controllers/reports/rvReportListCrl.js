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
				hasCicoFilter,
				hasUserFilter,
				hasSortDate,
				hasSortUser,
                hasIncludeNotes,
                hasIncludeVip;

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
                        reportList[i]['reportIconCls'] = 'inhouse';
                        break;

                    default:
                        reportList[i]['reportIconCls'] = '';
                        break;
                };

                reportList[i]['show_filter'] = false;

                for (var i = 0, j = reportList[i]['filters'].length; i < j; i++) {
                    var filter = reportList[i]['filters'];

                    // checking if has date filter
                    if ( filter.value === 'DATE_RANGE' ) {
                        reportList[i]['hasDateFilter'] = true;
                    };

                    // checking if has cico filter
                    if ( filter.value === 'CICO' ) {
                        reportList[i]['hasCicoFilter'] = true;
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
                    if ( filter.value === 'USER' ) {
                        reportList[i]['hasUserFilter'] = true;
                    };

                    // checking if include notes filter
                    if ( filter.value === 'INCLUDE_NOTES' ) {
                        reportList[i]['hasIncludeNotes'] = true;
                    };

                    // checking if include notes filter
                    if ( filter.value === 'VIP_ONLY' ) {
                        reportList[i]['hasIncludeVip'] = true;
                    };
                };

                // sort by options
                reportList[i].sortByOptions = reportList[i]['sort_fields']

                // CICO-8010: for Yotel make "date" default sort by filter
                sortDate = _.find(reportList[i]['sort_fields'], function(item) {
                    return item.value === 'DATE';
                });
                if ( !!sortDate ) {
                    reportList[i].chosenSortBy = sortDate.value;
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
    }
]);