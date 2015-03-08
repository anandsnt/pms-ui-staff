sntRover.controller('RVReportDetailsCtrl', [
	'$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    '$window',
    'RVreportsSrv',
	'RVReportUtilsFac',
	'RVReportParserFac',
	function($scope, $rootScope, $filter, $timeout, $window, RVreportsSrv, reportUtils, reportParser) {

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
			$scope.$parent.toggleFilterItems(item);
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

				case reportUtils.getName('UPSELL'):
				case reportUtils.getName('LATE_CHECK_OUT'):
					$scope.hasNoTotals = true;
					break;

				case reportUtils.getName('CHECK_IN_CHECK_OUT'):
					if ( $scope.chosenReport.chosenCico == 'IN' || $scope.chosenReport.chosenCico == 'OUT' ) {
						$scope.hasNoTotals = true;
					};
					break;

				case reportUtils.getName('WEB_CHECK_IN_CONVERSION'):
				case reportUtils.getName('WEB_CHECK_OUT_CONVERSION'):
					$scope.isLargeReport = true;
					break;

				case reportUtils.getName('BOOKING_SOURCE_MARKET_REPORT'):
					$scope.hasPagination = false;
					break;

				default:
					break;
			};


			// hack to set the colspan for reports details tfoot
			switch ( $scope.chosenReport.title ) {
				case reportUtils.getName('CHECK_IN_CHECK_OUT'):
				case reportUtils.getName('UPSELL'):
					$scope.leftColSpan = 4;
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
				case reportUtils.getName('CANCELLATION_NO_SHOW'):
				case reportUtils.getName('RESERVATIONS_BY_USER'):
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 4;
					break;

				case reportUtils.getName('WEB_CHECK_IN_CONVERSION'):
				case reportUtils.getName('WEB_CHECK_OUT_CONVERSION'):
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 8;
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

			    if ( $scope.restHalf[0] ) {
			        $scope.restHalf[0]['class'] = 'red';
			    };
			} else {
			    // NOTE: as per todays style this applies to
			    // 'Upsell' and 'Late Check Out' only
			    if ( $scope.firstHalf[1] ) {
			        $scope.firstHalf[1]['class'] = 'orange';

			        // hack to add ($) currency in front
			        if ( $scope.chosenReport.title === reportUtils.getName('UPSELL') || $scope.chosenReport.title === reportUtils.getName('LATE_CHECK_OUT') ) {
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

			    if ( $scope.chosenReport.title === 'Upsell' ) {

			        // hack to add curency ($) symbol in front of values
			        results[i][ results[i].length - 1 ] = $rootScope.currencySymbol + results[i][ results[i].length - 1 ];
			        results[i][ results[i].length - 2 ] = $rootScope.currencySymbol + results[i][ results[i].length - 2 ];
			    };
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
			refreshScroll();
			refreshSidebarScroll();

			// need to keep a separate object to show the date stats in the footer area
			// dirty hack to get the val() not model value
			// delay as it cost time for ng-bindings
			$timeout(function() {

				// clear out old values
				$scope.displayedReport = {};

				// chosenReportFromCancelDate
				// chosenReportToCancelDate
				$scope.displayedReport.chosenReportFromCancelDate = $( '#chosenReportFromCancelDate' ).val();
				$scope.displayedReport.chosenReportToCancelDate = $( '#chosenReportToCancelDate' ).val();

				// chosenReportFromDepositDate
				// chosenReportToDepositDate
				$scope.displayedReport.chosenReportFromDepositDate = $( '#chosenReportFromDepositDate' ).val();
				$scope.displayedReport.chosenReportToDepositDate = $( '#chosenReportToDepositDate' ).val();

				// chosenReportFromArrivalDate
				// chosenReportToArrivalDate
				$scope.displayedReport.chosenReportFromArrivalDate = $( '#chosenReportFromArrivalDate' ).val();
				$scope.displayedReport.chosenReportToArrivalDate = $( '#chosenReportToArrivalDate' ).val();

				// chosenReportFromDate
				// chosenReportToDate
				$scope.displayedReport.chosenReportFromDate = $( '#chosenReportFromDate' ).val();
				$scope.displayedReport.chosenReportToDate = $( '#chosenReportToDate' ).val();

				// chosenReportFromTime
				// chosenReportToTime
				$scope.displayedReport.chosenReportFromTime = $( '#chosenReportFromTime option:selected' ).text() != 'From Time' ? $( '#chosenReportFromTime option:selected' ).text() : '';
				$scope.displayedReport.chosenReportToTime = $( '#chosenReportToTime option:selected' ).text() != 'Until Time' ? $( '#chosenReportToTime option:selected' ).text() : '';

				// choosenReportUser
				$scope.displayedReport.choosenReportUser = $( '#choosenReportUser' ).val();

				// chosenReportCompTaGrp
				$scope.displayedReport.chosenReportCompTaGrp = $( '#chosenReportCompTaGrp' ).val();

				// call again may be.. :(
				refreshScroll();
			}, 100);


			// new more detailed reports
			$scope.parsedApiFor = $scope.chosenReport.title;
			// $scope.$parent.results = angular.copy( $_parseApiToTemplate(results) );
			$scope.$parent.results = angular.copy( reportParser.parseAPI($scope.$parent.results, $scope.parsedApiFor, $scope.chosenReport.chosenGroupBy) );


			// now flags that will determine correct template to be loaded
			switch ( $scope.parsedApiFor ) {
				case reportUtils.getName('BOOKING_SOURCE_MARKET_REPORT'):
					$scope.hasReportTotals   = false;
					$scope.showReportHeader  = $scope.$parent.results.market || $scope.$parent.results.source;
					$scope.templateUrl       = '/assets/partials/reports/rvMarketSourceReport.html';
					break;

				case reportUtils.getName('OCCUPANCY_REVENUE_SUMMARY'):
					$scope.hasReportTotals   = false;
					$scope.showReportHeader  = !!$scope.$parent.results;
					$scope.templateUrl   = '/assets/partials/reports/rvOccupancyRevenueReport.html';
					break;

				case reportUtils.getName('RESERVATIONS_BY_USER'):
					if ( /*check_has_groupby*/ true ) {
						$scope.hasReportTotals   = true;
						$scope.showReportHeader  = !!$scope.$parent.results;
						$scope.templateUrl       = '/assets/partials/reports/rvReservationByUserReport.html';
						break;
					} else {
						$scope.hasReportTotals   = tre;
						$scope.showReportHeader  = !!$scope.$parent.results;
						$scope.templateUrl       = '/assets/partials/reports/SOME_URL_TO_COME.html';
						break;
					};

				default:
					$scope.hasReportTotals   = true;
					$scope.showReportHeader  = !!$scope.$parent.results;
					$scope.templateUrl       = '/assets/partials/reports/SOME_URL_TO_COME.html';
					break;
			};

			console.log($scope.hasReportTotals);
			console.log($scope.showReportHeader);
			console.log($scope.templateUrl);
		};


		$scope.parsedApiTemplate = function() {
			var template = '';

			switch ($scope.parsedApiFor) {
				case reportUtils.getName('IN_HOUSE_GUEST'):
					template = '/assets/partials/reports/rvInHouseReport.html';
					break;

				case reportUtils.getName('DEPARTURE'):
					template = '/assets/partials/reports/rvDepartureReport.html';
					break;

				case reportUtils.getName('ARRIVAL'):
					template = '/assets/partials/reports/rvArrivalReport.html';
					break;

				case reportUtils.getName('CANCELLATION_NO_SHOW'):
					template = '/assets/partials/reports/rvCancellationReport.html';
					break;

				case reportUtils.getName('LOGIN_AND_OUT_ACTIVITY'):
					template = '/assets/partials/reports/rvUserActivityReport.html';
					break;

				case reportUtils.getName('DEPOSIT_REPORT'):
					template = '/assets/partials/reports/rvDepositReport.html';
					break;

				case reportUtils.getName('RESERVATIONS_BY_USER'):
					template = '/assets/partials/reports/rvReservationByUserReport.html';
					break;

				default:
					template = '/assets/partials/reports/rvCommonReport.html';
					break;
			};

			return template;
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
			$scope.uiTotalCount  = !!$scope.$parent.results ? $scope.$parent.results.length : 0;

			if ( $_pageNo === 1 ) {
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
						return id == user.id;
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

			// un-select sort dir of others
			_.each($scope.chosenReport.sortByOptions, function(item) {
				if ( item && item.value != sortBy.value ) {
					item.sortDir = undefined;
				};
			});

			// select sort_dir for clicked item
			sortBy.sortDir = (sortBy.sortDir == undefined || sortBy.sortDir == false) ? true : false;

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

			// since we are loading the entire report and show its print preview
			// we need to keep a back up of the original report with its pageNo
		    $scope.returnToPage = $_pageNo;

		    // should-we-change-view, specify-page, per-page-value
		    $scope.genReport( false, 1, 1000 );
		};


		// add the print orientation before printing
		var addPrintOrientation = function() {
			var orientation = 'portrait';

			switch( $scope.chosenReport.title ) {
				case reportUtils.getName('ARRIVAL'):
				case reportUtils.getName('IN_HOUSE_GUEST'):
				case reportUtils.getName('DEPARTURE'):
				case reportUtils.getName('DEPOSIT_REPORT'):
				case reportUtils.getName('CANCELLATION_NO_SHOW'):
				case reportUtils.getName('WEB_CHECK_OUT_CONVERSION'):
				case reportUtils.getName('WEB_CHECK_IN_CONVERSION'):
				case reportUtils.getName('OCCUPANCY_REVENUE_SUMMARY'):
					orientation = 'landscape';
					break;

				default:
					orientation = 'portrait';
					break;
			}

			$( 'head' ).append( "<style id='print-orientation'>@page { size: " + orientation + "; }</style>" );
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
			*	=====[ READY TO PRINT ]=====
			*/

			// this will show the popup with full report
		    $timeout(function() {

		    	/*
		    	*	=====[ PRINTING!! JS EXECUTION IS PAUSED ]=====
		    	*/

		        $window.print();
		        if ( sntapp.cordovaLoaded ) {
		            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
		        };
		    }, 100);

		    /*
		    *	=====[ PRINTING COMPLETE/CANCELLED. JS EXECUTION WILL UNPAUSE ]=====
		    */

		    // in background we need to keep the report with its original state
		    $timeout(function() {
		    	// remove the orientation
				removePrintOrientation();

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






		var reportSubmit = $rootScope.$on('report.submit', function() {
			$_pageNo = 1;

			afterFetch();
			findBackNames();
			calPagination();
			refreshScroll();
		});

		var reportUpdated = $rootScope.$on('report.updated', function() {
			afterFetch();
			findBackNames();
			calPagination();
			refreshScroll();
		});

		var reportPageChanged = $rootScope.$on('report.page.changed', function() {
			afterFetch();
			calPagination();
			refreshScroll();
		});

		var reportPrinting = $rootScope.$on('report.printing', function() {
			afterFetch();
			findBackNames();
			printReport();
			refreshScroll();
		});

		// removing event listners when scope is destroyed
		$scope.$on( 'destroy', reportSubmit );
		$scope.$on( 'destroy', reportUpdated );
		$scope.$on( 'destroy', reportPageChanged );
		$scope.$on( 'destroy', reportPrinting );

    }
]);
