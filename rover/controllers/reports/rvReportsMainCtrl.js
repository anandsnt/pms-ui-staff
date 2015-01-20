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
		$scope.setTitle(listTitle);
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



		/**
		 * inorder to refresh after list rendering
		 */
		$scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event) {
			$scope.refreshScroller('report-list-scroll');
		});

		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
			},
			onClose: function(value) {
				$('#ui-datepicker-div');
				$('#ui-datepicker-overlay').remove();
				$scope.showRemoveDateBtn();
			}
		};

		$scope.fromDateOptions = angular.extend({
			maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.untilDateOptions.minDate = value;
			}
		}, datePickerCommon);
		$scope.untilDateOptions = angular.extend({
			maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.fromDateOptions.maxDate = value;
			}
		}, datePickerCommon);

		$scope.fromDateOptionsNoLimit = angular.extend({}, datePickerCommon);
		$scope.untilDateOptionsNoLimit = angular.extend({}, datePickerCommon);



		$scope.showRemoveDateBtn = function() {
			var cancellationReport = _.find($scope.reportList, function(item) {
				return item.title == 'Cancelation & No Show';
			});

			if (!!cancellationReport['fromDate'] && !!cancellationReport['untilDate'] && (!!cancellationReport['fromCancelDate'] || !!cancellationReport['untilCancelDate'])) {
				cancellationReport['showRemove'] = true;
			};

			if (!!cancellationReport['fromCancelDate'] && !!cancellationReport['untilCancelDate'] && (!!cancellationReport['fromDate'] || !!cancellationReport['untilDate'])) {
				cancellationReport['showRemove'] = true;
			};
		};

		$scope.clearDateFromFilter = function(list, key1, key2) {
			if (list.hasOwnProperty(key1) && list.hasOwnProperty(key2)) {
				list[key1] = undefined;
				list[key2] = undefined;
				list['showRemove'] = false;
			};
		};



		// auto correct the CICO value;
		var getProperCICOVal = function(type) {
			var chosenReport = RVreportsSrv.getChoosenReport();

			// only do this for this report
			// I know this is ugly :(
			if (chosenReport.title !== 'Check In / Check Out') {
				return;
			};

			// if user has not chosen anything
			// both 'checked_in' & 'checked_out' must be true
			if (!chosenReport.chosenCico) {
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

		var chosenList = [
            'chosenIncludeNotes',
            'chosenIncludeCancelled',
            'chosenIncludeVip',
            'chosenIncludeNoShow',
            'chosenIncludeRoverUsers',
            'chosenIncludeZestUsers',
            'chosenIncludeZestWebUsers'
        ];

        var hasList = [
            'hasIncludeNotes',
            'hasIncludeCancelled',
            'hasIncludeVip',
            'hasIncludeNoShow',
            'hasIncludeRoverUsers',
            'hasIncludeZestUsers',
            'hasIncludeZestWebUsers'
        ];

		// common faux select method
		$scope.fauxSelectClicked = function(e, item) {
			// if clicked outside, close the open dropdowns
			if ( !e ) {
				_.each($scope.reportList, function(item) {
					item.fauxSelectOpen = false;
				});
				return;
			};

			if ( !item ) {
				return;
			};

			e.stopPropagation();
			item.fauxSelectOpen = item.fauxSelectOpen ? false : true;

			//$scope.fauxOptionClicked(e, item);
		};

		$scope.fauxOptionClicked = function(e, item) {
			e.stopPropagation();

			var selectCount = 0,
				maxCount    = 0,
				eachTitle   = '';

			item.fauxTitle = '';
			for (var i = 0, j = chosenList.length; i < j; i++) {
				if ( item.hasOwnProperty(chosenList[i]) ) {
					maxCount++;
					if ( item[chosenList[i]] == true ) {
						selectCount++;
						eachTitle = item[hasList[i]].description;
					};
				};
			};

			if ( selectCount == 0 ) {
				item.fauxTitle = 'Select';
			} else if ( selectCount == 1 ) {
				item.fauxTitle = eachTitle;
			} else if ( selectCount > 1 ) {
				item.fauxTitle = selectCount + ' Selected';
			};
		};

		$scope.showFauxSelect = function(item) {
            if ( !item ) {
            	return false;
            };

            return _.find(hasList, function(has) { return item.hasOwnProperty(has) }) ? true : false;
        };
		
		// generate reports
		$scope.genReport = function(changeView, loadPage, resultPerPageOverride) {
			var chosenReport = RVreportsSrv.getChoosenReport(),
				changeView = typeof changeView === 'boolean' ? changeView : true,
				page = !!loadPage ? loadPage : 1;

			// create basic param
			var params = {
				id: chosenReport.id,
				page: page,
				per_page: resultPerPageOverride || $scope.resultsPerPage
			};

			// include dates
			if (!!chosenReport.hasDateFilter) {
				params['from_date'] = $filter('date')(chosenReport.fromDate, 'yyyy/MM/dd');
				params['to_date'] = $filter('date')(chosenReport.untilDate, 'yyyy/MM/dd');
			};

			// include cancel dates
			if (!!chosenReport.hasCancelDateFilter) {
				params['cancel_from_date'] = $filter('date')(chosenReport.fromCancelDate, 'yyyy/MM/dd');
				params['cancel_to_date'] = $filter('date')(chosenReport.untilCancelDate, 'yyyy/MM/dd');
			};

			//// include arrival dates
			if (!!chosenReport.hasArrivalDateFilter) {
				params['arrival_from_date'] = $filter('date')(chosenReport.fromArrivalDate, 'yyyy/MM/dd');
				params['arrival_to_date'] = $filter('date')(chosenReport.untilArrivalDate, 'yyyy/MM/dd');
			};

			// include times
			if (chosenReport.hasTimeFilter) {
				params['from_time'] = chosenReport.fromTime || '';
				params['to_time'] = chosenReport.untilTime || '';
			};

			// include CICO filter 
			if (!!chosenReport.hasCicoFilter) {
				params['checked_in'] = getProperCICOVal('checked_in');
				params['checked_out'] = getProperCICOVal('checked_out');
			};

			// include user ids
			if (chosenReport.hasUserFilter) {
				params['user_ids'] = chosenReport.chosenUsers || [];
			};

			// include sort bys
			if (chosenReport.sortByOptions) {
				params['sort_field'] = chosenReport.chosenSortBy || '';

				var chosenSortBy = _.find(chosenReport.sortByOptions, function(item) {
					return item.value == chosenReport.chosenSortBy;
				});
				if (!!chosenSortBy && typeof chosenSortBy.sortDir == 'boolean') {
					params['sort_dir'] = chosenSortBy.sortDir;
				};
			};

			// include notes
			if (!!chosenReport.hasIncludeNotes) {
				params['include_notes'] = chosenReport.chosenIncludeNotes;
			};

			// include user ids
			if (chosenReport.hasIncludeVip) {
				params['vip_only'] = chosenReport.chosenIncludeVip;
			};

			// include cancelled
			if (chosenReport.hasIncludeCancelled) {
				params['include_canceled'] = chosenReport.chosenIncludeCancelled;
			};

			// include no show
			if (chosenReport.hasIncludeNoShow) {
				params['include_no_show'] = chosenReport.chosenIncludeNoShow;
			};

			// include market
			if (chosenReport.hasMarket) {
				params['include_market'] = chosenReport.showMarket;
			};

			// include source
			if (chosenReport.hasSource) {
				params['include_source'] = chosenReport.showSource;
			};


			var callback = function(response) {
				if (changeView) {
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

				$scope.$emit('hideLoader');

				if (!changeView && !loadPage) {
					$rootScope.$emit('report.updated');
				} else if (!!loadPage && !resultPerPageOverride) {
					$rootScope.$emit('report.page.changed');
				} else if (!!resultPerPageOverride) {
					$rootScope.$emit('report.printing');
				} else {
					$rootScope.$emit('report.submit');
				}
			};

			$scope.invokeApi(RVreportsSrv.fetchReportDetails, params, callback);
		};
	}
]);