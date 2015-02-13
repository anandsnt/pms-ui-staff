sntRover.controller('RVReportDetailsCtrl', [
	'$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    '$window',
    'RVreportsSrv',
	function($scope, $rootScope, $filter, $timeout, $window, RVreportsSrv) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller( 'report-details-scroll', {click: true, preventDefault: false} );

		var refreshScroll = function() {
			if ( !!$scope.$parent.myScroll['report-details-scroll'] ) {
				$scope.refreshScroller( 'report-details-scroll' );
				$scope.$parent.myScroll['report-details-scroll'].scrollTo(0, 0, 100);
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
		$scope.toggleFilterItems = $scope.$parent.toggleFilterItems;


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

			switch ( $scope.chosenReport.title ) {
				case 'In-House Guests':
				case 'Departure':
				case 'Arrival':
				case 'Deposit Report':
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					break;

				case 'Cancelation & No Show':
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.hasNoSorting = true;
					break;

				case 'Login and out Activity':
					$scope.hasNoTotals = true;
					$scope.isGuestReport = true;
					$scope.isLogReport = true;
					break;

				case 'Upsell':
				case 'Late Check Out':
					$scope.hasNoTotals = true;
					break;

				case 'Check In / Check Out':
					console.log($scope.chosenReport.chosenCico);
					if ( $scope.chosenReport.chosenCico == 'IN' || $scope.chosenReport.chosenCico == 'OUT' ) {
						$scope.hasNoTotals = true;
					};
					break;

				case 'Web Check In Conversion':
				case 'Web Check Out Conversion':
					$scope.isLargeReport = true;
					break;
			};


			// hack to set the colspan for reports details tfoot
			switch ( $scope.chosenReport.title ) {
				case 'Check In / Check Out':
				case 'Upsell':
					$scope.leftColSpan = 4;
					$scope.rightColSpan = 5;
					break;

				case 'Login and out Activity':
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 3;
					break;

				case 'Arrival':
				case 'In-House Guests':
				case 'Deposit Report':
					$scope.leftColSpan = 3;
					$scope.rightColSpan = 4;
					break;

				case 'Web Check In Conversion':
				case 'Web Check Out Conversion':
					$scope.leftColSpan = 8;
					$scope.rightColSpan = 8;
					break;

				default:
					$scope.leftColSpan = 2;
					$scope.rightColSpan = 2;
					break;
			};

			// when should pagination
			if ( $scope.chosenReport.title != 'Booking Source & Market Report' ) {
				$scope.hasPagination = true;
			} else {
				$scope.hasPagination = false;
			}





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
			if ( $scope.chosenReport.title === 'Web Check In Conversion' || $scope.chosenReport.title === 'Web Check Out Conversion' ) {
				$scope.firstHalf = $scope.firstHalf.slice( 0, 3 );
				$scope.restHalf  = $scope.restHalf.slice( 3 );
			} else {
				$scope.firstHalf = $scope.firstHalf.slice( 0, 4 );
				$scope.restHalf  = $scope.restHalf.slice( 4 );
			}


			// now applying some very special and bizzare
			// cosmetic effects for reprots only
			// NOTE: direct dependecy on template
			if ( $scope.chosenReport.title === 'Check In / Check Out' ) {
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

			        // hack to add $ currency in front
			        if ( $scope.chosenReport.title === 'Upsell' || $scope.chosenReport.title === 'Late Check Out' ) {
			            $scope.firstHalf[1]['value'] = '$' + $scope.firstHalf[1]['value'];
			        };
			    };

			    // additional condition for "Web Check Out Conversion"
			    if ( $scope.chosenReport.title === 'Web Check In Conversion' || $scope.chosenReport.title === 'Web Check Out Conversion' ) {
			    	$scope.restHalf[$scope.restHalf.length - 1]['class'] = 'orange';
			    };
			};


			// change date format for all
			for (var i = 0, j = results.length; i < j; i++) {
			    results[i][0] = $filter('date')(results[i][0], $rootScope.dateFormat);

			    if ( $scope.chosenReport.title === 'Late Check Out' ) {

			        // hack to add curency $ symbol in front of values
			        results[i][ results[i].length - 1 ] = '$' + results[i][ results[i].length - 1 ];

			        // hack to append ':00 PM' to time
			        // thus makin the value in template 'X:00 PM'
			        results[i][ results[i].length - 2 ] += ':00 PM';
			    }

			    if ( $scope.chosenReport.title === 'Upsell' ) {

			        // hack to add curency $ symbol in front of values
			        results[i][ results[i].length - 1 ] = '$' + results[i][ results[i].length - 1 ];
			        results[i][ results[i].length - 2 ] = '$' + results[i][ results[i].length - 2 ];
			    };
			};


			// hack to edit the title 'LATE CHECK OUT TIME' to 'SELECTED LATE CHECK OUT TIME'
			// notice the text case, they are as per api response and ui
			if ( $scope.chosenReport.title === 'Late Check Out' ) {
			    for (var i = 0, j = headers.length; i < j; i++) {
			        if ( headers[i] === 'Late Check Out Time' ) {
			            headers[i] = 'Selected Late Check Out Time';
			            break;
			        };
			    };
			};

			// scroller refresh and reset position
			refreshScroll();

			// need to keep a separate object to show the date stats in the footer area
			// dirty hack to get the val() not model value
			// delay as it cost time for ng-bindings
			$timeout(function() {
				$scope.displayedReport           = {};
				$scope.displayedReport.fromDate  = $( '#chosenReportFromDate' ).val();
				$scope.displayedReport.untilDate = $( '#chosenReportToDate' ).val();
				$scope.displayedReport.fromCancelDate  = $( '#chosenReportFromCancelDate' ).val();
				$scope.displayedReport.untilCancelDate = $( '#chosenReportToCancelDate' ).val();
				$scope.displayedReport.fromTime  = $( '#chosenReportFromTime' ).val();
				$scope.displayedReport.untilTime = $( '#chosenReportToTime' ).val();

				// call again may be.. :(
				refreshScroll();
			}, 100);


			// new more detailed reports
			$scope.parsedApiFor = $scope.chosenReport.title;
			$scope.$parent.results = angular.copy( $_parseApiToTemplate(results) );
		};


		$scope.parsedApiTemplate = function() {
			var template = '';

			switch ($scope.parsedApiFor) {
				case 'In-House Guests':
					template = '/assets/partials/reports/rvInHouseReport.html';
					break;

				case 'Departure':
					template = '/assets/partials/reports/rvDepartureReport.html';
					break;

				case 'Arrival':
					template = '/assets/partials/reports/rvArrivalReport.html';
					break;

				case 'Cancelation & No Show':
					template = '/assets/partials/reports/rvCancellationReport.html';
					break;

				case 'Login and out Activity':
					template = '/assets/partials/reports/rvUserActivityReport.html';
					break;

				case 'Deposit Report':
					template = '/assets/partials/reports/rvDepositReport.html';
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

		// print the page
		var printReport = function() {

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
		    *	=====[ PRINTING COMPLETE. JS EXECUTION WILL COMMENCE ]=====
		    */

		    // in background we need to keep the report with its original state
		    $timeout(function() {
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


		// parse API to template helpers
		// since API response and Template Design are 
		// trying to F*(|< each others A$/
		function $_parseApiToTemplate (apiResponse) {
			var _retResult   = [],
				_eachItem    = {},
				_eachNote    = {},
				_eachGuest   = {},
				_eachGuestNote = {},
				_cancelRes   = {},
				_customItems = [],
				_uiDate      = '',
				_uiTime      = '';

			var i = j = k = l = m = n = 0;

			if ( $scope.parsedApiFor == 'Departure' ||
					$scope.parsedApiFor == 'Cancelation & No Show' ||
					$scope.parsedApiFor == 'Login and out Activity' ) {

				for (i = 0, j = apiResponse.length; i < j; i++) {
					_eachItem    = angular.copy( apiResponse[i] );
					_customItems = [];
					_cancelRes   = {};
					_eachNote    = {};
					_eachGuest   = {};
					_eachGuestNote = {};
					_uiDate        = '';
					_uiTime        = '';

					// first check for cancel reason
					// if so then create a custom entry
					// and push to '_customItems'
					if ( !!_eachItem['cancel_reason'] ) {
						_cancelRes = {
							isCancel : true,
							reason   : angular.copy( _eachItem['cancel_reason'] )
						};
						_customItems.push( _cancelRes );
					};

					// second check for notes && || accompanying guests					

					// 1. we only have accompanying guests -- and no notes
					if ( (!_eachItem['notes'] || (!!_eachItem['notes'] && !_eachItem['notes'].length)) &&
							!!_eachItem['accompanying_names'] &&
							!!_eachItem['accompanying_names'].length ) {
						_eachGuest = {
							isGuest : true,
							guest   : angular.copy( _eachItem['accompanying_names'] )
						};
						_customItems.push( _eachGuest );
					};

					// 2. we only have notes -- and no accompanying guests
					if ( (!_eachItem['accompanying_names'] || (!!_eachItem['accompanying_names'] && !_eachItem['accompanying_names'].length)) &&
							!!_eachItem['notes'] &&
							!!_eachItem['notes'].length ){
						for (k = 0, l = _eachItem['notes'].length; k < l; k++) {
							_eachNote = angular.copy( _eachItem['notes'][k] );
							_eachNote.isNote = true;
							if ( k == 0 ) {
								_eachNote.isHeading = true;
							};
							_customItems.push( _eachNote );
						};
					};

					// 3. we have both -- accompanying guests and notes
					if ( (!!_eachItem['notes'] && !!_eachItem['notes'].length) &&
							(!!_eachItem['accompanying_names'] && !!_eachItem['accompanying_names'].length) ) {

						for (k = 0, l = _eachItem['notes'].length; k < l; k++) {
							_eachGuestNote = angular.copy( _eachItem['notes'][k] );
							if ( k == 0 ) {
								_eachGuestNote.isHeading = true;
								_eachGuestNote.guest = angular.copy( _eachItem['accompanying_names'] );
								_eachGuestNote.tdRowSpan = _eachItem['notes'].length;
							};
							_eachGuestNote.isGuest_n_Note = true;
							_customItems.push( _eachGuestNote );
						};
					};

					// additional date time split for 'Login and out Activity' report
					if ( $scope.parsedApiFor == 'Login and out Activity' ) {
						if ( !!_eachItem['date'] ) {
							_uiDate = _eachItem['date'].split(', ')[0];
							_uiTime = _eachItem['date'].split(', ')[1];
							_eachItem['uiDate'] = _uiDate;
							_eachItem['uiTime'] = _uiTime;
						};
					};

					// since this tr won't have any (figurative) childs
					if ( !_customItems.length ) {
						_eachItem.trCls = 'row-break';
					};

					// if we found custom items
					// set row span for the parent tr a rowspan
					// mark the class that must be added to the last tr
					if ( !!_customItems.length ) {
						_eachItem.rowspan = _customItems.length + 1;
						_customItems[_customItems.length - 1]['trCls'] = 'row-break';
					};

					// check for invalid login for 'Login and out Activity' report 
					if ( !!_eachItem['action_type'] && _eachItem['action_type'] == 'INVALID_LOGIN' ) {
						_eachItem['action_type'] = 'INVALID LOGIN';
						_eachItem.trCls = 'row-break invalid';
					};

					// check for no user name for 'Login and out Activity' report 
					if ( _eachItem.hasOwnProperty('user_name') && !_eachItem['user_name'] ) {
						_eachItem['user_name'] = 'NA';
					};

					// push '_eachItem' into '_retResult'
					_eachItem.isReport = true;
					_retResult.push( _eachItem );

					// push each item in '_customItems' in to '_retResult'
					for (m = 0, n = _customItems.length; m < n; m++) {
						_retResult.push( _customItems[m] );
					};
				};

				// dont remove yet
				console.log( 'API reponse changed as follows: ');
				console.log( _retResult );

			} else if ($scope.parsedApiFor == 'Arrival' || $scope.parsedApiFor == 'In-House Guests') {



				var itemCopy   = {};
				var customData = [];
				var guestData  = {};
				var noteData   = {};
				var cancelData = {};

				var excludeReports = function(names) {
					return !!_.find(names, function(n) {
						return n == $scope.parsedApiFor;
					});
				};

				var checkGuest = function(item) {
					var guests = !!item['accompanying_names'] && !!item['accompanying_names'].length;
					var compTravelGrp = !!item['company_name'] || !!item['travel_agent_name'] || !!item['group_name'];

					return guests || compTravelGrp ? true : false;
				};

				var checkNote = function(item) {
					return !!item['notes'] && !!item['notes'].length;
				};

				var checkCancel = function(item) {
					return excludeReports(['Arrival', 'In-House Guests']) ? !!item['cancel_reason'] : false;
				};

				i = j = 0;

				for (i = 0, j = apiResponse.length; i < j; i++) {
					itemCopy   = angular.copy( apiResponse[i] );
					customData = [];
					guestData  = {};
					noteData   = {};
					cancelData = {};

					if ( checkGuest(itemCopy) ) {
						guestData = {
							isGuestData : true,
							guestNames  : angular.copy( itemCopy['accompanying_names'] ),

							company_name      : itemCopy.company_name,
							travel_agent_name : itemCopy.travel_agent_name,
							group_name        : itemCopy.group_name,

							addOns : angular.copy( itemCopy['add_ons'] )
						};
						customData.push( guestData );
					};

					if ( checkCancel(itemCopy) ) {
						_cancelRes = {
							isCancelData : true,
							reason       : angular.copy( itemCopy['cancel_reason'] )
						};
						customData.push( cancelData );
					};

					if ( checkNote(itemCopy) ) {
						noteData = {
							isNoteData : true,
							note       : angular.copy( itemCopy['notes'] )
						}
					};

					// IF: we found custom items
						// set row span for the parent tr a rowspan
						// mark the class that must be added to the last tr
					// ELSE: since this tr won't have any childs, mark the class that must be added to the last tr
					if ( !!customData.length ) {
						itemCopy.rowspan = customData.length + 1;
						customData[customData.length - 1]['trCls'] = 'row-break';
					} else {
						itemCopy.trCls = 'row-break';
					};

					// push 'itemCopy' into '_retResult'
					itemCopy.isReport = true;
					_retResult.push( itemCopy );

					// push each item in 'customData' in to '_retResult'
					for (m = 0, n = customData.length; m < n; m++) {
						_retResult.push( customData[m] );
					};
				}


				// dont remove yet
				console.log( 'API reponse changed as follows: ');
				console.log( _retResult );

			} else {
				_retResult = apiResponse;
			};

			return _retResult;
		};


    }
]);