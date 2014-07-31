sntRover.controller('RVReportListCrl', [
	'$scope',
	function($scope) {

		/**
		*	Post processing data to modify and add additional data
		*	This is a self executing function
		*/
		var postProcessReportList = function() {
			var reportList = $scope.$parent.reportList,
				hasDateFilter,
				hasCicoFilter,
				hasUserFilter,
				hasSortDate,
				hasSortUser;

			for (var i = 0, j = reportList.length; i < j; i++) {

				// add report icon class
				if ( reportList[i]['title'] == 'Upsell' ) {
				    reportList[i]['reportIconCls'] = 'icon-upsell';
				} else if ( reportList[i]['title'] == 'Late Check Out' ) {
				    reportList[i]['reportIconCls'] = 'icon-late-check-out';
				} else {
				    reportList[i]['reportIconCls'] = 'icon-check-in-check-out';
				}

				// include show_filter and set it to false
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
			}
		}();

		// show hide filter toggle
		$scope.toggleFilter = function() {
		    this.item.show_filter = this.item.show_filter ? false : true;
		};
	}
]);