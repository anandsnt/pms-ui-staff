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

		$scope.$on('destroy', destroyScrolls);



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

			_.each(dateObj, function(dateObj) {

				var eachDateVal = [];

				if (2 == $scope.colSpan) {
					eachDateVal.push({
						value: dateObj['total_reservations_count'],
						isAvail: true
					});
					eachDateVal.push({
						value: dateObj['available_rooms_count'],
						isAvail: true,
						cls: 'last-day'
					});
				} else if (3 == $scope.colSpan) {
					eachDateVal.push({
						value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
						isRev: true
					});
					eachDateVal.push({
						value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
						isRev: true
					});
					eachDateVal.push({
						value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
						isRev: true,
						cls: 'last-day'
					});
				} else if (5 == $scope.colSpan) {
					eachDateVal.push({
						value: dateObj['total_reservations_count'],
						isAvail: true
					});
					eachDateVal.push({
						value: dateObj['available_rooms_count'],
						isAvail: true
					});
					eachDateVal.push({
						value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
						isRev: true
					});
					eachDateVal.push({
						value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
						isRev: true
					});
					eachDateVal.push({
						value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
						isRev: true,
						cls: 'last-day'
					});
				};

				parsedData = parsedData.concat(_.extend(eachDateVal, {
					isRateType: isRateType
				}));



			});

			return parsedData;
		};


		var processData = function() {
			var SUB_HEADER_NAMES = [
				'Rooms #',
				'Avl. Rooms',
				/**/
				'Rate Rev.',
				'ADR',
				'Actual Rev.'
			];

			var startIndex, endIndex, triggerIndex;

			if ($scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
				$scope.colSpan = 5;
			} else if (!$scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
				$scope.colSpan = 3;
			} else if ($scope.uiFilter.showAvailability && !$scope.uiFilter.showRevenue) {
				$scope.colSpan = 2;
			};

			$scope.headerTop = [];
			$scope.headerBot = [];


			var allDatesValInRoom = [],
				eachDateVal = [];
			$scope.reportData = []; // this will be an array of arrays
			$scope.yAxisLabels = []; // keeping seperate array so that we can avoid object being itrated aphabetically


			var roomObj, dateObj;

			var loopCount = 0;


			var noOfDays = 0,
				cellWidth = 80;

			$scope.rightPaneWidth = 0;

			// compute Number of Days here!
			// 
			for (ms = new tzIndependentDate($scope.chosenReport.fromDate) * 1, last = new tzIndependentDate($scope.chosenReport.untilDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {

				$scope.headerTop.push($filter('date')(ms, $rootScope.shortMonthAndDate));

				if (5 == $scope.colSpan) {
					startIndex = 0;
					endIndex = SUB_HEADER_NAMES.length;
					triggerIndex = SUB_HEADER_NAMES.length - 1;
				} else if (3 == $scope.colSpan) {
					startIndex = 2;
					endIndex = SUB_HEADER_NAMES.length;
					triggerIndex = SUB_HEADER_NAMES.length - 1;
				} else if (2 == $scope.colSpan) {
					startIndex = 0;
					endIndex = 1 + 1;
					triggerIndex = 1;
				};
				for (; startIndex < endIndex; startIndex++) {
					$scope.headerBot.push({
						'name': SUB_HEADER_NAMES[startIndex],
						'cls': startIndex == triggerIndex ? 'day-end' : ''
					});
				};

				noOfDays += 1;
			}

			var results = {
					rates: [{
						rate_name: "A Rate",
						rate_type_id: 1,
						data: {
							"2015-09-01": {
								"available_rooms_count": -1,
								"total_reservations_count": 6,
								"rate_revenue": "517.00",
								"adr": "86.17",
								"actual_revenue": "290.38"
							},
							"2015-09-02": {
								"available_rooms_count": -2,
								"total_reservations_count": 6,
								"rate_revenue": "517.00",
								"adr": "86.17",
								"actual_revenue": "290.38"
							}
						}
					}, {
						rate_name: "B Rate",
						rate_type_id: 1,
						data: {
							"2015-09-01": {
								"available_rooms_count": -3,
								"total_reservations_count": 6,
								"rate_revenue": "517.00",
								"adr": "86.17",
								"actual_revenue": "290.38"
							},
							"2015-09-02": {
								"available_rooms_count": -4,
								"total_reservations_count": 6,
								"rate_revenue": "517.00",
								"adr": "86.17",
								"actual_revenue": "290.38"
							}
						}
					}],
					rate_types: [{
						rate_type_name: 'A Rate Type',
						rate_type_id: 1,
						data: {
							"2015-09-01": {
								"available_rooms_count": -5,
								"total_reservations_count": 6,
								"rate_revenue": "517.00",
								"adr": "86.17",
								"actual_revenue": "290.38"
							},
							"2015-09-02": {
								"available_rooms_count": -6,
								"total_reservations_count": 6,
								"rate_revenue": "517.00",
								"adr": "86.17",
								"actual_revenue": "290.38"
							}
						}
					}]
				},
				showRates = true,
				showRateTypes = true,
				primaryDataSet = results.rates;

			if (!showRates) {
				primaryDataSet = result.rate_types;
			}

			//Parse Rates OR Rate Types based on the filter here
			_.each(primaryDataSet, function(rate, rateId) {

				if (showRateTypes) {
					var isAlreadyAccounted = _.findWhere($scope.yAxisLabels, {
						rate_type_id: rate.rate_type_id
					});
					var rateTypeData = _.findWhere(results.rate_types, {
						rate_type_id: rate.rate_type_id
					});
					if (!isAlreadyAccounted) {
						$scope.yAxisLabels.push({
							name: rateTypeData.rate_type_name,
							rate_type_id: rateTypeData.rate_type_id,
							is_rate_type: true
						});

						$scope.reportData.push(parseDailyData(rateTypeData.data, true));
					}


				}

				if (showRates) {
					$scope.yAxisLabels.push({
						name: rate.rate_name,
						rate_type_id: rate.rate_type_id,
						is_rate_type: false
					});
					$scope.reportData.push(parseDailyData(rate.data, false));
				}

			});

			$scope.rightPaneWidth = noOfDays * cellWidth * $scope.colSpan;

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
					'reportData': $scope.reportData
				});

			React.renderComponent(
				DPContent(props),
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

		$scope.$on('destroy', reportSubmited);
		$scope.$on('destroy', reportUpdated);
		$scope.$on('destroy', reportPrinting);
		$scope.$on('destroy', reportPageChanged);
	}
]);