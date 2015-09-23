sntRover.controller('RVReportDetailsCtrl', [
	'$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    '$window',
    'RVreportsSrv',
	'RVReportParserFac',
	'RVReportMsgsConst',
	'RVReportNamesConst',
	'ngDialog',
	function($scope, $rootScope, $filter, $timeout, $window, reportsSrv, reportParser, reportMsgs, reportNames, ngDialog) {

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
            $timeout(refreshScroll,1000);
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


			$scope.chosenReport = reportsSrv.getChoosenReport();

			$scope.setTitle( $scope.chosenReport.title + ' ' + ($scope.chosenReport.sub_title ? $scope.chosenReport.sub_title : '') );
			$scope.$parent.heading = $scope.chosenReport.title + ' ' + ($scope.chosenReport.sub_title ? $scope.chosenReport.sub_title : '');

			// reset this
			$scope.parsedApiFor = undefined;

			// reset flags
			$scope.isGuestReport = false;
			$scope.isLargeReport = false;
			$scope.isLogReport   = false;
			$scope.isDepositReport = false;
			$scope.hasNoSorting  = false;
			$scope.hasNoTotals   = false;
			$scope.showSortBy    = true;
			$scope.hasPagination = true;
			$scope.isTransactionReport = false;
			$scope.isCondensedPrint = false;

			switch ( $scope.chosenReport.title ) {
				case reportNames['IN_HOUSE_GUEST']:
				case reportNames['DEPARTURE']:
				case reportNames['ARRIVAL']:
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.showSortBy = false;
					break;

				case reportNames['EARLY_CHECKIN']:
					$scope.isGuestReport = true;
					$scope.showSortBy = true;
					break;

				case reportNames['CANCELLATION_NO_SHOW']:
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.hasNoSorting = true;
					$scope.showSortBy = false;
					break;

				case reportNames['LOGIN_AND_OUT_ACTIVITY']:
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.isLogReport = true;
					$scope.showSortBy = false;
					break;

				case reportNames['RESERVATIONS_BY_USER']:
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					break;

				case reportNames['LATE_CHECK_OUT']:
					$scope.hasNoTotals = true;
					break;

				case reportNames['CHECK_IN_CHECK_OUT']:
					if ( $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'OUT' ) {
						$scope.hasNoTotals = true;
					};
					break;

				case reportNames['WEB_CHECK_IN_CONVERSION']:
				case reportNames['WEB_CHECK_OUT_CONVERSION']:
				case reportNames['MARKET_SEGMENT_STAT_REPORT']:
					$scope.isLargeReport = true;
					break;

				case reportNames['BOOKING_SOURCE_MARKET_REPORT']:
					$scope.hasPagination = false;
					break;

				case reportNames['DAILY_TRANSACTIONS']:
				case reportNames['DAILY_PAYMENTS']:
					$scope.hasNoTotals = true;
					$scope.isTransactionReport = true;
					break;

				case reportNames['DEPOSIT_REPORT']:
				case reportNames['RATE_ADJUSTMENTS_REPORT']:
					$scope.hasNoTotals = true;
					$scope.isDepositReport = true;
					break;

				case reportNames['GROUP_PICKUP_REPORT']:
					$scope.hasNoTotals = true;
					$scope.isDepositReport = true;
					$scope.isCondensedPrint = true;
					break;

				default:
					break;
			};


			// hack to set the colspan for reports details tfoot
			switch ( $scope.chosenReport.title ) {
				case reportNames['CHECK_IN_CHECK_OUT']:
					if ( $scope.chosenReport.chosenCico === 'BOTH' ) {
						$scope.leftColSpan = 6;
						$scope.rightColSpan = 5;
					} else {
						$scope.leftColSpan = 4;
						$scope.rightColSpan = 5;
					}
					break;

				case reportNames['UPSELL']:
					$scope.leftColSpan = 5;
					$scope.rightColSpan = 5;
					break;

				case reportNames['LOGIN_AND_OUT_ACTIVITY']:
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 3;
					break;

				case reportNames['DEPARTURE']:
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 3;
					break;

				case reportNames['ARRIVAL']:
				case reportNames['IN_HOUSE_GUEST']:
				case reportNames['DEPOSIT_REPORT']:
				case reportNames['RESERVATIONS_BY_USER']:
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 4;
					break;

				case reportNames['CANCELLATION_NO_SHOW']:
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 3;
					break;

				case reportNames['DAILY_TRANSACTIONS']:
				case reportNames['DAILY_PAYMENTS']:
					$scope.leftColSpan = 5;
					$scope.rightColSpan = 5;
					break;

				case reportNames['WEB_CHECK_IN_CONVERSION']:
				case reportNames['WEB_CHECK_OUT_CONVERSION']:
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 8;
					break;

				case reportNames['ROOMS_QUEUED']:
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 3;
					break;

				case reportNames['FORECAST_BY_DATE']:
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 4;
					break;

				case reportNames['FORECAST_GUEST_GROUPS']:
					$scope.leftColSpan = 6;
					$scope.rightColSpan = 7;
					break;

				case reportNames['MARKET_SEGMENT_STAT_REPORT']:
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 8;
					break;

				case reportNames['COMPARISION_BY_DATE']:
					$scope.leftColSpan = 4;
					$scope.rightColSpan = 4;
					break;

				case reportNames['RATE_ADJUSTMENTS_REPORT']:
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 4;
					break;

				case reportNames['GROUP_PICKUP_REPORT']:
					$scope.leftColSpan = 6;
					$scope.rightColSpan = 3;
					break;

				default:
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 2;
					break;
			};

			// modify the summary count for certain reports as per the report totals
			// these are done for old reports as for old reports 'totals' is what we
			// today know as 'summaryCounts'. So we are gonna map 'totals' into 'summaryCounts'
			// for the following reports
			switch ( $scope.chosenReport.title ) {
				case reportNames['CHECK_IN_CHECK_OUT']:
					if ( 'Total Check Ins' == totals[0]['label'] ) {
						if ( totals.length == 10 ) {
							$scope.$parent.summaryCounts = {
								'has_both'     : true,
								'check_ins'      : totals[0]['value'],
								'ins_via_rover'  : totals[1]['value'],
								'ins_via_web'    : totals[2]['value'],
								'ins_via_zest'   : totals[3]['value'],
								'ins_via_kiosk'  : totals[4]['value'],
								'check_outs'     : totals[5]['value'],
								'outs_via_rover' : totals[6]['value'],
								'outs_via_web'   : totals[7]['value'],
								'outs_via_zest'  : totals[8]['value'],
								'outs_via_kiosk' : totals[9]['value']
							};
						} else {
							$scope.$parent.summaryCounts = {
								'has_in'         : true,
								'check_ins'      : totals[0]['value'],
								'ins_via_rover'  : totals[1]['value'],
								'ins_via_web'    : totals[2]['value'],
								'ins_via_zest'   : totals[3]['value'],
								'ins_via_kiosk'  : totals[4]['value']
							};
						};
					} else if ( 'Total Check Outs' == totals[0]['label'] ) {
						$scope.$parent.summaryCounts = {
							'has_out'         : true,
							'check_outs'     : totals[0]['value'],
							'outs_via_rover' : totals[1]['value'],
							'outs_via_web'   : totals[2]['value'],
							'outs_via_zest'  : totals[3]['value'],
							'outs_via_kiosk' : totals[4]['value']
						};
					};
					break;

				case reportNames['UPSELL']:
					$scope.$parent.summaryCounts = {
						'rooms_upsold'   : totals[0]['value'],
						'upsell_revenue' : totals[1]['value']
					};
					break;

				case reportNames['WEB_CHECK_IN_CONVERSION']:
					$scope.$parent.summaryCounts = {
						'emails_sent'   : totals[0]['value'],
						'up_sell_conv'  : totals[1]['value'],
						'revenue'       : totals[2]['value'],
						'conversion'    : totals[4]['value'],
						'total_checkin' : totals[3]['value']
					};
					break;

				case reportNames['WEB_CHECK_OUT_CONVERSION']:
					$scope.$parent.summaryCounts = {
						'emails_sent'        : totals[0]['value'],
						'late_checkout_conv' : totals[1]['value'],
						'revenue'            : totals[2]['value'],
						'conversion'         : totals[4]['value'],
						'total_checkout'     : totals[3]['value']
					};
					break;

				case reportNames['LATE_CHECK_OUT']:
					$scope.$parent.summaryCounts = {
						'rooms'   : totals[0]['value'],
						'revenue' : totals[1]['value']
					};
					break;

				default:
					// no op
			};

			// change date format for all
			for (var i = 0, j = results.length; i < j; i++) {
			    results[i][0] = $filter('date')(results[i][0], $rootScope.dateFormat);

			    if ( $scope.chosenReport.title === reportNames['LATE_CHECK_OUT'] ) {

			        // hack to add curency ($) symbol in front of values
			        results[i][ results[i].length - 1 ] = $rootScope.currencySymbol + results[i][ results[i].length - 1 ];

			        // hack to append ':00 PM' to time
			        // thus makin the value in template 'X:00 PM'
			        results[i][ results[i].length - 2 ] += ':00 PM';
			    }
			};

			// hack to edit the title 'LATE CHECK OUT TIME' to 'SELECTED LATE CHECK OUT TIME'
			// notice the text case, they are as per api response and ui
			if ( $scope.chosenReport.title === reportNames['LATE_CHECK_OUT'] ) {
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

			// send the recived data to the API parser module
			// with additional user selected options
			// the API parser will look throught the report name
			// to make sure API that doesnt requires any parsing will be returned with any parse
			var parseAPIoptions = {
				'groupedByKey'    : $scope.$parent.reportGroupedBy,
				'checkNote'       : $scope.chosenReport.chosenOptions['include_notes'],
				'checkGuest'      : $scope.chosenReport.chosenOptions['show_guests'],
				'checkCancel'     : $scope.chosenReport.chosenOptions['include_cancelled'] || $scope.chosenReport.chosenOptions['include_cancelled'],
				'checkRateAdjust' : $scope.chosenReport.chosenOptions['show_rate_adjustments_only']
			};
			$scope.$parent.results = angular.copy( reportParser.parseAPI($scope.parsedApiFor, $scope.$parent.results, parseAPIoptions) );

			// if there are any results
			$scope.hasNoResults = _.isEmpty( $scope.$parent.results );


			// a very different parent template / row template / content template for certain reports
			// otherwise they all will share the same template
			switch ( $scope.parsedApiFor ) {
				case reportNames['UPSELL']:
					$scope.hasReportTotals    = true;
					$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/upsellReport/rvUpsellReport.html';
					break;

				case reportNames['BOOKING_SOURCE_MARKET_REPORT']:
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = !_.isEmpty($scope.$parent.results.market) || !_.isEmpty($scope.$parent.results.source) ? true : false;
					$scope.detailsTemplateUrl = '/assets/partials/reports/bookingSourceMarketReport/rvBookingSourceMarketReport.html';
					break;

				case reportNames['OCCUPANCY_REVENUE_SUMMARY']:
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/occupancyRevenueReport/rvOccupancyRevenueReport.html';
					break;

				case reportNames['RESERVATIONS_BY_USER']:
					if ( !!$scope.$parent.reportGroupedBy ) {
						$scope.hasReportTotals    = true;
						$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
						$scope.detailsTemplateUrl = '/assets/partials/reports/reservationByUserReport/rvReservationByUserReport.html';
					} else {
						$scope.hasReportTotals    = true;
						$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
						$scope.detailsTemplateUrl = '/assets/partials/reports/shared/rvCommonReportDetails.html';
					};
					break;

				case reportNames['FORECAST_BY_DATE']:
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/forecastByDateReport/rvForecastByDateReport.html';
					break;

				case reportNames['FORECAST_GUEST_GROUPS']:
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/forecastGuestGroupReport/rvForecastGuestGroupReport.html';
					break;

				case reportNames['MARKET_SEGMENT_STAT_REPORT']:
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/marketSegmentStatReport/rvMarketSegmentStatReport.html';
					break;

				case reportNames['COMPARISION_BY_DATE']:
					$scope.hasReportTotals    = false;
					$scope.showReportHeader   = true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/comparisonStatReport/rvComparisonStatReport.html';
					break;

				case reportNames['ADDON_FORECAST']:
					$scope.hasReportTotals  = false;
					$scope.showReportHeader = true;
					if ( 'ADDON' == $scope.chosenReport.chosenGroupBy ) {
						$scope.detailsTemplateUrl = '/assets/partials/reports/addonForecastReport/rvAddonForecastReportByAddon.html';
					} else {
						$scope.detailsTemplateUrl = '/assets/partials/reports/addonForecastReport/rvAddonForecastReportByDate.html';
					};
					break;
					

				default:
					$scope.hasReportTotals    = true;
					$scope.showReportHeader   = _.isEmpty($scope.$parent.results) ? false : true;
					$scope.detailsTemplateUrl = '/assets/partials/reports/shared/rvCommonReportDetails.html';
					break;
			};
		};


		$scope.parsedApiTemplate = function() {
			var template = '';

			switch ( $scope.parsedApiFor ) {

				// general reports rows
				case reportNames['ARRIVAL']:
					template = '/assets/partials/reports/generalReportRows/rvArrivalReportRow.html';
					break;
				case reportNames['CANCELLATION_NO_SHOW']:
					template = '/assets/partials/reports/generalReportRows/rvCancellationReportRow.html';
					break;
				case reportNames['DAILY_TRANSACTIONS']:
				case reportNames['DAILY_PAYMENTS']:
					template = '/assets/partials/reports/generalReportRows/rvDailyTransPaymentsReportRow.html';
					break;
				case reportNames['DEPARTURE']:
					template = '/assets/partials/reports/generalReportRows/rvDepartureReportRow.html';
					break;
				case reportNames['DEPOSIT_REPORT']:
					template = '/assets/partials/reports/generalReportRows/rvDepositReportRow.html';
					break;
				case reportNames['IN_HOUSE_GUEST']:
					template = '/assets/partials/reports/generalReportRows/rvInHouseReportRow.html';
					break;
				case reportNames['RATE_ADJUSTMENTS_REPORT']:
					template = '/assets/partials/reports/generalReportRows/rvRateAdjustmentReportRow.html';
					break;
				case reportNames['ROOMS_QUEUED']:
					template = '/assets/partials/reports/generalReportRows/rvRoomQueuedReportRow.html';
					break;
				case reportNames['LOGIN_AND_OUT_ACTIVITY']:
					template = '/assets/partials/reports/generalReportRows/rvLoginActivityReportRow.html';
					break;
				case reportNames['GROUP_PICKUP_REPORT']:
					template = '/assets/partials/reports/generalReportRows/rvGroupPickupReportRow.html';
					break;


				// RESERVATIONS_BY_USER report row
				case reportNames['RESERVATIONS_BY_USER']:
					template = '/assets/partials/reports/reservationByUserReport/rvReservationByUserReportRow.html';
					break;

				// FORECAST_BY_DATE report row
				case reportNames['FORECAST_BY_DATE']:
					template = '/assets/partials/reports/forecastByDateReport/rvForecastByDateReportRow.html';
					break;

				// FORECAST_GUEST_GROUPS report row
				case reportNames['FORECAST_GUEST_GROUPS']:
					template = '/assets/partials/reports/forecastGuestGroupReport/rvForecastGuestGroupReportRow.html';
					break;

				// MARKET_SEGMENT_STAT_REPORT report row
				case reportNames['MARKET_SEGMENT_STAT_REPORT']:
					template = '/assets/partials/reports/marketSegmentStatReport/rvMarketSegmentStatReportRow.html';
					break;


				// Default report row
				default:
					template = '/assets/partials/reports/shared/rvCommonReportRow.html';
					break;
			};

			return template;
		};



		// simple method to allow checking for report title from the template
		// by matching it against the report names constant
		$scope.isThisReport = function (name) {
			if ( 'string' == typeof name ) {
				return $scope.parsedApiFor == reportNames[name];
			} else {
				return !! _.find(name, function(each) {
					return $scope.parsedApiFor == reportNames[each];
				});
			};
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

		// basically refetching reports but for 1000 results
		// Also if a specific report ctrl has created a pre-print
		// 'showModal' method to get some inputs from user before print
		// call the method here.
		// READ MORE: rvReportsMainCtrl:L#:61-75
		$scope.fetchFullReport = function() {
			if ( 'function' == typeof $scope.printOptions.showModal ) {
				$scope.printOptions.showModal();
			} else {
				$_fetchFullReport();
			};
		};

		// when user press submit from pre-print modal, continue our calls to '$_fetchFullReport'
		// READ MORE: rvReportsMainCtrl:L#:61-75
		var prePrintDone = $rootScope.$on( reportMsgs['REPORT_PRE_PRINT_DONE'], $_fetchFullReport );
		$scope.$on( 'destroy', prePrintDone );

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
				case reportNames['ARRIVAL']:
				case reportNames['IN_HOUSE_GUEST']:
				case reportNames['DEPARTURE']:
				case reportNames['DEPOSIT_REPORT']:
				case reportNames['CANCELLATION_NO_SHOW']:
				case reportNames['WEB_CHECK_OUT_CONVERSION']:
				case reportNames['WEB_CHECK_IN_CONVERSION']:
				case reportNames['DAILY_TRANSACTIONS']:
				case reportNames['DAILY_PAYMENTS']:
				case reportNames['FORECAST_BY_DATE']:
				case reportNames['FORECAST_GUEST_GROUPS']:
				case reportNames['GROUP_PICKUP_REPORT']:
				case reportNames['MARKET_SEGMENT_STAT_REPORT']:
				case reportNames['RATE_ADJUSTMENTS_REPORT']:
					orientation = 'landscape';
					break;

				case reportNames['OCCUPANCY_REVENUE_SUMMARY']:
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


		    // in background we need to keep the report with its original state
		    $timeout(function() {
		    	// remove the orientation
				removePrintOrientation();

				// If a specific report ctrl has created a pre-print 'afterPrint' method
				// to get clear/remove anything after print
				// READ MORE: rvReportsMainCtrl:L#:61-75
				if ( 'function' == typeof $scope.printOptions.afterPrint ) {
					$scope.printOptions.afterPrint();
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





		var reportSubmited = $scope.$on(reportMsgs['REPORT_SUBMITED'], function() {
			$_pageNo = 1;
			$scope.errorMessage = [];
			/**/
			afterFetch();
			findBackNames();
			calPagination();
			refreshScroll();
		});

		var reportUpdated = $scope.$on(reportMsgs['REPORT_UPDATED'], function() {
			$scope.errorMessage = [];
			/**/
			afterFetch();
			findBackNames();
			calPagination();
			refreshScroll();
		});

		var reportPageChanged = $scope.$on(reportMsgs['REPORT_PAGE_CHANGED'], function() {
			$scope.errorMessage = [];
			/**/
			afterFetch();
			calPagination();
			refreshScroll();
		});

		var reportPrinting = $scope.$on(reportMsgs['REPORT_PRINTING'], function() {
			$scope.errorMessage = [];
			/**/
			afterFetch();
			findBackNames();
			printReport();
			refreshScroll();
		});

		var reportAPIfailed = $scope.$on(reportMsgs['REPORT_API_FAILED'], function() {
			$scope.errorMessage = $scope.$parent.errorMessage;
			/**/
			afterFetch();
			calPagination();
			refreshScroll();
		});

		// removing event listners when scope is destroyed
		$scope.$on( 'destroy', reportSubmited );
		$scope.$on( 'destroy', reportUpdated );
		$scope.$on( 'destroy', reportPageChanged );
		$scope.$on( 'destroy', reportPrinting );
		$scope.$on( 'destroy', reportAPIfailed );

    }
]);
