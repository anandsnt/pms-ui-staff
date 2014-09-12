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
			$scope.refreshScroller( 'report-details-scroll' );
			$scope.$parent.myScroll['report-details-scroll'].scrollTo(0, 0, 100);
		};
		
		// common methods to do things after fetch report
		var afterFetch = function() {
			var totals          = $scope.$parent.totals,
				headers         = $scope.$parent.headers,
				subHeaders      = $scope.$parent.subHeaders,
				results         = $scope.$parent.results,
				resultsTotalRow = $scope.$parent.resultsTotalRow;


			$scope.chosenReport = RVreportsSrv.getChoosenReport();
			$scope.$parent.heading = $scope.chosenReport.title + ' ' + $scope.chosenReport.sub_title;


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
			if ( $scope.chosenReport.title === 'Web Check Out Conversion' ) {
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
			    if ( $scope.chosenReport.title === 'Web Check Out Conversion' ) {
			    	$scope.restHalf[$scope.restHalf.length - 1]['class'] = 'orange';
			    };
			};


			// change date format for all
			for (var i = 0, j = results.length; i < j; i++) {
			    results[i][0] = $filter('date')(results[i][0], 'MM-dd-yyyy');

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
			    }
			}


			// hack to set the colspan for reports details tfoot - 'Check In / Check Out' or 'Upsell'
			$scope.leftColSpan  = $scope.chosenReport.title === 'Check In / Check Out' || $scope.chosenReport.title === 'Upsell' ? 4 : 2;
			$scope.rightColSpan = $scope.chosenReport.title === 'Check In / Check Out' || $scope.chosenReport.title === 'Upsell' ? 5 : 2;

			// hack to set the colspan for reports details tfoot - 'Web Check Out Conversion''
			$scope.leftColSpan  = $scope.chosenReport.title === 'Web Check Out Conversion' ? 6 : $scope.leftColSpan;
			$scope.rightColSpan = $scope.chosenReport.title === 'Web Check Out Conversion' ? 6 : $scope.rightColSpan;

			// scroller refresh and reset position
			refreshScroll();

			// need to keep a separate object to show the date stats in the footer area
			// dirty hack to get the val() not model value
			// delay as it cost time for ng-bindings
			$timeout(function() {
				$scope.displayedReport = {};
				$scope.displayedReport.fromDate = $( '#chosenReportFrom' ).val();
				$scope.displayedReport.untilDate = $( '#chosenReportTo' ).val();
			}, 100);
		};

		// we are gonna need to drop some pagination
		// this is done only once when the report details is loaded
		// and when user updated the filters
		var calPagination = function(response, pageNum) {
		    var results =        $scope.$parent.results,
		    	totalCount =     $scope.$parent.totalCount,
		    	resultsPerPage = $scope.$parent.resultsPerPage,
		    	pageNum =        typeof pageNum == "undefined" ? 1 : pageNum;

		    $scope.pagination = [];

		    if (results.length < totalCount) {
		        var pages = Math.floor( totalCount / resultsPerPage );
		        var extra = totalCount % results.length;

		        if (extra > 0) {
		            pages++;
		        };

		        for (var i = 1; i <= pages; i++) {
		            $scope.pagination.push({
		                no: i,
		                active: i === pageNum ? true : false
		            })
		        };
		    };
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
		        if ( typeof $scope.chosenReport.chosenUsers === 'number' ) {

		            // first find the full name
		            var name = _.find($scope.userList, function(user) {
		                return user.id === $scope.chosenReport.chosenUsers;
		            });

		            $scope.userNames = name.full_name || false;
		        } else {
		            
		            // if there are more than one user
		            for (var i = 0, j = $scope.chosenReport.chosenUsers.length; i < j; i++) {

		                // first find the full name
		                var name = _.find($scope.userList, function(user) {
		                    return user.id === $scope.chosenReport.chosenUsers[i];
		                    });

		                $scope.userNames += name.full_name + (i < j ? ', ' : '');
		            };
		        }
		    };
		};

		// fetch next page on pagination change
		$scope.fetchNextPage = function(returnToPage) {
			if ( !!returnToPage ) {
				$scope.genReport( false, returnToPage );
			} else {
				// user clicked on current page
				if (this.page.active) {
				    return;
				};

				// change the current active number
				var currPage = _.find($scope.pagination, function(page) {
				    return page.active === true
				});
				currPage.active = false;
				this.page.active = true;

				$scope.genReport( false, this.page.no );
			}
		};

		// fetch next page on pagination change
		$scope.fetchUpdatedReport = function() {
		    $scope.genReport( false );
		};

		//loads the content in the existing report view in the DOM.
		$scope.fetchFullReport = function() {

			// since we are loading the entire report and show its print preview
			// we need to keep a back up of the original report with its pageNo
		    $scope.returnToPage = 1;

		    // now since we are gonna update the filter
		    // we are gonna start from page one
		    var currPage = _.find($scope.pagination, function(page) {
		        return page.active === true
		    });

		    if( currPage ){
		       $scope.returnToPage = currPage.no;
		    }

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

		var reportSubmit = $rootScope.$on('report.submit', function() {
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