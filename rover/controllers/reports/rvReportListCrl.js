sntRover.controller('RVReportListCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVreportsSrv',
    function($scope, $rootScope, $filter, RVreportsSrv) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller( 'report-list-scroll', {click: true, preventDefault: false} );

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
				hasSortUser;


            // until date is business date and from date is a week ago
            var businessDate = $filter('date')($rootScope.businessDate, 'yyyy-MM-dd'),
                dateParts    = businessDate.match(/(\d+)/g),
                fromDate     = new Date(dateParts[0], dateParts[1] - 1, dateParts[2] - 7),
                untilDate    = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

			for (var i = 0, j = reportList.length; i < j; i++) {

				// add report icon class
                if ( reportList[i]['title'] == 'Upsell' ) {
                    reportList[i]['reportIconCls'] = 'icon-upsell';
                } else if ( reportList[i]['title'] == 'Late Check Out' ) {
                    reportList[i]['reportIconCls'] = 'icon-late-check-out';
                } else {
                    reportList[i]['reportIconCls'] = 'icon-check-in-check-out';
                }

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

                // CICO-8010: for Yotel make "date" default sort by filter
                sortDate = _.find(reportList[i]['sort_fields'], function(item) {
                    return item.value === 'DATE';
                });
                reportList[i].chosenSortBy = sortDate.value;

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