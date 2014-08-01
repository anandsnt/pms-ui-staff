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
		    title: 'Reports',
		    callback: 'goBackReportList',
		    scope: $scope
		};

		$scope.setTitle( 'Stats & Reports' );

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
		};

		$scope.getFromOptions = function(item) {
		    return {
		        dateFormat: 'mm-dd-yy',
		        numberOfMonths: 1,
		        maxDate: tzIndependentDate( item.untilDate ),
		        beforeShow: function(input, inst) {
                    $('#ui-datepicker-div');
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(dateText, inst) {
                    $('#ui-datepicker-div');
                    $('#ui-datepicker-overlay').remove();
                }
		    }
		};

		$scope.getUntilOptions = function(item) {
		    return {
		        dateFormat: 'mm-dd-yy',
		        numberOfMonths: 1,
		        minDate: tzIndependentDate( item.fromDate ),
		        maxDate: tzIndependentDate( $rootScope.businessDate ),
		        beforeShow: function(input, inst) {
                    $('#ui-datepicker-div');
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(dateText, inst) {
                    $('#ui-datepicker-div');
                    $('#ui-datepicker-overlay').remove();
                }
		    }
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
				fromDate     = tzIndependentDate( chosenReport.fromDate ),
				untilDate    = tzIndependentDate( chosenReport.untilDate ),
				changeView   = typeof changeView === 'boolean' ? changeView : true,
				page         = !!loadPage ? loadPage : 1;
				

		    if ( !fromDate || !untilDate ) {
		        return;
		    };

		    var params = {
		    	id:          chosenReport.id,
		    	from_date:   $filter( 'date' )( fromDate, 'yyyy/MM/dd' ),
		    	to_date:     $filter( 'date' )( untilDate, 'yyyy/MM/dd' ),
		    	user_ids:    chosenReport.chosenUsers || '',
		    	checked_in:  getProperCICOVal( 'checked_in' ),
		    	checked_out: getProperCICOVal( 'checked_out' ),
		    	sort_field:  chosenReport.chosenSortBy || '',
		    	page:        page,
		    	per_page:    resultPerPageOverride || $scope.resultsPerPage
		    }

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
