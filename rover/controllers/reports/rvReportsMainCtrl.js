sntRover.controller('RVReportsMainCtrl', [
	'$rootScope',
	'$scope',
	'reportsResponse',
	'RVreportsSrv',
	'$filter',
	function($rootScope, $scope, reportsResponse, RVreportsSrv, $filter) {

		BaseCtrl.call(this, $scope);

		// set a back button, by default keep hidden
		$rootScope.setPrevState = {
		    hide: true,
		    title: $filter('translate')('REPORTS'),
		    callback: 'goBackReportList',
		    scope: $scope,

		    // since there is no state change we must declare this explicitly
		    // else there can be errors in future animations
		    noStateChange: true
		};

		var listTitle = $filter('translate')('STATS_&_REPORTS_TITLE');
		$scope.setTitle( listTitle );
		$scope.heading = listTitle;
		$scope.$emit("updateRoverLeftMenu", "reports");

		$scope.reportList = reportsResponse.results;
		$scope.reportCount = reportsResponse.total_count;

		$scope.showReportDetails = false;

		// lets fix the results per page to, user can't edit this for now
		// 25 is the current number set by backend server
		$scope.resultsPerPage = 25;

		$scope.goBackReportList = function() {
			$rootScope.setPrevState.hide = true;
			$scope.showReportDetails = false;
			$scope.heading = listTitle;
		};

		$scope.fromDateOptions = {
			dateFormat: $rootScope.jqDateFormat,
			maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
			},
			onSelect: function(value) {
				$scope.untilDateOptions.minDate = value;
			},
			onClose: function(value) {
				$('#ui-datepicker-div');
				$('#ui-datepicker-overlay').remove();
			},
		};

		$scope.untilDateOptions = {
			dateFormat: $rootScope.jqDateFormat,
			maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
			},
			onSelect: function(value) {
				$scope.fromDateOptions.maxDate = value;
			},
			onClose: function(value) {
				$('#ui-datepicker-div');
				$('#ui-datepicker-overlay').remove();
			},
		};

		// auto correct the CICO value;
		var getProperCICOVal = function(type) {
			var chosenReport = RVreportsSrv.getChoosenReport();

		    // only do this for this report
		    // I know this is ugly :(
		    if ( chosenReport.title !== 'Check In / Check Out' ) {
		        return;
		    };

		    // if user has not chosen anything
		    // both 'checked_in' & 'checked_out' must be true
		    if ( !chosenReport.chosenCico ) {
		        chosenReport.chosenCico = 'BOTH'
		        return true;
		    };

		    // for 'checked_in'
		    if (type === 'checked_in') {
		        return chosenReport.chosenCico === 'IN' || chosenReport.chosenCico === 'BOTH';
		    };

		    // for 'checked_out'
		    if (type === 'checked_out') {
		        return chosenReport.chosenCico === 'OUT' || chosenReport.chosenCico === 'BOTH';
		    };
		};

		// generate reports
		$scope.genReport = function(changeView, loadPage, resultPerPageOverride) {
			var chosenReport = RVreportsSrv.getChoosenReport(),
				fromDate     = chosenReport.fromDate,
				untilDate    = chosenReport.untilDate,
				changeView   = typeof changeView === 'boolean' ? changeView : true,
				page         = !!loadPage ? loadPage : 1;
				

		    if ( !fromDate || !untilDate ) {
		        return;
		    };

		    // create basic param
		    var params = {
		    	id       : chosenReport.id,
		    	page     : page,
		    	per_page : resultPerPageOverride || $scope.resultsPerPage
		    };

		    // include dates
			if ( !!chosenReport.hasDateFilter ) {
				params['from_date'] = $filter( 'date' )( fromDate, 'yyyy/MM/dd' );
				params['to_date']   = $filter( 'date' )( untilDate, 'yyyy/MM/dd' );
			};

			// include times
			if ( chosenReport.hasTimeFilter ) {
				params['from_time'] = chosenReport.fromTime || '';
				params['to_time']   = chosenReport.untilTime || '';
			};

			// include CICO filter 
			if ( !!chosenReport.hasCicoFilter ) {
				params['checked_in']  = getProperCICOVal( 'checked_in' );
				params['checked_out'] = getProperCICOVal( 'checked_out' );
			};

			// include user ids
			if ( chosenReport.hasUserFilter ) {
				params['user_ids'] = chosenReport.chosenUsers || [];
			};

			// include sort bys
			if ( chosenReport.sortByOptions ) {
				params['sort_field'] = chosenReport.chosenSortBy || '';

				var chosenSortBy = _.find(chosenReport.sortByOptions, function(item) {
					return item.value == chosenReport.chosenSortBy;
				});
				if ( !!chosenSortBy && typeof chosenSortBy.sortDir == 'boolean' ) {
					params['sort_dir'] = chosenSortBy.sortDir;
				};
			};

			// include notes
			if ( !!chosenReport.hasIncludeNotes ) {
				params['include_notes'] = chosenReport.chosenIncludeNotes;
			};

			// include user ids
			if ( chosenReport.hasIncludeVip ) {
				params['vip_only'] = chosenReport.chosenIncludeVip;
			};

			// include cancelled
			if ( chosenReport.hasIncludeCancelled ) {
				params['include_canceled'] = chosenReport.chosenIncludeCancelled;
			};


		    var callback = function(response) {
		    	if ( changeView ) {
		    		$rootScope.setPrevState.hide = false;
		    		$scope.showReportDetails = true;
		    	};

		    	// fill in data into seperate props
		    	$scope.totals = response.totals;
		    	$scope.headers = response.headers;
		    	$scope.subHeaders = response.sub_headers;
		    	$scope.results = response.results;
		    	$scope.resultsTotalRow = response.results_total_row;

		    	// track the total count
		    	$scope.totalCount = response.total_count;
		    	$scope.currCount = response.results.length;

		    	$scope.$emit( 'hideLoader' );

		    	if ( !changeView && !loadPage ) {
		    		$rootScope.$emit( 'report.updated' );
		    	} else if ( !!loadPage && !resultPerPageOverride ) {
		    		$rootScope.$emit( 'report.page.changed' );
		    	} else if ( !!resultPerPageOverride ) {
		    		$rootScope.$emit( 'report.printing' );
		    	} else {
		    		$rootScope.$emit( 'report.submit' );
		    	}
		    };

           	$scope.invokeApi(RVreportsSrv.fetchReportDetails, params, callback);
		};
	}
]);