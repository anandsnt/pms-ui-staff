sntRover.controller('RVDailyProdRateReportCtrl', [
	'$rootScope',
	'$scope',
	'RVreportsSrv',
	'RVreportsSubSrv',
	'RVReportUtilsFac',
	'RVReportParamsConst',
	'RVReportMsgsConst',
	'RVReportNamesConst',
	'$filter',
	'$timeout',
	'ngDialog',
	function($rootScope, $scope, reportsSrv, reportsSubSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, ngDialog) {
		BaseCtrl.call(this, $scope);

		var detailsCtrlScope = $scope.$parent,
			mainCtrlScope = detailsCtrlScope.$parent,
			chosenReport = detailsCtrlScope.chosenReport;



		var LEFT_PANE_SCROLL = 'left-pane-scroll',
			RIGHT_PANE_SCROLL = 'right-pane-scroll';

		$scope.setScroller(LEFT_PANE_SCROLL, {
			'preventDefault': false,
			'probeType': 3
		});

		$scope.setScroller(RIGHT_PANE_SCROLL, {
			'preventDefault': false,
			'probeType': 3,
			'scrollX': true
		});

		var refreshScrollers = function() {
			if (!!mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL)) {
				$scope.refreshScroller(LEFT_PANE_SCROLL);
			};

			if (!!mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL)) {
				$scope.refreshScroller(RIGHT_PANE_SCROLL);
			};
		};

		var setupScrollListner = function() {
			mainCtrlScope.myScroll[LEFT_PANE_SCROLL]
				.on('scroll', function() {
					mainCtrlScope.myScroll[RIGHT_PANE_SCROLL]
						.scrollTo(0, this.y);
				});

			mainCtrlScope.myScroll[RIGHT_PANE_SCROLL]
				.on('scroll', function() {
					mainCtrlScope.myScroll[LEFT_PANE_SCROLL]
						.scrollTo(0, this.y);
				});
		};

		var isScrollReady = function isScrollReady() {
			if (!!mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) && !!mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL)) {
				setupScrollListner();
			} else {
				$timeout(isScrollReady, 1000);
			};
		};
		isScrollReady();

		var destroyScrolls = function() {
			mainCtrlScope.myScroll[LEFT_PANE_SCROLL].destroy();
			delete mainCtrlScope.myScroll[LEFT_PANE_SCROLL];

			mainCtrlScope.myScroll[RIGHT_PANE_SCROLL].destroy();
			delete mainCtrlScope.myScroll[RIGHT_PANE_SCROLL];
		};

		$scope.$on('$destroy', destroyScrolls);



		// default colspan value
		$scope.colSpan = 5;

		// ui filter by default showing both avail. and rev.
		$scope.uiFilter = {
			'showAvailability': true,
			'showRevenue': true
		};

		// cant disable both, when one disabled one the other should be enabled
		$scope.$watch('uiFilter.showAvailability', function(newValue) {
			if (false == newValue && !$scope.uiFilter.showRevenue) {
				$scope.uiFilter.showRevenue = true;
			}

			$scope.$emit('showLoader');
			$timeout(reInit, 100);
		});

		// cant disable both, when one disabled one the other should be enabled
		$scope.$watch('uiFilter.showRevenue', function(newValue) {
			if (false == newValue && !$scope.uiFilter.showAvailability) {
				$scope.uiFilter.showAvailability = true;
			};

			$scope.$emit('showLoader');
			$timeout(reInit, 300);
		});

		var parseDailyData = function(dateObj, isRateType) {

			var parsedData = [];

			_.each(dateObj, function(dateObj, currDate) {

				var eachDateVal = [],
					isPastDay = new tzIndependentDate(currDate) < new tzIndependentDate($rootScope.businessDate);


				if ($scope.uiFilter.showAvailability && !$scope.uiFilter.showRevenue) {
					eachDateVal.push({
						value: dateObj['total_reservations_count'],
						isAvail: true,
						isRateType: isRateType
					});
					eachDateVal.push({
						value: dateObj['available_rooms_count'],
						isAvail: true,
						isRateType: isRateType
					});
				} else if (!$scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
					if (!isPastDay) {
						eachDateVal.push({
							value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
							isRev: true,
							isRateType: isRateType
						});
					}
					eachDateVal.push({
						value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
						isRev: true,
						isRateType: isRateType
					});
					if (isPastDay) {
						eachDateVal.push({
							value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
							isRev: true,
							isRateType: isRateType
						});
					}
				} else if ($scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
					eachDateVal.push({
						value: dateObj['total_reservations_count'],
						isAvail: true,
						isRateType: isRateType
					});
					eachDateVal.push({
						value: dateObj['available_rooms_count'],
						isAvail: true,
						isRateType: isRateType
					});
					if (!isPastDay) {
						eachDateVal.push({
							value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
							isRev: true,
							isRateType: isRateType
						});
					}
					eachDateVal.push({
						value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
						isRev: true,
						isRateType: isRateType
					});

					if (isPastDay) {
						eachDateVal.push({
							value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
							isRev: true,
							isRateType: isRateType
						});
					}
				};

				//TODO: If user has opted to show addon revenue, add that as a column
				if (isPastDay && $scope.chosenReport.chosenOptions['include_addon_revenue'] && $scope.uiFilter.showRevenue) {
					eachDateVal.push({
						value: $filter('currency')(dateObj['addon_revenue'], $rootScope.currencySymbol, 2),
						isRev: true,
						cls: 'last-day',
						isRateType: isRateType
					});
				} else {
					eachDateVal[eachDateVal.length - 1]['cls'] = 'last-day';
				}

				parsedData = parsedData.concat(eachDateVal);

			});

			return parsedData;
		};


		var processData = function() {
			var SUB_HEADER_NAMES = {
					'ROOMS': 'Rooms #',
					'AVAILABLE_ROOMS': 'Avl. Rooms',
					/**/
					'FORECAST': 'Forecast.',
					'ADR': 'ADR',
					'ACTUAL': 'Actual Rev.',
					/**/
					'ADDON': 'Add-on' //>> This is to be shown IFF 'Options'->'Include Add-on Revenue' is checked
				},
				headers,
				allDatesValInRoom = [],
				eachDateVal = [],
				noOfDays = 0,
				cellWidth = 80;

			$scope.headerTop = [];
			$scope.headerBot = [];
			$scope.colspanArray = [];
			$scope.reportData = []; // this will be an array of arrays
			$scope.yAxisLabels = []; // keeping seperate array so that we can avoid object being itrated aphabetically
			$scope.rightPaneWidth = 0;

			if ($scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
				headers = ['ROOMS', 'AVAILABLE_ROOMS', 'FORECAST', 'ADR']; // Header is initialized to FORECAST, If past date is selected it will be replaced with ACTUAL column
			} else if (!$scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
				headers = ['FORECAST', 'ADR'];
			} else if ($scope.uiFilter.showAvailability && !$scope.uiFilter.showRevenue) {
				headers = ['ROOMS', 'AVAILABLE_ROOMS'];
			};

			$scope.colSpan = headers.length;

			// compute Number of Days here!
			for (ms = new tzIndependentDate($scope.chosenReport.fromDate) * 1, last = new tzIndependentDate($scope.chosenReport.untilDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {

				var isPastDay = new tzIndependentDate(ms) < new tzIndependentDate($rootScope.businessDate);

				$scope.headerTop.push($filter('date')(ms, $rootScope.shortMonthAndDate));
				var currentHeaders = headers;
				if (isPastDay && $scope.uiFilter.showRevenue) {
					// Remove FORECAST header and push ACTUAL
					currentHeaders = _.without(currentHeaders, 'FORECAST').concat(['ACTUAL']);
					if ($scope.chosenReport.chosenOptions['include_addon_revenue']) {
						currentHeaders.push('ADDON');
					}
				}

				$scope.colspanArray.push(currentHeaders.length);

				_.each(currentHeaders, function(idx) {
					$scope.headerBot.push({
						'name': SUB_HEADER_NAMES[idx],
						'cls': idx == headers.length - 1 ? 'day-end' : ''
					});
				});

				noOfDays += 1;
			}

			var results = $scope.results;

			//Parse Rates OR Rate Types based on the filter here
			_.each(results.rate_types, function(rateTypeData) {
				$scope.yAxisLabels.push({
					name: rateTypeData.rate_type_name,
					rate_type_id: rateTypeData.rate_type_id,
					is_rate_type: true
				});

				$scope.reportData.push(parseDailyData(rateTypeData.data, true));
				//Put rates under the rate type
				var rates = _.filter(results.rates, {
					rate_type_id: rateTypeData.rate_type_id,
				});
				_.each(rates, function(rate) {
					$scope.yAxisLabels.push({
						name: rate.rate_name,
						rate_type_id: rate.rate_type_id,
						is_rate_type: false
					});
					$scope.reportData.push(parseDailyData(rate.data, false));
				});
			});

			$scope.rightPaneWidth = noOfDays * cellWidth * _.max($scope.colspanArray);

			$timeout(function() {
				refreshScrollers();
				$scope.$emit('hideLoader');
			}, 300);
		};


		function renderReact(args) {
			var args = args || {},
				props = _.extend(args, {
					'rightPaneWidth': $scope.rightPaneWidth,
					'colspan': $scope.colSpan,
					'headerTop': $scope.headerTop,
					'headerBot': $scope.headerBot,
					'reportData': $scope.reportData,
					'colspanArray': $scope.colspanArray,
					'isLastRowSum': false
				});

			ReactDOM.render(
				React.createElement(DPContent, props),
				document.getElementById('daily-production-render')
			);
		};

		function init(argument) {
			processData();
			renderReact();
		};

		init();

		function reInit(argument) {
			processData();
			renderReact();
		};



		// re-render must be initiated before for taks like printing.
		// thats why timeout time is set to min value 50ms
		var reportSubmited = $scope.$on(reportMsgs['REPORT_SUBMITED'], reInit);
		var reportPrinting = $scope.$on(reportMsgs['REPORT_PRINTING'], reInit);
		var reportUpdated = $scope.$on(reportMsgs['REPORT_UPDATED'], reInit);
		var reportPageChanged = $scope.$on(reportMsgs['REPORT_PAGE_CHANGED'], reInit);

		$scope.$on('$destroy', reportSubmited);
		$scope.$on('$destroy', reportUpdated);
		$scope.$on('$destroy', reportPrinting);
		$scope.$on('$destroy', reportPageChanged);
	}
]);