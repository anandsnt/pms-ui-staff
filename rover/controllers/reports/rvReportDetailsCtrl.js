sntRover.controller('RVReportDetailsCtrl', [
	'$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    '$window',
    'RVreportsSrv',
	'RVReportUtilsFac',
	'RVReportParserFac',
	'ngDialog',
	function($scope, $rootScope, $filter, $timeout, $window, RVreportsSrv, reportUtils, reportParser, ngDialog) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller( 'report-details-scroll', {click: true, preventDefault: false} );
		$scope.setScroller( 'report-filter-sidebar-scroll' );

		var refreshScroll = function() {
			if ( !!$scope.$parent.myScroll['report-details-scroll'] ) {
				$scope.refreshScroller( 'report-details-scroll' );
				$scope.$parent.myScroll['report-details-scroll'].scrollTo(0, 0, 100);
			};
		};

		var refreshSidebarScroll = function() {
			if ( !!$scope.$parent.myScroll['report-filter-sidebar-scroll'] ) {
				$scope.refreshScroller( 'report-filter-sidebar-scroll' );
			};
		};


		var $_pageNo = 1;
		var $_resultsPerPage = 25;


        /**
        * inorder to refresh after list rendering
        */
        $scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event){
            refreshScroll();
        });

		$scope.parsedApiFor = undefined;
		$scope.currencySymbol = $rootScope.currencySymbol;

		// ref to parents for filter item toggles
		$scope.filterItemsToggle = $scope.$parent.filterItemsToggle;
		$scope.toggleFilterItems = function(item) {
			if ( item ) {
				$scope.$parent.toggleFilterItems(item);
			};
			refreshSidebarScroll();
		};


		// common methods to do things after fetch report
		var afterFetch = function() {
			var totals          = $scope.$parent.totals,
				headers         = $scope.$parent.headers,
				subHeaders      = $scope.$parent.subHeaders,
				results         = $scope.$parent.results,
				resultsTotalRow = $scope.$parent.resultsTotalRow;


			$scope.chosenReport = RVreportsSrv.getChoosenReport();

			$scope.setTitle( $scope.chosenReport.title + ' ' + ($scope.chosenReport.sub_title ? $scope.chosenReport.sub_title : '') );
			$scope.$parent.heading = $scope.chosenReport.title + ' ' + ($scope.chosenReport.sub_title ? $scope.chosenReport.sub_title : '');

			// reset this
			$scope.parsedApiFor = undefined;

			// reset flags
			$scope.isGuestReport = false;
			$scope.isLargeReport = false;
			$scope.isLogReport   = false;
			$scope.hasNoSorting  = false;
			$scope.hasNoTotals   = false;
			$scope.showSortBy    = true;
			$scope.hasPagination = true;
			$scope.isTransactionReport = false;

			switch ( $scope.chosenReport.title ) {
				case reportUtils.getName('IN_HOUSE_GUEST'):
				case reportUtils.getName('DEPARTURE'):
				case reportUtils.getName('ARRIVAL'):
				case reportUtils.getName('DEPOSIT_REPORT'):
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.showSortBy = false;
					break;

				case reportUtils.getName('CANCELLATION_NO_SHOW'):
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.hasNoSorting = true;
					$scope.showSortBy = false;
					break;

				case reportUtils.getName('LOGIN_AND_OUT_ACTIVITY'):
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.isLogReport = true;
					$scope.showSortBy = false;
					break;

				case reportUtils.getName('RESERVATIONS_BY_USER'):
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					break;

				case reportUtils.getName('LATE_CHECK_OUT'):
					$scope.hasNoTotals = true;
					break;

				case reportUtils.getName('CHECK_IN_CHECK_OUT'):
					if ( $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'OUT' ) {
						$scope.hasNoTotals = true;
					};
					break;

				case reportUtils.getName('WEB_CHECK_IN_CONVERSION'):
				case reportUtils.getName('WEB_CHECK_OUT_CONVERSION'):
				case reportUtils.getName('MARKET_SEGMENT_STATISTICS_REPORT'):
					$scope.isLargeReport = true;
					break;

				case reportUtils.getName('BOOKING_SOURCE_MARKET_REPORT'):
					$scope.hasPagination = false;
					break;

				case reportUtils.getName('DAILY_TRANSACTIONS'):
				case reportUtils.getName('DAILY_PAYMENTS'):
					$scope.hasNoTotals = true;
					$scope.isTransactionReport = true;
					break;

				default:
					break;
			};


			// hack to set the colspan for reports details tfoot
			switch ( $scope.chosenReport.title ) {
				case reportUtils.getName('CHECK_IN_CHECK_OUT'):
					if ( $scope.chosenReport.chosenCico === 'BOTH' ) {
						$scope.leftColSpan = 6;
						$scope.rightColSpan = 5;
					} else {
						$scope.leftColSpan = 4;
						$scope.rightColSpan = 5;
					}
					break;

				case reportUtils.getName('UPSELL'):
					$scope.leftColSpan = 5;
					$scope.rightColSpan = 5;
					break;

				case reportUtils.getName('LOGIN_AND_OUT_ACTIVITY'):
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 3;
					break;

				case reportUtils.getName('DEPARTURE'):
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 3;
					break;

				case reportUtils.getName('ARRIVAL'):
				case reportUtils.getName('IN_HOUSE_GUEST'):
				case reportUtils.getName('DEPOSIT_REPORT'):
				case reportUtils.getName('RESERVATIONS_BY_USER'):
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 4;
					break;

				case reportUtils.getName('CANCELLATION_NO_SHOW'):
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 3;
					break;

				case reportUtils.getName('DAILY_TRANSACTIONS'):
				case reportUtils.getName('DAILY_PAYMENTS'):
					$scope.leftColSpan = 5;
					$scope.rightColSpan = 5;
					break;

				case reportUtils.getName('WEB_CHECK_IN_CONVERSION'):
				case reportUtils.getName('WEB_CHECK_OUT_CONVERSION'):
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 8;
					break;

				case reportUtils.getName('ROOMS_QUEUED'):
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 3;
					break;

				case reportUtils.getName('FORECAST_BY_DATE'):
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 4;
					break;

				case reportUtils.getName('FORECAST_GUEST_GROUPS'):
					$scope.leftColSpan = 6;
					$scope.rightColSpan = 7;
					break;

				case reportUtils.getName('MARKET_SEGMENT_STATISTICS_REPORT'):
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 8;
					break;

				case reportUtils.getName('COMPARISION_BY_DATE'):
					$scope.leftColSpan = 4;
					$scope.rightColSpan = 4;
					break;

				default:
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 2;
					break;
			};




			// for hard coding styles for report headers
			// if the header count is greater than 4
			// split it up into two parts
			// NOTE: this implementation may need mutation if in future style changes
			// NOTE: this implementation also effects template, depending on design
			// discard previous values
			$scope.firstHalf = [];
			$scope.firstHalf = [];

			// making unique copies of array
			// slicing same array not good.
			// say thanks to underscore.js
			$scope.firstHalf = _.compact( totals );
			$scope.restHalf  = _.compact( totals );

			// now lets slice it half and half in order that each have atmost 4
			// since "Web Check Out Conversion" this check is required
			if ( $scope.chosenReport.title === reportUtils.getName('WEB_CHECK_IN_CONVERSION') || $scope.chosenReport.title === reportUtils.getName('WEB_CHECK_OUT_CONVERSION') ) {
				$scope.firstHalf = $scope.firstHalf.slice( 0, 3 );
				$scope.restHalf  = $scope.restHalf.slice( 3 );
			} else if ( $scope.chosenReport.title === reportUtils.getName('CHECK_IN_CHECK_OUT') ) {
				$scope.firstHalf = $scope.firstHalf.slice( 0, 5 );
				$scope.restHalf  = $scope.restHalf.slice( 5 );
				$scope.restHalf.reverse();
			} else {
				$scope.firstHalf = $scope.firstHalf.slice( 0, 4 );
				$scope.restHalf  = $scope.restHalf.slice( 4 );
			}


			// now applying some very special and bizzare
			// cosmetic effects for reprots only
			// NOTE: direct dependecy on template
			if ( $scope.chosenReport.title === reportUtils.getName('CHECK_IN_CHECK_OUT') ) {
			    if ( $scope.firstHalf[0] ) {
			        $scope.firstHalf[0]['class'] = 'green';

			        // extra hack
			        // if the chosenCico is 'OUT'
			        // class must be 'red'
			        if ( $scope.chosenReport.chosenCico === 'OUT' ) {
			            $scope.firstHalf[0]['class'] = 'red';
			        }
			    };

				// since the rest half is reversed
				// the red needs ti be applied to the last item
				var restHalfLastIndex = $scope.restHalf.length - 1;
			    if ( $scope.restHalf[restHalfLastIndex] ) {
			        $scope.restHalf[restHalfLastIndex]['class'] = 'red';
			    };
			} else {
			    // NOTE: as per todays style this applies to Late Check Out' only
			    if ( $scope.firstHalf[1] ) {
			        $scope.firstHalf[1]['class'] = 'orange';

			        // hack to add ($) currency in front
			        if ( $scope.chosenReport.title === reportUtils.getName('LATE_CHECK_OUT') ) {
			            $scope.firstHalf[1]['value'] = $rootScope.currencySymbol + $scope.firstHalf[1]['value'];
			        };
			    };

			    // additional condition for "Web Check Out Conversion"
			    if ( $scope.chosenReport.title === reportUtils.getName('WEB_CHECK_IN_CONVERSION') || $scope.chosenReport.title === reportUtils.getName('WEB_CHECK_OUT_CONVERSION') ) {
			    	$scope.restHalf[$scope.restHalf.length - 1]['class'] = 'orange';
			    };
			};


			// change date format for all
			for (var i = 0, j = results.length; i < j; i++) {
			    results[i][0] = $filter('date')(results[i][0], $rootScope.dateFormat);

			    if ( $scope.chosenReport.title === reportUtils.getName('LATE_CHECK_OUT') ) {

			        // hack to add curency ($) symbol in front of values
			        results[i][ results[i].length - 1 ] = $rootScope.currencySymbol + results[i][ results[i].length - 1 ];

			        // hack to append ':00 PM' to time
			        // thus makin the value in template 'X:00 PM'
			        results[i][ results[i].length - 2 ] += ':00 PM';
			    }
			};


			// hack to edit the title 'LATE CHECK OUT TIME' to 'SELECTED LATE CHECK OUT TIME'
			// notice the text case, they are as per api response and ui
			if ( $scope.chosenReport.title === reportUtils.getName('LATE_CHECK_OUT') ) {
			    for (var i = 0, j = headers.length; i < j; i++) {
			        if ( headers[i] === 'Late Check Out Time' ) {
			            headers[i] = 'Selected Late Check Out Time';
			            break;
			        };
			    };
			};

			// scroller refresh and reset position
			$timeout(function () {
				refreshScroll();
				refreshSidebarScroll();
			}, 200);

			// new more detailed reports
			$scope.parsedApiFor = $scope.chosenReport.title;

			var parseAPIoptions = {
				'groupedByKey'    : $scope.$parent.reportGroupedBy,
				'checkNote'       : $scope.chosenReport.chosenOptions['include_notes'],
				'checkGuest'      : $scope.chosenReport.chosenOptions['show_guests'],
				'checkCancel'     : $scope.chosenReport.chosenOptions['include_cancelled'] || $scope.chosenReport.chosenOptions['include_cancelled'],
				'checkRateAdjust' : $scope.chosenReport.chosenOptions['show_rate_adjustments_only']
			};

			// $scope.$parent.results = angular.copy( $_parseApiToTemplate(results) );
			$scope.$parent.results = angular.copy( reportParser.parseAPI($scope.parsedApiFor, $scope.$parent.results, parseAPIoptions) );

			// if there are any results
			$scope.hasNoResults = _.isEmpty($scope.$parent.results);


			// a very different parent template / row template / content template for certain reports
			// otherwise they all will share the same template
			switch ( $scope.parsedApiFor ) {
				case reportUtils.getName('UPSELL'):
					$scope.hasReportTotals    = true;
					$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/upsellReport/rvUpsellReport.html';
					break;

				case reportUtils.getName('BOOKING_SOURCE_MARKET_REPORT'):
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = !_.isEmpty($scope.$parent.results.market) || !_.isEmpty($scope.$parent.results.source) ? true : false;
					$scope.detailsTemplateUrl = '/assets/partials/reports/rvMarketSourceReport.html';
					break;

				case reportUtils.getName('OCCUPANCY_REVENUE_SUMMARY'):
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/rvOccupancyRevenueReport.html';
					break;

				case reportUtils.getName('RESERVATIONS_BY_USER'):
					if ( !!$scope.$parent.reportGroupedBy ) {
						$scope.hasReportTotals    = true;
						$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
						$scope.detailsTemplateUrl = '/assets/partials/reports/rvReservationByUserReport.html';
					} else {
						$scope.hasReportTotals    = true;
						$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
						$scope.detailsTemplateUrl = '/assets/partials/reports/rvCommonReportDetails.html';
					};
					break;

				case reportUtils.getName('FORECAST_BY_DATE'):
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/rvForecastReport.html';
					break;

				case reportUtils.getName('FORECAST_GUEST_GROUPS'):
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/rvForecastGuestGroupReport.html';
					break;

				case reportUtils.getName('MARKET_SEGMENT_STATISTICS_REPORT'):
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/rvMarketSegmentStatReport.html';
					break;

				case reportUtils.getName('COMPARISION_BY_DATE'):
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/comparisonStatReport/rvComparisonStatReport.html';
					break;

				default:
					$scope.hasReportTotals    = true;
					$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/rvCommonReportDetails.html';
					break;
			};
		};


		$scope.parsedApiTemplate = function() {
			var template = '';

			switch ($scope.parsedApiFor) {
				case reportUtils.getName('IN_HOUSE_GUEST'):
					template = '/assets/partials/reports/rvInHouseReportRow.html';
					break;

				case reportUtils.getName('DEPARTURE'):
					template = '/assets/partials/reports/rvDepartureReportRow.html';
					break;

				case reportUtils.getName('ARRIVAL'):
					template = '/assets/partials/reports/rvArrivalReportRow.html';
					break;

				case reportUtils.getName('CANCELLATION_NO_SHOW'):
					template = '/assets/partials/reports/rvCancellationReportRow.html';
					break;

				case reportUtils.getName('LOGIN_AND_OUT_ACTIVITY'):
					template = '/assets/partials/reports/rvUserActivityReportRow.html';
					break;

				case reportUtils.getName('DEPOSIT_REPORT'):
					template = '/assets/partials/reports/rvDepositReportRow.html';
					break;

				case reportUtils.getName('RESERVATIONS_BY_USER'):
					template = '/assets/partials/reports/rvReservationByUserReportRow.html';
					break;

				case reportUtils.getName('DAILY_TRANSACTIONS'):
				case reportUtils.getName('DAILY_PAYMENTS'):
					template = '/assets/partials/reports/rvDailyTransactionsReportRow.html';
					break;

				case reportUtils.getName('FORECAST_BY_DATE'):
					template = '/assets/partials/reports/rvForecastByDateReportRow.html';
					break;

				case reportUtils.getName('ROOMS_QUEUED'):
					template = '/assets/partials/reports/rvRoomQueuedReportRow.html';
					break;

				case reportUtils.getName('FORECAST_GUEST_GROUPS'):
					template = '/assets/partials/reports/rvForecastGuestGroupReportRow.html';
					break;

				case reportUtils.getName('MARKET_SEGMENT_STATISTICS_REPORT'):
					template = '/assets/partials/reports/rvMarketSegmentStatReportRow.html';
					break;

				default:
					template = '/assets/partials/reports/rvCommonReportRow.html';
					break;
			};

			return template;
		};


		// simple method to allow checking for report title
		// from the template, even without making the entire reportUtils part of $scope
		$scope.isThisReport = function (name) {
			return reportUtils.getName(name) === $scope.parsedApiFor ? true : false;
		};



		// we are gonna need to drop some pagination
		// this is done only once when the report details is loaded
		// and when user updated the filters
		var calPagination = function(response, pageNum) {
			if ( ! $scope.hasPagination ) {
				return;
			};

			// clear old results and update total counts
			$scope.netTotalCount = $scope.$parent.totalCount;

			if ( typeof $scope.$parent.results === 'array' ) {
				$scope.uiTotalCount = $scope.$parent.results.length;
			} else if ( typeof $scope.$parent.results === 'object' ) {
				$scope.uiTotalCount = 0;
				_.each($scope.$parent.results, function(item) {
					if ( typeof item === 'array' ) {
						$scope.uiTotalCount += item.length;
					};
				});
			};

			if ( $scope.netTotalCount === 0 && $scope.uiTotalCount === 0 ) {
				$scope.disablePrevBtn = true;
				$scope.disableNextBtn = true;
			} else if ( $_pageNo === 1 ) {
				$scope.resultFrom = 1;
				$scope.resultUpto = $scope.netTotalCount < $_resultsPerPage ? $scope.netTotalCount : $_resultsPerPage;
				$scope.disablePrevBtn = true;
				$scope.disableNextBtn = $scope.netTotalCount > $_resultsPerPage ? false : true;
			} else {
				$scope.resultFrom = $_resultsPerPage * ($_pageNo - 1) + 1;
				$scope.resultUpto = ($scope.resultFrom + $_resultsPerPage - 1) < $scope.netTotalCount ? ($scope.resultFrom + $_resultsPerPage - 1) : $scope.netTotalCount;
				$scope.disablePrevBtn = false;
				$scope.disableNextBtn = $scope.resultUpto === $scope.netTotalCount ? true : false;
			}
 		};

		// hacks to track back the chosenCico & chosenUsers names
		// from their avaliable values
		var findBackNames = function() {

		    // keep track of the transcation type for UI
		    if ( $scope.chosenReport.chosenCico === 'BOTH' ) {
		        $scope.transcationTypes = 'check In, Check Out';
		    } else if ( $scope.chosenReport.chosenCico === 'IN' ) {
		        $scope.transcationTypes = 'check In';
		    } else if ( $scope.chosenReport.chosenCico === 'OUT' ) {
		        $scope.transcationTypes = 'check OUT';
		    }

		    // keep track of the Users chosen for UI
		    // if there is just one user
		    if ( $scope.chosenReport.chosenUsers ) {
		    	var _userNames = [];

		    	_.each($scope.activeUserList, function(user) {
					var match = _.find($scope.chosenReport.chosenUsers, function(id) {
						return id === user.id;
					});

					if ( !!match ) {
						_userNames.push( user.full_name );
					};
				});

				$scope.userNames = _userNames.join(', ');
		    };
		};

		// fetch next page on pagination change
		$scope.fetchNextPage = function(returnToPage) {
			// returning to the previous page before print
			if ( !!returnToPage ) {
				$_pageNo = returnToPage;
				$scope.genReport( false, $_pageNo );
			} else {
				if ( $scope.disableNextBtn ) {
					return;
				}

				$_pageNo++;
				$scope.genReport( false, $_pageNo );
			};
		};

		// fetch prev page on pagination change
		$scope.fetchPrevPage = function() {
			if ( $scope.disablePrevBtn ) {
				return;
			}

			$_pageNo--;
			$scope.genReport( false, $_pageNo );
		};

		// refetch the report while sorting with..
		// Note: we are resetting page to page #1
		$scope.sortResultBy = function(sortBy) {
			if ( !sortBy ) {
				return;
			};

			// if there a group by filter applied, reset it
			if ( !!$scope.chosenReport.chosenGroupBy ) {
				$scope.chosenReport.chosenGroupBy = 'BLANK';
			};

			// un-select sort dir of others
			_.each($scope.chosenReport.sortByOptions, function(item) {
				if ( item && item.value !== sortBy.value ) {
					item.sortDir = undefined;
				};
			});

			// select sort_dir for clicked item
			sortBy.sortDir = (sortBy.sortDir === undefined || sortBy.sortDir === false) ? true : false;

			$scope.chosenReport.chosenSortBy = sortBy.value;

			// reset the page
			$_pageNo = 1;

			// should-we-change-view, specify-page, per-page-value
			$scope.genReport( false, 1 );
		};

		// refetch the reports with new filter values
		// Note: not resetting page to page #1
		$scope.fetchUpdatedReport = function() {
			// hide sidebar
			$scope.$parent.showSidebar = false;

			// reset the page
			$_pageNo = 1;

			// should-we-change-view, specify-page, per-page-value
		    $scope.genReport( false );
		};

		//loads the content in the existing report view in the DOM.
		$scope.fetchFullReport = function() {

			// report scope limiter popup
			// here we will give user another
			// chance to limit the reports to
			// a certain range
			if ( $_preFetchFullReport() ) {

				// make a copy of the from and until dates
				$scope.fromDateCopy = angular.copy( $scope.chosenReport.fromDate );
				$scope.untilDateCopy = angular.copy( $scope.chosenReport.untilDate );

				// show popup
				ngDialog.open({
					controller: 'RVPrePrintPopupCtrl',
				    template: '/assets/partials/reports/rvPrePrintPopup.html',
				    className: 'ngdialog-theme-default',
				    closeByDocument: true,
				    scope: $scope,
				    data: []
				});
			} else {
				$_fetchFullReport();
			};
		};

		// restore the old dates and close
		$scope.closeDialog = function() {
			$scope.chosenReport.fromDate = angular.copy( $scope.fromDateCopy );
			$scope.chosenReport.untilDate = angular.copy( $scope.untilDateCopy );

		    ngDialog.close();
		};

		$scope.continueWithPrint = function () {
			ngDialog.close();
			$_fetchFullReport();
		};

		// determine if we need to show pre print popup
		// currently only for 'OCCUPANCY_REVENUE_SUMMARY' report 
		function $_preFetchFullReport () {
			var allowedDateRange = 0,
				chosenDateRange,
				chosenVariance,
				chosenLastYear;

			if ( $scope.chosenReport.title === reportUtils.getName('OCCUPANCY_REVENUE_SUMMARY') ) {

				// get date range
				// READ MORE: http://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript#comment-3328094
				chosenDateRange = $scope.chosenReport.untilDate.getTime() - $scope.chosenReport.fromDate.getTime();
				chosenDateRange = ( chosenDateRange / (1000 * 60 * 60 * 24) | 0 );

				// find out the user selection choices
				chosenVariance = $scope.chosenReport.chosenOptions['include_variance'] ? true : false;
				chosenLastYear = $scope.chosenReport.chosenOptions['include_last_year'] ? true : false;
				
				// fromdate <- 5 days -> untildate
				// diff should be 4 (5 - 1), including fromdate
				if ( chosenVariance && chosenLastYear ) {
					allowedDateRange = 4;
				}

				// fromdate <- 10 days -> untildate
				// diff should be 9 (10 - 1), including fromdate
				else if ( chosenVariance || chosenLastYear ) {
					allowedDateRange = 9;
				}

				// fromdate <- 15 days -> untildate, 
				// diff should be 14 (15 - 1), including fromdate
				else {
					allowedDateRange = 14;
				};

				// if the current chosen dates are within
				// the allowedDateRange, dont show pop
				// go straight to printing
				// (allowedDateRange + 1) -> since we reduced it above
				return chosenDateRange > allowedDateRange ? true : false;
			} else {
				return false;
			};
		};

		function $_fetchFullReport () {

			// since we are loading the entire report and show its print preview
			// we need to keep a back up of the original report with its pageNo
			$scope.returnToPage = $_pageNo;

			// should-we-change-view, specify-page, per-page-value
			$scope.genReport( false, 1, 1000 );
		};




		// add the print orientation before printing
		var addPrintOrientation = function() {
			var orientation = 'portrait';
			var margin = '1cm 0.5cm';

			switch( $scope.chosenReport.title ) {
				case reportUtils.getName('ARRIVAL'):
				case reportUtils.getName('IN_HOUSE_GUEST'):
				case reportUtils.getName('DEPARTURE'):
				case reportUtils.getName('DEPOSIT_REPORT'):
				case reportUtils.getName('CANCELLATION_NO_SHOW'):
				case reportUtils.getName('WEB_CHECK_OUT_CONVERSION'):
				case reportUtils.getName('WEB_CHECK_IN_CONVERSION'):
				case reportUtils.getName('DAILY_TRANSACTIONS'):
				case reportUtils.getName('DAILY_PAYMENTS'):
				case reportUtils.getName('FORECAST_BY_DATE'):
				case reportUtils.getName('FORECAST_GUEST_GROUPS'):
				case reportUtils.getName('MARKET_SEGMENT_STATISTICS_REPORT'):
					orientation = 'landscape';
					break;

				case reportUtils.getName('OCCUPANCY_REVENUE_SUMMARY'):
					orientation = 'landscape';
					margin: '2mm 2mm';
					break;

				default:
					orientation = 'portrait';
					margin: '1cm 0.5cm';
					break;
			}

			$( 'head' ).append( "<style id='print-orientation'>@page { size: " + orientation + "; margin: " + margin + "; }</style>" );
		};

		// add the print orientation after printing
		var removePrintOrientation = function() {
			$( '#print-orientation' ).remove();
		};

		// print the page
		var printReport = function() {

			// add the orientation
			addPrintOrientation();

			/*
			*	======[ READY TO PRINT ]======
			*/

			// this will show the popup with full report
		    $timeout(function() {

		    	/*
		    	*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
		    	*/

		        $window.print();
		        if ( sntapp.cordovaLoaded ) {
		            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
		        };
		    }, 100);

		    /*
		    *	======[ PRINTING COMPLETE/CANCELLED. JS EXECUTION WILL UNPAUSE ]======
		    */

			// restore the old dates if dates were indeed saved
			// this is hardcodding.. NEED BETTER WAY TO MANAGE
		    $timeout(function() {
				if ( angular.isDate($scope.fromDateCopy) && angular.isDate($scope.untilDateCopy) ) {
					$scope.chosenReport.fromDate = angular.copy( $scope.fromDateCopy );
					$scope.chosenReport.untilDate = angular.copy( $scope.untilDateCopy );

					$scope.fromDateCopy = undefined;
					$scope.untilDateCopy = undefined;
				};
		    }, 50);

		    // in background we need to keep the report with its original state
		    $timeout(function() {
		    	// remove the orientation
				removePrintOrientation();

				// restore the old dates if dates were indeed saved
				// this is hardcodding.. NEED BETTER WAY TO MANAGE
				if ( !!$scope.fromDateCopy && !!$scope.untilDateCopy ) {
					$scope.chosenReport.fromDate = angular.copy( $scope.chosenReport.fromDateCopy );
					$scope.chosenReport.untilDate = angular.copy( $scope.chosenReport.untilDateCopy );

					$scope.chosenReport.fromDateCopy = undefined;
					$scope.chosenReport.untilDateCopy = undefined;
				};

		        // load the report with the original page
		        $scope.fetchNextPage( $scope.returnToPage );
		    }, 100);
		};

		$scope.emailReport = function() {
			alert( 'Email Report API yet to be completed/implemented/integrated' );
		};

		$scope.saveFullReport = function() {
			alert( 'Download Full Report API yet to be completed/implemented/integrated' );
		};

		$scope.hasSubString = function(subString, string) {
			var string    = string.toLowerCase(),
				subString = subString.toLowerCase();

			return string.indexOf( subString ) > -1;
		};





		var reportSubmit = $scope.$on('report.submit', function() {
			$_pageNo = 1;
			$scope.errorMessage = [];

			afterFetch();
			findBackNames();
			calPagination();
			refreshScroll();
		});

		var reportUpdated = $scope.$on('report.updated', function() {
			$scope.errorMessage = [];

			afterFetch();
			findBackNames();
			calPagination();
			refreshScroll();
		});

		var reportPageChanged = $scope.$on('report.page.changed', function() {
			$scope.errorMessage = [];

			afterFetch();
			calPagination();
			refreshScroll();
		});

		var reportPrinting = $scope.$on('report.printing', function() {
			$scope.errorMessage = [];

			afterFetch();
			findBackNames();
			printReport();
			refreshScroll();
		});

		var reportAPIfailure = $scope.$on('report.API.failure', function() {
			$scope.errorMessage = $scope.$parent.errorMessage;
			
			afterFetch();
			calPagination();
			refreshScroll();
		});

		// removing event listners when scope is destroyed
		$scope.$on( 'destroy', reportSubmit );
		$scope.$on( 'destroy', reportUpdated );
		$scope.$on( 'destroy', reportPageChanged );
		$scope.$on( 'destroy', reportPrinting );
		$scope.$on( 'destroy', reportAPIfailure );

    }
]);
